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

//LOGIN PAGE
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
  });

//LOGIN FORM
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


//EDIT PAGE
app.get('/edit',(req,res)=>{
  let empid=req.query.emp_id;

  con.query(`SELECT * FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => 
    {
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

  con.query(`UPDATE adobe.panel_members SET emp_name="${empname}", job_code="${jobcode}", rm="${rm}", ready="${ready}", java="${java}", cpp="${cpp}" WHERE emp_id=${empid};`, (err,result,field) => 
  {
    if(err) throw err;

    res.redirect('/excel')
  });

});



//DELETE 
app.get('/delete',(req,res)=>{
  let empid=req.query.emp_id;
  con.query(`Delete FROM adobe.panel_members WHERE emp_id=${empid};`, (err,result,field) => 
    {
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

  con.query(`INSERT INTO adobe.panel_members(emp_id,emp_name,job_code,rm,ready,java,cpp) VALUES (${empid},'${empname}','${jobcode}','${rm}','${ready}','${java}','${cpp}');`, (err,result,field) => 
  {
    if(err) throw err;  
    res.redirect('/excel')
  });

});



app.post('/add_interview',(req,res)=>{
  let date=req.body.date;
  date=date.substring(0,4)+'_'+date.substring(5,7)+'_'+date.substring(8,10);
  console.log(date);
  let dates=[]

  con.query(`DESCRIBE adobe.panel_members;`, (err,result,field) => 
    {
    if(err) throw err; 
    result.forEach(i => {
      dates.push(i.Field);
    });
    if(dates.includes('d_'+date))
    console.log('Hello');
    else{
      console.log('bye');
      con.query(`ALTER TABLE adobe.panel_members ADD d_${date} int DEFAULT 0;`, (err,result,field) => 
    {
    if(err) throw err;  
    });
    }

    if(req.body.hasOwnProperty("add")){
      con.query(`UPDATE adobe.panel_members SET d_2022_04_18=d_2022_04_18 + 1 where emp_id=11112;`, (err,result,field) => 
      {
      if(err) throw err;  
      });
    }
    else{
      con.query(`UPDATE adobe.panel_members SET d_2022_04_18=d_2022_04_18 - 1 where emp_id=11112;`, (err,result,field) => 
      {
      if(err) throw err;  
      });
    }
    });

  if(dates=='')
  console.log("Invalid Date");
  else
  console.log(date.charAt(5)+date.charAt(6));
  res.redirect('/excel');
});

app.listen(port, () => console.log(`This app is listening on http://localhost:${port}`));