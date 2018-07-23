$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function () {
        //socket.send('user connected');
        msg = 'john' + 'has connected';
        socket.emit('send msg', {'msg': msg, 'user': 'john'});
    });

    socket.on('message', function (msg) {
        const li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = msg;
        $("#messages").append(li);
    });

    socket.on('receive message', function (data) {
        const li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = data['msg'] + '<br><small> by ' + data['user'] + ' at [time]</small>';
        $("#messages").append(li);
    });

    /*
    $('#sendbutton').on('click', function () {
        socket.send($('#mymessage').val());
        $('#mymessage').val('');
    });
    */

    $('#sendbutton').on('click', function () {
        socket.emit('send msg', { 'msg': $('#mymessage').val(), 'user': 'john' });
        $('#mymessage').val('');
    });
});
