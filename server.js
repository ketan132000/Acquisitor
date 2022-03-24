const express = require('express');
const app = express(); 
const ejs = require('ejs');
const port = 5500 

var mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "{password}", // User's password
    datasbase:'adobe'
  });


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));


//LOGIN PAGE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });


//LOGIN FORM
app.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    con.query(`SELECT * FROM adobe.users WHERE email='${username}' AND password='${password}';`, (err,result,field) => {
      if(err) throw err;
      console.log(result);
      if(result.length>0 && username=='ketanchawla2000@gmail.com'){
        res.redirect('/ketan');
      }
      else if(result.length>0 && username=='gaurav.sharma0865@gmail.com'){
        res.redirect('/gaurav');
      }
      else{
        res.sendFile(__dirname + '/static/invalidlogin.html');
      }
  });
});


app.get('/ketan', (req, res) => {
  res.render('dashboard.ejs', {});
});


app.get('/gaurav',(req,res)=>{
  res.render('dashboard1.ejs',{});
});


app.get('/excel', function (req, res) {
  console.log(req.body)
  con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => {
    if(err) throw err;
    res.render('excel.ejs', {details:result});
  });
});


//EDIT PAGE
app.get('/edit',(req,res)=>{
  let empid=req.query.emp_id;

  con.query(`SELECT * FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => {
    if(err) throw err;
    res.render('edit.ejs', {details:result[0]});
    });
});


//EDIT FORM
app.post('/edit',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;

  con.query(`UPDATE adobe.panel_members SET emp_name="${empname}", job_code="${jobcode}", rm="${rm}", ready="${ready}", java="${java}", cpp="${cpp}" WHERE emp_id=${empid};`, (err,result,field) => {
    if(err) throw err;
    res.redirect('/excel')
  });

});


//DELETE 
app.get('/delete',(req,res)=>{
  let empid=req.query.emp_id;
  con.query(`Delete FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => {
    if(err) throw err;
    res.redirect('/excel')
  });
});


//ADD PAGE
app.get('/add',(req,res)=>{
  res.sendFile(__dirname + '/static/add.html');
});


//ADD FORM
app.post('/add',(req,res)=>{
  let empid=req.body.empid
  let empname=req.body.name;
  let jobcode=req.body.job_code;
  let rm=req.body.rm;
  let ready=req.body.ready;
  let java=req.body.java;
  let cpp=req.body.cpp;

  console.log(empid);

  con.query(`INSERT INTO adobe.panel_members(emp_id,emp_name,job_code,rm,ready,java,cpp) VALUES (${empid},'${empname}','${jobcode}','${rm}','${ready}','${java}','${cpp}');`, (err,result,field) => {
    if(err) throw err;  
    res.redirect('/excel')
  });
});


app.get('/add_interview',(req,res)=>{
  con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => {
    if(err) throw err;
    res.render('interview.ejs', {details:result});
  });
});


app.post('/add_interview',(req,res)=>{
  let date=req.body.date;
  let empid=req.body.empid;
  date=date.substring(0,4)+'_'+date.substring(5,7)+'_'+date.substring(8,10);
  console.log(date);
  const tableColumns = []

  const columns = ["day_"+date+"_a", "day_"+date+"_d", "month_"+date.substring(0, 7)+"_a", "month_"+date.substring(0, 7)+"_d"]
  console.log(columns);

  con.query(`DESCRIBE adobe.panel_members;`, (err,result,field) => {
    if(err) throw err; 
    
    result.forEach(i => {
      tableColumns.push(i.Field);
    });

    columns.forEach(col => {
      if(!tableColumns.includes(col)){
        con.query(`ALTER TABLE adobe.panel_members ADD ${col} int DEFAULT 0;`, (err,result,field) => {
          if(err) throw err;  
        });
      }
    });

    if(req.body.hasOwnProperty("add")){
      con.query(`UPDATE adobe.panel_members SET ${columns[0]}=${columns[0]}+1, ${columns[2]}=${columns[2]}+1 where emp_id=${empid};`, (err,result,field) => {
        if(err) throw err; 
        res.redirect('/add_interview');
      });
    }
    else{
      con.query(`UPDATE adobe.panel_members SET ${columns[0]}=${columns[0]}-1, ${columns[2]}=${columns[2]}-1, ${columns[1]}=${columns[1]}+1, ${columns[3]}=${columns[3]}+1 where emp_id=${empid};`, (err,result,field) => {
        if(err) throw err; 
        res.redirect('/add_interview');
      });
    }
  });
});


app.post('/date',(req,res)=>{
  let date=req.body.date;
  console.log(date);
  res.redirect('/excel');
});


app.get('/interview_tracker',(req,res)=>{
  con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => {
    if(err) throw err;
    res.render('interview.ejs', {details:result});
  });
});

app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));
