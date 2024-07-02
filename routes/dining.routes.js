
const express = require("express");
const router = express.Router();
const {addPlaceHandler}=require('../config/database')

router.post('/dining-place/create',addPlaceHandler);


module.exports=router