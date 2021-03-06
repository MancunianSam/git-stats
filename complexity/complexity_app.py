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
    return pymysql.connect(host='localhost', user='root', db='git_stats', autocommit=True)


@app.route('/repository', methods=['POST'])
def build_repository():
    data = request.get_json()
    task = analyse_repository.delay(data['repository_name'], data['repository_url'], data['user_name'])
    return str(task.id)


@app.route('/repository/<repository_name>/<user_name>')
def is_build_complete(repository_name, user_name):
    repository = get_repository(repository_name, user_name)
    if repository is not None:
        if repository[4] == 'complete':
            return json.dumps({'repository_id': repository[0], 'status': 'SUCCESS'})
        task_id = repository[2]
        task = analyse_repository.AsyncResult(task_id)
        response = {
            'repository_id': repository[0],
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

    # os.system('git clone ' + repository_url + base_dir + repository_name + '/')
    repository_id = create_repository(repository_name, self.request.id, user_name)
    print(self.request.id)

    files = lizard.analyze(paths=[base_dir + repository_name],
                           exclude_pattern=['*/node_modules/*', '*/build/*', '*/build-api/*'],
                           exts=lizard.get_extensions([]))

    files_list = list(files)
    for idx, repository_file in enumerate(files_list):
        celerysocketio.emit('update', {'state': 'RUNNING',
                                       'complete': ((idx if idx != 0 else idx) / len(files_list)) * 100,
                                       'repositoryId': repository_id,
                                       },
                            room=self.request.id)
        self.update_state(state='RUNNING', meta={'current': idx, 'total': len(files_list)})

        file_id = create_file(repository_name, repository_file, repository_id)

        create_functions(repository_file, file_id)

        # os.system('rm -rf /home/sam/' + repository_name)

    create_aggregate_tables(repository_id)

    celerysocketio.emit('update', {'state': 'SUCCESS', 'complete': 100,
                                   'repositoryId': repository_id
                                   },
                        room=self.request.id)

    update_repository_status(repository_name, user_name)


def path_to_dict(path):
    if 'node_modules' not in path:
        d = {'module': os.path.basename(path)}
        if os.path.isdir(path):
            d['children'] = [path_to_dict(os.path.join(path, x)) for x in os.listdir(path)]
            d['collapsed'] = True
        return d


def create_aggregate_tables(repository_id):
    connection = get_connection()
    print(repository_id)
    with connection.cursor() as cursor:
        cursor.execute(
            'insert into complexity_by_file select null, f.repository_id, f.id, sum(fd.complexity), '
            'sum(fd.nloc) from files f join function_details fd on fd.file_id = f.id where f.repository_id = %s group '
            'by 1,2,3;',
            (repository_id,))
        cursor.execute(
            'insert into complexity_by_function select null, f.repository_id, fd.id, sum(fd.complexity), '
            'sum(fd.nloc) from files f join function_details fd on fd.file_id = f.id where f.repository_id = %s group '
            'by 1,2,3;',
            (repository_id,))
        cursor.execute(
            'insert into complexity_by_repository select null, r.id, sum(fd.complexity), sum(f.nloc) from '
            'complexity_repository r join files f on f.repository_id = r.id join function_details fd on fd.file_id = '
            'f.id group '
            'by 1,2;')


def create_repository(repository, request_id, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'INSERT INTO complexity_repository (name, task_id, user_name) values (%s, %s, %s)'
        cursor.execute(sql, (repository, str(request_id), user_name,))
    print('Repository created')
    return get_repository(repository, user_name)[0]


def update_repository_status(repository_name, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'UPDATE complexity_repository set status = %s where name = %s and user_name = %s'
        cursor.execute(sql, ('complete', repository_name, user_name,))


def get_repository(repository, user_name):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'SELECT * from complexity_repository where name = %s and user_name = %s'
        cursor.execute(sql, (repository, user_name,))
        return cursor.fetchone()


def create_file(repository_name, repository_file, repository_id):
    connection = get_connection()
    file_with_path = repository_file.filename
    file_name = file_with_path[file_with_path.rfind('/') + 1:]
    file_path = file_with_path[:file_with_path.rfind('/') * 1].replace(base_dir, '', 1).replace(repository_name, '', 1)
    with connection.cursor() as cursor:
        sql = 'INSERT INTO files (file_path, file_name, nloc, \
        repository_id) values (%s,%s,%s,%s)'
        cursor.execute(sql, (file_path, file_name, repository_file.nloc, repository_id,))
    return get_file(file_name, file_path)


def get_file(file_name, file_path):
    connection = get_connection()
    with connection.cursor() as cursor:
        sql = 'SELECT id from files where file_name = %s AND file_path = %s'
        cursor.execute(sql, (file_name, file_path,))
        id = cursor.fetchone()[0]
        return id


def create_functions(repository_file, file_id):
    if len(repository_file.function_list) > 0:
        connection = get_connection()
        with connection.cursor() as cursor:
            sql = 'INSERT INTO function_details (name, nloc, complexity,\
            file_id) values (%s,%s,%s,%s)'

            functions = [(f.name, f.nloc, f.cyclomatic_complexity, file_id,) for f in
                         repository_file.function_list]
            cursor.executemany(sql, functions)
        print('Functions created')
        return connection.insert_id()


if __name__ == '__main__':
    socketio.run(app)
