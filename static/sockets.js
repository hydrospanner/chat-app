var user_name = get_user_name();


function get_user_name() {
    const stored_user = localStorage.getItem('user_name');
    if (stored_user) {
        $('#new_user_name').val(stored_user);
        return stored_user;
    } else {
        let rand = Math.floor((Math.random() * 1000000) + 1);
        let rand_name = 'user ' + rand.toString();
        localStorage.setItem('user_name', rand_name);
        $('#new_user_name').val(rand_name);
        return rand_name;
    }
};


$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var open_rooms;
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
        current_room = get_current_room();
        join_room(current_room);
        const msg = user_name + ' has connected';
        console.log(msg);
    });

    function append_message(data) {
        const li = document.createElement('li');
        li.className = "list-group-item";
        let time = new Date(data['time']).toLocaleTimeString();
        li.innerHTML = data['msg'] + '<br><small> by ' + data['user'] + ' at ' + time + '</small>';
        $("#messages").append(li);
    }

    socket.on('receive message', function (data) {
        append_message(data);
    });

    socket.on('message history', function (messages) {
        for (var i = 0; i < messages.length; i++) {
            append_message(messages[i]);
        }
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
        const msg = document.querySelector('#mymessage').value;
        const time = (new Date()).getTime();
        socket.emit('send msg', { 'msg': msg, 'user': user_name, 'time': time, 'room': current_room });
        $('#mymessage').val('');
        document.querySelector('#mymessage').focus();
    });

    $('form#rename-user').submit(function (event) {
        const msg = user_name + ' is now ' + $('#new_user_name').val();
        socket.emit('announce', { 'msg': msg });
        user_name = $('#new_user_name').val();
        localStorage.setItem('user_name', user_name);
    });

    $('form#new-room').submit(function (event) {
        // server will validate if room exists
        const new_room = $('#new-chat-room').val();
        $('#new-chat-room').val('');
        if (new_room.length > 0) {
            socket.emit('new room', { 'room': new_room });
        }
    });

    socket.on('room list', function (data) {
        // set global chat_rooms variable with rooms
        open_rooms = data['rooms'];
        // delete current room list
        $('#chat-rooms').empty();
        // add rooms to room list
        for (var i = 0; i < data['rooms'].length; i++) {
            let button = document.createElement('input');
            button.type = "button";
            button.className = "btn btn-primary btn-lg room-button";
            const room = data['rooms'][i];
            button.value = room;
            button.onclick = function () {
                change_room(room);
            };
            // button.onclick = change_room(room);
            $('#chat-rooms').append(button);
        } 
    });

    function change_room(room) {
        const old_room = current_room;
        socket.emit('leave', { 'room': old_room });
        $('#messages').empty();
        join_room(room);
    };

    function join_room(room) {
        socket.emit('join', { 'room': room });
        current_room = room;
        $('#chat-room-name').text(room);
        const msg = user_name + ' has joined the room';
        socket.emit('announce', { 'msg': msg, 'room': current_room });
    }
});

document.querySelector('#mymessage').onkeyup = () => {
    let no_text = (document.querySelector('#mymessage').value.length == 0);
    // console.log(no_text);
    document.querySelector('#sendbutton').disabled = no_text;
};
