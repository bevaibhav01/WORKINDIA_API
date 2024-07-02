const express = require("express");
const router = express.Router();

const {signUpHandler,loginHandler}=require('../config/database')

router.post('/signup',signUpHandler);
router.post('/login',loginHandler);

module.exports=router