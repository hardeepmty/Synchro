const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true },
  code: { type: String, default: "" },
  language: { type: String, default: "javascript" },
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
