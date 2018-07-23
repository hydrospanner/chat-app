// console.log('i ran');

$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function () {
        socket.send('user connected');
        console.log('user connected');
    });

    socket.on('message', function (msg) {
        $("#messages").append('<li class="list-group-item">' + msg + '<br><small>[time hey]</small></li>');
    });

    socket.on('receive message', function (data) {
        console.log('got recd msg handler');
        $("#messages").append('<li class="list-group-item">' + data['msg'] + '<br><small> by ' + data['user'] + ' at [time]</small></li>');
    });

    /*
    $('#sendbutton').on('click', function () {
        socket.send($('#mymessage').val());
        $('#mymessage').val('');
    });
    */

    $('#sendbutton').on('click', function () {
        console.log("ahhh");
        socket.emit('send msg', { 'msg': $('#mymessage').val(), 'user': 'john' });
        $('#mymessage').val('');
    });
});
