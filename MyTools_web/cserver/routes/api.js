const mysql = require("mysql");
const config = require("../config");
//导入mysql和配置

//引入express模块
var express = require("express");
const jwt = require("jsonwebtoken");
//制造一个路由组件
var router = express.Router();
router.use(express.json());
// router.use(formidable())

router.use(express.urlencoded({ extended: true }));


router.get("/profile",function(req,res,next){
  const authorization=req.headers.authorization;
  if(authorization===''){
    console.log('该用户不含有请求头，请求无效。')
    res.status(401).send();
  }
  const token=authorization.split(' ')[1];
  console.log(`authorization的信息为${token}`);
  // 合法性验证
  try{
    tokenContent=jwt.verify(token,'iwisscotmail');
    console.log(`解析后的token为:`);
    console.log(tokenContent)
    res.status(200).json(tokenContent);
  }catch(err){
    console.log(err);
    console.log('token解析异常')
    // res.status(400).send();
    // 好像只要出现err就会出现500请求码，不可以再设置status了。
    throw(err);
  }
  console.log("ok!")
  
})


// 登入部分。在这一部分进行登入和token的发放。
router.post("/login", function (req, res, next) {
  var connection = mysql.createConnection(config.options);
  connection.connect(function (err) {
    console.log("数据库连接成功！");
  });
  var id=req.body.username;
  var password=req.body.password;
  console.log(req.body);
  console.log(`用户输入的账户为${req.body.username}，输入的密码为${req.body.password}`)
  connection.query(
    "select * from users U, unit T where uuid=? and U.unitID=T.unitID",
    [id],
    function (error, results) {
      if (error) throw error;
      console.log('数据库读取结果为');
      console.log(results);
      //这里注意，数据库返回的是行数据results是数组形式

      if (results.length == 0) {
        console.log("没有查到该账户！");
        return res.status(402).json({
          errorType: 1,
        });
      }

      console.log(`查到的结果${results[0].password}`);
      console.log(`输入密码为${password}`)
      console.log(`输入密码类型为${typeof password}`)
      console.log(`数据库密码类型为${typeof results[0].password}`)
      if (results[0].password == password) {
        var token = jwt.sign({
          userID: results[0].uuid,
          userName: results[0].username,
          unitID:results[0].unitID,
          authority:results[0].authority,
          unitDescription:results[0].unitDes,
          description:results[0].description,
          unitName:results[0].name,

        },"iwisscotmail",{
          expiresIn:'3000s'
        });
        console.log("身份验证匹配");
        console.log(`送出的token为${token}`);
        var tokenSended={"token":token}
        return res.status(233).json(tokenSended);
      }
      else{
        console.log(`身份验证不匹配`)
        return res.status(402).json({
          errorType:2,
        })
      }
    }
  );
  connection.end();
});


// 无用api
router.post("/insert", function (req, res, next) {
  var connection = mysql.createConnection(config.options);
  connection.connect(function (err) {
    console.log("数据库连接成功！");
  });
  var payload = req.body;
  console.log(payload);
  // var name=payload.name;
  // var roadmap=payload.roadmap;
  var city = payload.city;
  var school = payload.school;
  var name = payload.name;
  var score = payload.score;
  var time = payload.time;
  var amount = payload.amount;
  var contact = payload.contact;
  connection.query(
    "insert into quiz(score,userName,userTime,city,school,amount,contact) values(?,?,?,?,?,?,?)",
    [score, name, time, city, school, amount, contact],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(fields);
      res.json(results);
    }
  );
  //接下来插入到另一个数据库。
  // var roads=roadmap.split('>');
  // console.log(roads);
  // var query2="insert into bus2(Stopp,Route,Position) values(?,?,?)"
  // for(let i=0;i<roads.length;i++){
  //   connection.query(query2,[roads[i],name,i+1],function(error,results,fields){
  //     if (error) throw error;
  //     // res.json(results)
  //   })
  connection.end();
  // res.json(req.body);
  // req.end();
});

// 无用api
router.delete("/delete", function (req, res, next) {
  var id = req.query.id;
  console.log(`删除id为${id}`);
  var sql = "delete from bus where id=?";
  var connection = mysql.createConnection(config.options);
  connection.connect(function (err) {
    console.log("数据库连接成功！");
  });
  connection.query(sql, [id], function (err, result) {
    if (err) throw error;
    res.send("删除成功");
  });
  connection.end();
});


// 获得团体名的api
router.get("/getUnites",function(req,res,next){
  var connection = mysql.createConnection(config.options);
  sql="select distinct name,unitID,unitDes from unit";
  connection.query(sql, [], function (err, results) {
    if (err) throw error;
    console.log('向客户发送了一个团体的列表')
    console.log(results);
    res.json(results);
  });
  connection.end();
})

