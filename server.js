const express = require('express');
const app = express(); 
const ejs = require('ejs');
const port = 5500 
// const mysql = require('mysql');

const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "mN2bFn@1",
    datasbase:'adobe'
  });




app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

app.post('/', (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    if(username=='ketanchawla2000@gmail.com' && password=='mN2bFn@1'){
      // res.send(`Username: ${username} Password: ${password}`);
      res.sendFile(__dirname + '/static/user.html');
    }
    // res.send(`Username: ${username} Password: ${password}`);
    else{
      // res.send(`Username: ${username} Password: ${password}`);
      res.sendFile(__dirname + '/static/invalidlogin.html');
      // res.send('Invalid username or password');
    }
    
  });
  app.get('/profile',(req,res) => {
    // res.sendFile(__dirname + '/static/user.html');
    con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => 
    {
    if(err) throw err;
  
    console.log('Data received from Db:');
    // console.log(result[1].emp_name);
    // console.log(result[1].rm);
    // res.send('my name is ketan');
    // res.render('user.pug', { name: result[1].emp_name, rm:result[1].rm });
    result.forEach(item => {
      console.log('name:',item.emp_name, 'RM:', item.rm);
      console.log(item.rm);
      console.log()
    });
    });
  });


  app.set('view engine', 'ejs');

  app.get('/excel', function (req, res) {
   
    // Render page using renderFile method
    con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => 
    {
    if(err) throw err;
  
    console.log('Data received from Db:');
    // console.log(result[1].emp_name);
    // console.log(result[1].rm);
    // res.send('my name is ketan');
    // res.render('user.pug', { name: result[1].emp_name, rm:result[1].rm });
    result.forEach(item => {
      console.log('name:',item.emp_name, 'RM:', item.rm);
      console.log(item.rm);
      console.log()
    });

    res.render('excel.ejs', {details:result});
  });
});

  app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));