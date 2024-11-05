const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");


const userRoutes = require("./routes/userRoutes");
const workRoutes = require("./routes/workRoutes")
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//adding db
connectDB() ;
app.use(cors());

const runCode = (language, code) => {
  return new Promise((resolve, reject) => {
    let command;

    switch (language) {
      case "javascript":
        command = `node -e "${code.replace(/"/g, '\\"')}"`;
        break;

      case "python":
        command = `python -c "${code.replace(/"/g, '\\"')}"`;
        break;

      case "java":
        const javaFile = path.join(__dirname, "TempJava.java");
        fs.writeFileSync(javaFile, code);
        command = `javac ${javaFile} && java -cp ${__dirname} TempJava`;
        break;

      case "cpp":
        const cppFile = path.join(__dirname, "TempCpp.cpp");
        const exeFile = path.join(__dirname, "TempCpp");
        fs.writeFileSync(cppFile, code);
        command = `g++ ${cppFile} -o ${exeFile} && ${exeFile}`;
        break;

      default:
        reject("Unsupported language");
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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, user, message }) => {
    io.to(roomId).emit("receiveMessage", { user, message });
  });

  socket.on("codeUpdate", ({ roomId, user, code }) => {
    socket.to(roomId).emit("codeUpdate", { user, code });
  });

  socket.on("languageUpdate", ({ roomId, user, language }) => {
    socket.to(roomId).emit("languageUpdate", { user, language });
  });

  socket.on("runCode", async ({ roomId, language, code }) => {
    try {
      const output = await runCode(language, code);
      io.to(roomId).emit("codeOutput", { output });
    } catch (error) {
      io.to(roomId).emit("codeOutput", { output: `Error: ${error}` });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


//going to add save workspace functionality
app.use(express.json());
app.use(cookieParser()) ;

app.use("/api/user", userRoutes)
app.use("/api/workspace",workRoutes)



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
