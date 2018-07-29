from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO, emit, send, join_room, leave_room, rooms

from secrets import SECRET_KEY


app = Flask(__name__)
Bootstrap(app)
app.config["SECRET_KEY"] = SECRET_KEY
socketio = SocketIO(app)

# sever memory stored rooms and message history
chat_rooms = ['General']
room_messages = {'General': []}


@app.route("/")
def index():
    return render_template('home.html')

@socketio.on('message')
def handle_unnamed_event(msg):
    print('received message: ' + msg)
    send(msg, broadcast=True)

@socketio.on('send msg')
def handle_message(data):
    room_messages[data['room']].append(data)
    room_messages[data['room']][-100:]
    emit('receive message', data, room=data['room'])

@socketio.on('announce')
def handle_announcement(data):
    emit('announcement', data, room=data['room'])

@socketio.on('new room')
def handle_new_room(data):
    if len(chat_rooms) <= 20:
        chat_rooms.append(data['room'])
        room_messages[data['room']] = []
        data['rooms'] = chat_rooms
        emit('room list', data, broadcast=True)

@socketio.on('request rooms')
def handle_rooms_request(data):
    data['rooms'] = chat_rooms
    emit('room list', data)

@socketio.on('join')
def join(message):
    join_room(message['room'])
    emit('message history', room_messages[message['room']])

@socketio.on('leave')
def leave(message):
    leave_room(message['room'])

if __name__ == '__main__':
    socketio.run(debug=True)
