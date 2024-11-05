const Workspace = require('../models/workspace')

const newWorkSpace = async (req, res) => {
  const { roomId, code, language } = req.body;
  const userId = req.userId; 

  try {
    let workspace = await Workspace.findOne({ userId, roomId });
    if (workspace) {
      workspace.code = code;
      workspace.language = language;
    } else {
      workspace = new Workspace({ userId, roomId, code, language });
    }
    await workspace.save();

    res.json({ message: "Workspace saved successfully" });
  } catch (error) {
    console.error("Error saving workspace:", error); 
    res.status(500).json({ message: "Error saving workspace" });
  }
};


const getWorkSpace = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId; 

  try {
    const workspace = await Workspace.findOne({ userId, roomId });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.json({ code: workspace.code, language: workspace.language });
  } catch (error) {
    console.error("Error loading workspace:", error); 
    res.status(500).json({ message: "Error loading workspace" });
  }
};


module.exports = {newWorkSpace,getWorkSpace}