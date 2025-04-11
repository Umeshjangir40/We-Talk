const socket = io();
let partnerId = null;

function startChat() {
  const gender = document.getElementById('gender').value;
  socket.emit('findPartner', { gender });
  document.getElementById('gender-select').classList.add('hidden');
  document.getElementById('chat-container').classList.remove('hidden');
}

function sendMessage() {
  const msg = document.getElementById('message').value;
  socket.emit('message', msg);
  appendMessage(`You: ${msg}`);
  document.getElementById('message').value = '';
}

function appendMessage(msg) {
  const chatBox = document.getElementById('chat-box');
  const p = document.createElement('p');
  p.innerText = msg;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function disconnect() {
  socket.emit('disconnectPartner');
  appendMessage("You disconnected.");
}

socket.on('message', (msg) => {
  appendMessage(`Stranger: ${msg}`);
});

socket.on('partnerDisconnected', () => {
  appendMessage("Stranger disconnected.");
});
