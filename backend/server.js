// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

let rooms = {};

const runCode = (language, code) => {
  return new Promise((resolve, reject) => {
    let command;
    switch(language) {
      case 'javascript':
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'python':
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
        break;
      case 'java':
        // For Java, we need to write to a file, compile, and run
        // This is a simplified version and might not work for all Java code
        const fs = require('fs');
        fs.writeFileSync('TempJava.java', code);
        command = 'javac TempJava.java && java TempJava';
        break;
      case 'cpp': 
        const cppFile = path.join(__dirname, 'TempCpp.cpp');
        fs.writeFileSync(cppFile, code);
        command = `g++ ${cppFile} -o TempCpp && ./TempCpp`;
        break;
      default:
        reject('Unsupported language');
        return;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(`Error: ${error.message}`);
      } else if (stderr) {
        resolve(`Error: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { users: new Set(), language: 'javascript' };
    }
    rooms[roomId].users.add(socket.id);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, user, message }) => {
    io.to(roomId).emit('receiveMessage', { user, message });
  });

  socket.on('codeUpdate', ({ roomId, user, code }) => {
    socket.to(roomId).emit('codeUpdate', { user, code });
  });

  socket.on('languageUpdate', ({ roomId, user, language }) => {
    rooms[roomId].language = language;
    socket.to(roomId).emit('languageUpdate', { user, language });
  });

  socket.on('runCode', async ({ roomId, language, code }) => {
    try {
      const output = await runCode(language, code);
      io.to(roomId).emit('codeOutput', { output });
    } catch (error) {
      io.to(roomId).emit('codeOutput', { output: `Error: ${error}` });
    }
  });

  socket.on('disconnect', () => {
    Object.keys(rooms).forEach(roomId => {
      if (rooms[roomId].users.has(socket.id)) {
        rooms[roomId].users.delete(socket.id);
        if (rooms[roomId].users.size === 0) {
          delete rooms[roomId];
        }
      }
    });
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});