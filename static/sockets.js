function get_user_name() {
    if (localStorage.getItem('user_name')) {
        return localStorage.getItem('user_name');
    } else {
        let rand = Math.floor((Math.random() * 1000000) + 1);
        let user_name = 'user ' + rand.toString();
        localStorage.setItem('user_name', user_name);
        return user_name;
    }
    };

$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    

    // var user_name = // add func here

    socket.on('connect', function () {
        msg = get_user_name() + ' has connected';
        socket.emit('send msg', { 'msg': msg, 'user': localStorage.getItem('user_name')});
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

    $('#sendbutton').on('click', function () {
        console.log('txt: ');
        const msg = document.querySelector('#mymessage').value;
        console.log(msg);
        socket.emit('send msg', { 'msg': $('#mymessage').val(), 'user': localStorage.getItem('user_name') });
        $('#mymessage').val('');
        document.querySelector('#mymessage').focus();
    });

    

});

document.querySelector('#mymessage').onkeyup = () => {
    let no_text = (document.querySelector('#mymessage').value.length == 0);
    // console.log(no_text);
    document.querySelector('#sendbutton').disabled = no_text;
};
