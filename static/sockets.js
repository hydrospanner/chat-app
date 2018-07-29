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

// add function to change rooms. set local storage. change title. change global room variable. 

$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var open_rooms;
    // var current_room = get_current_room();
    var current_room;

    function get_current_room() {
        socket.emit('request rooms', {});
        const previous_session_room = localStorage.getItem('chat_room')
        if (previous_session_room && open_rooms.indexOf(previous_session_room) >= 0) {
            return previous_session_room
        } else {
            return 'General'
        }

    }

    socket.on('connect', function () {
        const msg = user_name + ' has connected';
        socket.emit('announce', { 'msg': msg });
        current_room = get_current_room();
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
        socket.emit('send msg', { 'msg': $('#mymessage').val(), 'user': localStorage.getItem('user_name') });
        $('#mymessage').val('');
        document.querySelector('#mymessage').focus();
    });

    $('form#rename-user').submit(function (event) {
        const msg = user_name + ' is now ' + $('#new_user_name').val();
        socket.emit('announce', { 'msg': msg });
        user_name = $('#new_user_name').val()
        localStorage.setItem('user_name', user_name);
    });

    $('form#new-room').submit(function (event) {
        // server will validate if room exists
        const new_room = $('#new-chat-room').val();
        if (new_room.length > 0) {
            socket.emit('new room', { 'room': new_room });

        }
    });

    socket.on('room list', function (data) {
        console.log('room list');
        // set global chat_rooms variable with rooms
        open_rooms = data['rooms'];
        // delete current room list
        $('#chat-rooms').empty();
        // add rooms to room list
        for (var i = 0; i < data['rooms'].length; i++) {
            let li = document.createElement('li');
            // li.className = "list-group-item";
            li.innerHTML = data['rooms'][i];
            $('#chat-rooms').append(li);
        }
        
    });
});

document.querySelector('#mymessage').onkeyup = () => {
    let no_text = (document.querySelector('#mymessage').value.length == 0);
    // console.log(no_text);
    document.querySelector('#sendbutton').disabled = no_text;
};
