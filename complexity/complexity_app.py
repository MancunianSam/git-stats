from flask import Flask, request
from celery import Celery
import pymysql
import lizard
import os
from flask_socketio import join_room, SocketIO
from flask_cors import CORS
import json

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/'

base_dir = '/Users/sam.palmer/'

clients = {}

# Initialize Celery
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])

celery.conf.update(app.config)

app.config['SECRET_KEY'] = 'secret!'
CORS(app)
socketio = SocketIO()
socketio.init_app(app, message_queue=app.config['CELERY_BROKER_URL'], async_mode='threading')


def get_connection():
    return pymysql.connect(host='localhost', user='root', db='git_stats')


@app.route('/repository', methods=['POST'])
def build_repository():
    data = request.get_json()
    task = analyse_repository.delay(data['repository_name'], data['repository_url'], data['user_name'])
    return str(task.id)


@app.route('/repository/<repository_name>/<user_name>')
def is_build_complete(repository_name, user_name):
    repository = get_repository(repository_name, user_name)
    if repository is not None:
        task_id = repository[2]
        task = analyse_repository.AsyncResult(task_id)
        response = {
            'status': task.status,
            'task_id': task_id
        }
        if task.info is not None:
            response['current'] = task.info['current']
            response['total'] = task.info['total']
        return json.dumps(response)
    return json.dumps({
        'status': 'Pending'
    })


@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)


@celery.task(bind=True)
def analyse_repository(self, repository_name, repository_url, user_name):
    print('started')
    celerysocketio = SocketIO(message_queue='redis://localhost:6379/')
    self.update_state(state='RUNNING', meta={'current': 0, 'total': 100})

    os.system('git clone ' + repository_url + base_dir + repository_name + '/')
    repository_id = create_repository(repository_name, self.request.id, user_name)
    print(self.request.id)

    files = lizard.analyze(paths=[base_dir + repository_name],
                           exclude_pattern=['*/node_modules/*', '*/build/*'],
                           exts=lizard.get_extensions([]))

    files_list = list(files)[0:200]
    for idx, repository_file in enumerate(files_list):
        celerysocketio.emit('update', {'state': 'RUNNING',
                                       'complete': ((idx if idx != 0 else idx) / len(files_list)) * 100},
                            room=self.request.id)
        self.update_state(state='RUNNING', meta={'current': idx, 'total': len(files_list)})

        file_id = create_file(repository_file, repository_id)

        create_functions(repository_file, file_id)

        create_aggregate_tables()

        os.system('rm -rf /home/sam/' + repository_name)

    celerysocketio.emit('update', {'state': 'COMPLETE', 'complete': 100},
                        room=self.request.id)

    delete_repository(repository_name, user_name)


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
    return get_repository(repository, user_name)[0]


def delete_repository(repository_name, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'DELETE FROM repository where name = %s and user_name = %s'
        cursor.execute(sql, (repository_name, user_name,))
    connection.commit()


def get_repository(repository, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'SELECT * from repository where name = %s and user_name = %s'
        cursor.execute(sql, (repository, user_name,))
        return cursor.fetchone()


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
    socketio.run(app)
