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
def handle_message(msg):
    print('received message: ' + msg)
    send(msg, broadcast=True)


if __name__ == '__main__':
    socketio.run(debug=True)
