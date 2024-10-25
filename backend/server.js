const express = require('express') ;
const http = require('http') ;
const {Server} = require('socket.io') ;
const cors = require('cors');
const { exec } = require('child_process');

const app = express() ;
const server = http.createServer(app) ;
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(cors()) ;

let rooms = {}

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


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});