let socket_admin_id = null;
let emailUser = null;
let socket = null;

document.querySelector('#start_chat').addEventListener('click', (event) => {
  socket = io();

  const chatHelp = document.getElementById('chat_help');
  chatHelp.style.display = 'none';

  const chatInSupport = document.getElementById('chat_in_support');
  chatInSupport.style.display = 'block';

  const email = document.getElementById('email').value;
  emailUser = email;

  const text = document.getElementById('txt_help').value;

  socket.on('connect', () => {
    const params = {
      email,
      text,
    };

    socket.emit('client_first_acess', params, (call, err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(call);
      }
    });
  });

  socket.on('client_list_all_messages', (messages) => {
    const templateClient = document.getElementById('message-user-template')
      .innerHTML;
    const templateAdmin = document.getElementById('admin-template').innerHTML;

    messages.forEach((message) => {
      if (message.admin_id === null) {
        const rendered = Mustache.render(templateClient, {
          message: message.text,
          email,
        });

        document.getElementById('messages').innerHTML += rendered;
      } else {
        const rendered = Mustache.render(templateAdmin, {
          message_admin: message.text,
        });

        document.getElementById('messages').innerHTML += rendered;
      }
    });
  });

  socket.on('admin_send_to_client', (message) => {
    socket_admin_id = message.socket_id;

    const template_admin = document.getElementById('admin-template').innerHTML;

    const rendered = Mustache.render(template_admin, {
      message_admin: message.text,
    });

    document.getElementById('messages').innerHTML += rendered;
  });
});

document
  .querySelector('#send_message_button')
  .addEventListener('click', (event) => {
    const text = document.getElementById('message_user');

    const params = {
      text: text.value,
      socket_admin_id,
    };

    socket.emit('client_send_to_admin', params);

    const template_client = document.getElementById('message-user-template')
      .innerHTML;

    const rendered = Mustache.render(template_client, {
      message: text.value,
      email: emailUser,
    });

    document.getElementById('messages').innerHTML += rendered;
  });
