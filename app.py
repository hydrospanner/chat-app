from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO, emit, send

from secrets import SECRET_KEY


app = Flask(__name__)
Bootstrap(app)
app.config["SECRET_KEY"] = SECRET_KEY
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('home.html')

@socketio.on('message')
def handle_unnamed_event(msg):
    print('received message: ' + msg)
    send(msg, broadcast=True)

@socketio.on('send msg')
def handle_message(data):
    emit('receive message', data, broadcast=True)

@socketio.on('announce')
def handle_announcement(data):
    emit('announcement', data, broadcast=True)

chat_rooms = ['General']
@socketio.on('new room')
def handle_new_room(data):
    print('new room')
    if len(chat_rooms) <= 20:
        chat_rooms.append(data['room'])
        data['rooms'] = chat_rooms
        emit('room list', data, broadcast=True)

@socketio.on('request rooms')
def handle_rooms_request(data):
    print('request rooms')
    data['rooms'] = chat_rooms
    emit('room list', data, broadcast=True)


if __name__ == '__main__':
    socketio.run(debug=True)
