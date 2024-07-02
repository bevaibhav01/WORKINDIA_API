const express=require('express');
const db=require('./config/database');
const dotenv=require('dotenv')
//const cookieparser=require('cookie-parser');
dotenv.config();

const userRoutes=require('./routes/user.routes')
const dineRoutes=require('./routes/dining.routes')




db.connect((err)=>{
    //console.log(err);
    if(err){
        console.log(err);
        return;
    }

    console.log("DB CONNECTED SUCCESFULLY")

})

//exports.promiseConnection = db.promise();



const app = express();
//app.use(cors());
app.use(express.json());
//app.use(cookieparser);
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/dine',dineRoutes);

// app.get('/users', (req, res) => {
//     db.query('SELECT * FROM user', (err, results) => {
//       if (err) {
//         res.status(500).send('Database query failed');
//       } else {
//         res.json(results);
//       }
//     });
//   });
  
  app.listen(process.env.PORT, () => {
    console.log('Server running on port 3000');
  });
