const express = require('express')
const Workspace = require('../models/workspace')

const newWorkSpace = async(req,res) =>{
  const {roomId,code,language} = req.body ;
  const author = req.user_ ;
  try {
    let workspace = await Workspace.findOne({ author, roomId });
    if (workspace) {
      workspace.code = code;
      workspace.language = language;
    } else {
      workspace = new Workspace({ author, roomId, code, language });
    }
    await workspace.save();
    res.json({ message: "Workspace saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving workspace" });
  }
}

const getWorkSpace= async(req,res) =>{
  const {roomId} = req.params ; 
  try {
    const workspace = await Workspace.findOne({ userId: req.userId, roomId });
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    res.json({ code: workspace.code, language: workspace.language });
  } catch (error) {
    res.status(500).json({ message: "Error loading workspace" });
  }
}

module.exports = {newWorkSpace,getWorkSpace}