from flask import Flask, request
from celery import Celery
import pymysql
import lizard
import json
import os

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/'

base_dir = '/home/sam/'

# Initialize Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)


def get_connection():
    return pymysql.connect(host='localhost', user='root', db='git_stats')


@app.route('/repository', methods=['POST'])
def build_repository():
    data = request.get_json()
    task = analyse_repository.delay(data['repository_name'], data['repository_url'], data['user_name'])
    return 'curl http://localhost:5000/repository/' + str(task.id)


@app.route('/repository/<task_id>')
def get_status(task_id):
    task = analyse_repository.AsyncResult(task_id)
    response = {
        'status': task.status
    }
    if task.info is not None:
        response['current'] = task.info['current']
        response['total'] = task.info['total']
    return json.dumps(response)


@celery.task(bind=True)
def analyse_repository(self, repository_name, repository_url, user_name):
    print('started')
    os.system('git clone ' + repository_url + ' /home/sam/' + repository_name + '/')
    repository_id = create_repository(repository_name, self.request.id, user_name)

    files = lizard.analyze(paths=[base_dir + repository_name],
                           exclude_pattern=['*/node_modules/*', '*/build/*'],
                           exts=lizard.get_extensions([]))

    files_list = list(files)
    for idx, repository_file in enumerate(files_list):
        self.update_state(state='RUNNING', meta={'current': idx, 'total': len(files_list)})

        file_id = create_file(repository_file, repository_id)

        create_functions(repository_file, file_id)

        create_aggregate_tables()

        os.system('rm -rf /home/sam/' + repository_name)


def create_aggregate_tables():
    connection = get_connection()
    with connection.cursor() as cursor:
        cursor.execute('insert into complexity_by_file select f.file_name, sum(fd.cyclomatic_complexity) from files f '
                       'join function_details fd on fd.file_id = f.id group by 1;')
        cursor.execute('insert into nloc_by_file select f.file_name, sum(fd.nloc) from files f join function_details '
                       'fd on fd.file_id = f.id group by 1;')
        cursor.execute('insert into nloc_by_repository select r.name, r.user_name, sum(f.nloc) from repository r join '
                       'files f on f.repository_id = r.id group by 1,2;')
        cursor.execute('insert into complexity_by_repository select r.name, r.user_name, '
                       'sum(fd.cyclomatic_complexity)  from repository r join files f on f.repository_id = r.id join '
                       'function_details fd on fd.file_id = f.id group by 1,2;')
    connection.commit()


def create_repository(repository, request_id, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'INSERT INTO repository (name, task_id, user_name) values (%s, %s, %s)'
        cursor.execute(sql, (repository, str(request_id), user_name,))
    connection.commit()
    print('Repository created')
    return get_repository(repository)


def get_repository(repository):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'SELECT id from repository where name = %s'
        cursor.execute(sql, (repository,))
        return cursor.fetchone()[0]


def create_file(repository_file, repository_id):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'INSERT INTO files (file_name, nloc, \
        repository_id) values (%s,%s,%s)'
        cursor.execute(sql, (repository_file.filename, repository_file.nloc, repository_id))
    connection.commit()
    print('File created')
    return get_file(repository_file.filename)


def get_file(file_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'SELECT id from files where file_name = %s'
        cursor.execute(sql, (file_name,))
        return cursor.fetchone()[0]


def create_functions(repository_file, file_id):
    if len(repository_file.function_list) > 0:
        connection = get_connection()
        with connection.cursor() as cursor:
            sql = 'INSERT INTO function_details (name, nloc, cyclomatic_complexity,\
            file_id) values (%s,%s,%s,%s)'

            functions = [(f.name, f.nloc, f.cyclomatic_complexity, file_id,) for f in
                         repository_file.function_list]
            cursor.executemany(sql, functions)
        connection.commit()
        print('Functions created')
        return connection.insert_id()


if __name__ == '__main__':
    app.run(debug=True)
