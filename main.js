const express = require('express');
const path = require('path');
const cors = require("cors")
const app = express();
const bodyParser = require("body-parser");
const maria = require('./maria');
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const session = require("express-session")
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const saltRounds = 10;

maria.connect();

const PORT = process.env.PORT || 30000

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'html');
nunjucks.configure('public/layout', {
  express: app,
  watch: true,
});

app.use(
  session({
    key: "userId",
    secret: "rorkxdmsrj",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);


app.use(
  cors({
      origin: [`http://localhost:${PORT}`],
      method: ["GET", "POST"],
      credentials: true,
  })
);

app.use('/static', express.static(path.join(__dirname, 'public')));

function logincheck(session){

}
// app.get('/', (req, res) => {
//   const { user } = req.session;
  
//   if(user){
//       console.log(user);
//       res.render('index', { user });
//       return;
//   }

//   res.render('index');
// });

app.get('/', (req, res) => {
  if (req.session.user) {
    console.log(req.session.user.id)
    const userInfo = req.session.user.id;
    res.render('index.html', {
      isLogin: true,
      userInfo,
    });
  } else {
    res.render('index.html', { isLogin: false });
  }
});

app.post('/blog/getBlogList', (req,res) => {
    var query_txt = "SELECT * FROM Board ORDER BY BoardID DESC LIMIT 5"
    maria.query(query_txt, function(err, rows, fields) {
        if(!err) {
          console.log(rows)
          res.send(rows); // responses send rows
        } else {
        console.log("err : " + err);
        res.send(err);  // response send err
        }
    });
})

app.post('/blog/getBlogDetail', (req,res) => {
  console.log(req.body)
  var query_txt = "SELECT * FROM Board WHERE Writter =" + req.body["id"]
  maria.query(query_txt, function(err, rows, fields) {
      if(!err) {
      res.send(rows); // responses send rows
      } else {
      console.log("err : " + err);
      res.send(err);  // response send err
      }
  });
})

function getRegDate(){
  var today = new Date();

  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);
  var hours = ('0' + today.getHours()).slice(-2); 
  var minutes = ('0' + today.getMinutes()).slice(-2);
  var seconds = ('0' + today.getSeconds()).slice(-2); 

  var dateString = year + '-' + month  + '-' + day;

  var timeString = hours + ':' + minutes  + ':' + seconds;

  var regdate = dateString + " " +timeString;

  return regdate;
}

app.post('/blog/addNewBoarder', (req,res) => {
  console.log(req.body)
  var query_txt = "INSERT INTO Board (Writter, contents, BoardTitle, regdate) VALUE ('" + req.body["writter"] + "','" + req.body['content'] + "','" + req.body['title'] + "','" +getRegDate() +"')";
  console.log(query_txt)
  maria.query(query_txt, function(err, rows, fields) {
      if(!err) {
        res.send(rows); // responses send rows
      } else {
        console.log("err : " + err);
        res.send(err);  // response send err
      }
  });
});

app.post("/api/auth/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      maria.query(
        `INSERT INTO user (id, password) VALUES (?, ?)`,
        [req.body.username, hash],
        (error, results, fields) => {
          if (error) {
            console.log(error);
            res.send({
              status: 400,
            });
          } else {
            res.send("<script>alert('회원가입되었습니다.');location.href='/static/layout/login.html';</script>");
            // res.send({
            //   status: 200,
            //   results: results,
            // });
            
          }
        }
      );
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  maria.query(
    `SELECT * FROM user WHERE id = ?`,
    [req.body.username],
    (error, results, fields) => {
      if (error) {
        res.send({
          status: "error",
        });
      } else {
        if (results.length > 0) {
          bcrypt.compare(
            req.body.password,
            results[0].password,
            (err, response) => {
              req.session.user = results[0];
              // console.log(req.session);
              if (response) {
                res.redirect('/?msg=로그인 되었습니다.');
              } else {
                res.send({
                  status: "incorrect password",
                });
              }
            }
          );
        } else {
          console.log("no user");
          res.send({
            status: "error",
          });
        }
      }
    }
  );
});

//리펙토링 방법 session과 로딩할 블로그를 보내서 처리하면됨
app.get(("/api/render/blog"), (req,res) => {
  if (req.session.user) {
    console.log(req.session.user.id)
    const userInfo = req.session.user.id;
    res.render('blog/blog.html', {
      isLogin: true,
      userInfo,
    });
  } else {
    res.render('blog/blog.html', { isLogin: false });
  }
});

app.get(("/api/render/blogWrite"), (req,res) =>{
  if (req.session.user) {
    console.log(req.session.user.id)
    const userInfo = req.session.user.id;
    res.render('blog/sub/boardWrite.html', {
      isLogin: true,
      userInfo,
    });
  } else {
    res.send(`<script type="text/javascript">alert("로그인 후 이용해주세요"); window.location = document.referrer; </script>`);
  }
  // res.render('blog/sub/boardWrite.html');
});


app.listen(3000, () => console.log(`Example app listening on port 3000!`));