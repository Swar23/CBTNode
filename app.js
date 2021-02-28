const express = require('express');
const mongoose = require('mongoose');
var bodyParser= require("body-parser");
const jwt = require('jsonwebtoken');
const port = 3000;
const app = express();
let User;
let Student;
//setting up bodyParser middleWare
app.use(bodyParser.urlencoded({"extended":true}))
app.use(bodyParser.json());

run().catch(error => console.log(error.stack));
//Creating Database so Can shift with example
async function run() {
  await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true,useUnifiedTopology:true });

  await mongoose.connection.dropDatabase();

  const userSchema = new mongoose.Schema({ email: String, userId: Number, password: String });
  User = mongoose.model('UserDetail', userSchema);

  await User.create({ email: 'swarup@gmail.com', userId: 1, password: '123456' });

  const studentSchema = new mongoose.Schema({ id: Number, Name: String, Subject: String , Marks:Number });
  Student = mongoose.model('StudentDetail', studentSchema);

  await Student.create({ id: 1, Name: 'Swapnil', Subject: 'English', Marks: 90 },
    { id: 2, Name: 'Sameer', Subject: 'Marathi', Marks: 100 },
    { id: 3, Name: 'Tina', Subject: 'Maths', Marks: 20 },
    { id: 4, Name: 'Rekha', Subject: 'Sanskrit' , Marks:89 });
}
//error handler middleWare
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.post("/login", (req, res, next) => {
  User.find({ email: req.body.email ,password: req.body.pwd })
    .then(docs => {
      console.log(docs[0].userId)
            var token = jwt.sign({userID: docs[0].userId}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
            res.send({token});
        })
        .catch(e => {
            console.log(e);
            next(e);
        })
})


app.get("/student", (req, res, next) => {
  console.log('called');
  Student.find({ })
    .then(docs => {
      res.send(docs);
        })
        .catch(e => {
            console.log(e);
            next(e);
        })
})

app.listen(port,()=>{console.log("server started")});