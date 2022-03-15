var mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "mN2bFn@1",
    datasbase:'adobe'
  });


  con.query('SELECT * FROM adobe.panel_members;', (err,result,field) => 
  {
  if(err) throw err;

  console.log('Data received from Db:');
  // console.log(result[1].emp_name);
  result.forEach(item => {
    console.log('name:',item.emp_name, 'RM:', item.rm);
    // console.log(item.rm);
    console.log() // Logs each 'Item #'
  });
  });
