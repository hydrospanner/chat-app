var user_name = get_user_name();

function get_user_name() {
    if (localStorage.getItem('user_name')) {
        return localStorage.getItem('user_name');
    } else {
        let rand = Math.floor((Math.random() * 1000000) + 1);
        let rand_name = 'user ' + rand.toString();
        localStorage.setItem('user_name', rand_name);
        return rand_name;
    }
    };

$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function () {
        const msg = user_name + ' has connected';
        socket.emit('announce', { 'msg': msg });
    });

    socket.on('receive message', function (data) {
        const li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = data['msg'] + '<br><small> by ' + data['user'] + ' at [time]</small>';
        $("#messages").append(li);
    });

    socket.on('announcement', function (data) {
        const li = document.createElement('li');
        li.className = "list-group-item";
        const h = document.createElement('h4');
        h.textContent = data['msg'];
        li.appendChild(h);
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

    $('form#rename-user').submit(function (event) {
        const msg = user_name + ' is now ' + $('#new_user_name').val();
        socket.emit('announce', { 'msg': msg });
    });
});

document.querySelector('#mymessage').onkeyup = () => {
    let no_text = (document.querySelector('#mymessage').value.length == 0);
    // console.log(no_text);
    document.querySelector('#sendbutton').disabled = no_text;
};
