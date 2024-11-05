const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/user') ;

const register = async(req,res) =>{
  const { username , password }  = req.body ;
  try{
    if(!username || !password){
      return res.status(401).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({username}) ;
    if(user){
      return res.status(401).json({
        message: "User already exists",
        success: false,
      })
    }

    const hashedPassword = await bcrypt.hash(password,10) ;
    await User.create({
      username,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });

  }catch(error){
    return res.status(400).json({message:"error creating user"}) ;
  }
}



const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "No user found",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

    user = {
      _id: user._id,
      username: user.username,
    };

    return res.cookie('token', token, { secure: true,sameSite: 'none', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


const logout = async (_, res) => {
  try {
    return res.cookie('token', "", { maxAge: 0 }).json({
      message: 'Logged out successfully.',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};



module.exports = {register,login,logout} ;