// 创造新用户的api
router.post("/createNewUser",function(req,res,next){
  var payload = req.body;
  var connection = mysql.createConnection(config.options);
  sql="INSERT INTO users (username,password,unitID,authority,description) VALUES (?,?,?,?,?) ";
  connection.query(sql, [payload.username,payload.password,payload.unitID,payload.authority,payload.description], function (err, results) {
    if (err) throw err;
    console.log('成功执行一条插入新用户操作，信息如下：')
    console.log(results);
    // 之后再写一个返回用户账号名的查询，现在先懒着。
    res.json(results);
  });
  connection.end();
})

router.post("/sendSheet",function(req,res,next){
  var payload = req.body;
  var sheetContent=payload.sheetContent;
  var createrID=payload.createrID;
  var sheetUnit=payload.sheetUnit;
  var tableName=payload.tableName;
  var description=payload.description;
  var time=new Date();
  var createTime=time.toISOString().split('T')[0]+' '+time.toTimeString().split(' ')[0];

  // 表格的uid采用自增，表格的时间戳由后端生成。
  var connection = mysql.createConnection(config.options);
  sql="INSERT INTO datatable (tableName,createrID,createTime,description,sheetContent,sheetUnit) VALUES (?,?,?,?,?,?)";
  connection.query(sql, [tableName,createrID,createTime,description,sheetContent,sheetUnit], function (err, results) {
    if (err) throw err;
    console.log('成功执行一条插入新表格数据的记录，信息如下：')
    console.log(results);
    // 之后再写一个返回用户账号名的查询，现在先懒着。
    res.json(results);
  });
  connection.end();
})

//获取所有的表
router.get("/sheets",function(req,res,next){
  var sql="select tableName,UID as tableID,createrID,createTime,D.description as tableDescription,sheetContent,T.name as unitName,username from datatable D,users U,unit T where D.createrID=U.uuid and T.unitID=D.sheetUnit";
  var connection = mysql.createConnection(config.options);
  connection.query(sql,[],function(err,results){
    if(err)throw err;
    console.log(results);
    res.json(results);
  })
  connection.end();
})

//删除某一个表
router.get("/deleteSheet",function(req,res,next){
  var uuid=req.query.uuid;
  var sql="delete from datatable where id=?";
  var connection=mysql.createConnection(config.options);
  connection.query(sql,[],function(err,results){
    if(err)throw err;
    console.log(results);
    res.json(results);
  })
  connection.end();
})
// 获得指定单位的用户列表
router.get("/getUserOfUnit",function(req,res,next){
  var unitID=req.query.unitID;
  console.log(`检索ID为${unitID}`)
  var sql="select * from users where unitID=?"
  var connection = mysql.createConnection(config.options);
  connection.query(sql, [unitID], function (err, results) {
    if (err) throw error;
    console.log('成功执行一条查询组织用户操作，信息如下：')
    console.log(results);
    res.json(results);
  });
  connection.end();
})

// 无用api
router.get("/how", function (req, res, next) {
  var begin = req.query.begin;
  var end = req.query.end;
  var connection = mysql.createConnection(config.options);
  connection.connect(function (err) {
    console.log("数据库连接成功！");
  });
  let sql = "CALL how(?,?)";
  connection.query(sql, [begin, end], (err, result, fields) => {
    if (err) throw error;
    res.json(result[0]);
    res.end();
  });
  connection.end();
});

// 更新用户记录的api
router.post("/updateUser",function(req,res,next){
  var user=req.body;
  var connection = mysql.createConnection(config.options);
  sql="update users set username= ?,password=?,unitID=?,description=?,authority=? where uuid=?;"
  connection.query(sql, [user.username,user.password,user.unitID,user.description,user.authority,user.uuid], function (err, results) {
    if (err) throw error;
    console.log('执行修改数据查询，修改结果如下:');
    console.log(results);
    res.json(results);
  });
  connection.end();
})
//导出router。

// 获取各个部门人数的比例
router.get("/numsData",function(req,res,next){
  var connection=mysql.createConnection(config.options);
  sql="SELECT unit.unitID,name,count(uuid) AS nums FROM users,unit where users.unitID=unit.unitID GROUP BY users.unitID;"
  connection.query(sql,[],function(err,results){
    if(err)throw error;
    res.json(results);
  })
  connection.end();
})

// 获取不同管理级别的人数
router.get("/authorData",function(req,res,next){
  var connection=mysql.createConnection(config.options);
  sql="SELECT authority,count(uuid) AS nums FROM users,unit where users.unitID=unit.unitID GROUP BY users.authority;"
  connection.query(sql,[],function(err,results){
    if(err)throw error;
    res.json(results);
  })
})
module.exports = router;
