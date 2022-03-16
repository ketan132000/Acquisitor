const express = require('express');
const app = express(); 
const ejs = require('ejs');
const port = 5500 


var mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "mN2bFn@1",
    datasbase:'adobe'
  });


app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

app.post('/', (req, res) => {
  
    let username = req.body.username;
    let password = req.body.password;
    if(username=='ketanchawla2000@gmail.com' && password=='mN2bFn@1'){
      res.redirect('/excel');
    }
    else{
      res.sendFile(__dirname + '/static/invalidlogin.html');
    }
  });

  app.get('/excel', function (req, res) {
   
    con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => 
    {
    if(err) throw err;

    res.render('excel.ejs', {details:result});
  });
});


app.get('/edit',(req,res)=>{
  let empid=req.query.emp_id;

  con.query(`SELECT * FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => 
    {
    if(err) throw err;
  
    res.render('edit.ejs', {details:result[0]});
    });


 

});


app.post('/edit',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;

  con.query(`UPDATE adobe.panel_members SET emp_name="${empname}", job_code="${jobcode}", rm="${rm}", ready="${ready}", java="${java}", cpp="${cpp}" WHERE emp_id=${empid};`, (err,result,field) => 
    {
    if(err) throw err;

    res.redirect('/excel')
    });

});




app.get('/delete',(req,res)=>{
  let empid=req.query.emp_id;
  con.query(`Delete FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => 
    {
    if(err) throw err;

    res.redirect('/excel')
    });

});

app.get('/add',(req,res)=>{
  res.sendFile(__dirname + '/static/add.html');
});


app.post('/add',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;

  console.log(empid);

  con.query(`INSERT INTO adobe.panel_members(emp_id,emp_name,job_code,rm,ready,java,cpp) VALUES (${empid},'${empname}','${jobcode}','${rm}','${ready}','${java}','${cpp}');`, (err,result,field) => 

    {
    if(err) throw err;  
    res.redirect('/excel')
    });

});

  app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));