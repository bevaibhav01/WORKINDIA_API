const mysql=require('mysql2');
require('dotenv').config();
//const {promiseConnection}=require('../index')
const jwt=require('jsonwebtoken');


const db = mysql.createConnection({
    host: process.env.HOST,
    port:process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
const promiseConnection = db.promise();


const signUpHandler=async (req,res)=>{   
  try {
    
  const {name,password,email}=req.body;
     //doing validation of data here
     console.log("entered");
  if(!name||!password||!email){
    res.status(404).json({
      success:false,
      message:"All fields are required"
    })
  }
  console.log("entered");
  //check if user already exists
  const isThere=await promiseConnection.query(
    "SELECT * FROM user WHERE email=?",
    [email]
  );



  if(isThere[0].length>0){
    return res.status(400).json({
      success:false,
      message:"User Already Exist"
  })
  }
  console.log("entered");

   //else sign up the user
    const user = await promiseConnection.query(
      "INSERT INTO user(name, password, email) VALUES (?, ?, ?)",
      [name, password, email]
    );
    const getUser = await promiseConnection.query("SELECT * FROM user where id = ?", [
      user[0].insertId,
    ]);
   // return getUser[0][0];
   res.status(200).json({
    success:true,
    user_id:getUser[0].insertId,
    user:getUser[0][0],
    message:"Accound created Successfully"

   })
  } catch (err) {
    console.log(err);
    return null;
  }

  //will check if user already exits



}

const loginHandler=async (req,res)=>{
  try{
    console.log("iam there")
  const {email,password}=req.body;
 
  console.log("iam there")
  if(!email||!password){
    res.status(404).json({
      success:false,
      message:"All fields are required"
    })
  }

  const isThere=await promiseConnection.query(
    "SELECT * FROM user WHERE email=?",
    [email]
  );
  
  console.log(isThere);
  if(!isThere){
    return res.status(400).json({
      success:false,
      message:"User Not Exist"
  })
  }

  console.log("iam there")

  if(password==isThere[0][0].password){
    console.log("iam there")
    const payload={
      email:isThere[0][0].email,
      id:isThere[0][0].id,
      
     }

     const token=jwt.sign(payload,process.env.JWT_SECRET,{
      expiresIn:"2h",
  })

  const userToken = await promiseConnection.query(
    "INSERT INTO user(token) VALUES (?)",
    [token]
  );



  const options={
    expires:new Date(Date.now()+3*24*60*100),
    httpOnly:true,
}
res.cookie("token",token,options).status(200).json({
  success:true,
  token,
  userToken,
  message:'Logged in successfully'
})

  }
}catch(err){
   console.log(err)
}


}



const addPlaceHandler=async (req,res)=>{
  try{
    console.log("im here")
  const {name,address,phone_no,website,open_time,close_time}=req.body;

  if(!name||!phone_no||!website||!open_time||!close_time){
    res.status(404).json({
      success:false,
      message:"All fields are required"
    })
  }
  

  console.log("im here")
  const place = await promiseConnection.query(
    "INSERT INTO dining(name,address,phone_no,website,open_time,close_time) VALUES (?, ?, ?,?,?,?)",
    [name, address, phone_no,website,open_time,close_time]
  );
  console.log(place)
  const slots=await promiseConnection.query(
    "INSERT INTO booked_slots(dine_id) VALUES (?)",
    [place[0].insertId]
  );

  res.status(200).json({
    success:true,
    message:"Place Added",
    place_id:place[0].insertId
  })
}catch(error){

}

  





}
module.exports=db;
module.exports.signUpHandler=signUpHandler
module.exports.loginHandler=loginHandler
module.exports.addPlaceHandler=addPlaceHandler