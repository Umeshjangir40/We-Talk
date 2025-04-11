const socket = io();

function startChat() {
  const gender = document.getElementById('gender').value;
  socket.emit('findPartner', { gender });

  document.getElementById('gender-select').classList.add('hidden');
  document.getElementById('chat-container').classList.remove('hidden');
}

socket.on('message', (data) => {
  const chatBox = document.getElementById('chat-box');
  const message = document.createElement('div');
  message.textContent = 'Stranger: ' + data;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
  const input = document.getElementById('messageInput');
  const msg = input.value;
  if (msg.trim() === '') return;

  socket.emit('message', msg);
  const chatBox = document.getElementById('chat-box');
  const message = document.createElement('div');
  message.textContent = 'You: ' + msg;
  message.style.fontWeight = 'bold';
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = '';
}
