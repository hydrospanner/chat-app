from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask_socketio import SocketIO, emit

from secrets import SECRET_KEY


app = Flask(__name__)
Bootstrap(app)
app.config["SECRET_KEY"] = SECRET_KEY
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
