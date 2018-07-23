from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO, emit, send
import datetime

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
    print('triggered!')
    print('received message: ' + data['msg'])
    print('user: ' + data['user'])
    data['time'] = datetime.datetime.now()
    emit('receive message', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(debug=True)
