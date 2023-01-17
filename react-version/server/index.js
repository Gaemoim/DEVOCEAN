const express = require('express');
const path = require('path');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const {
    register,
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout
} = require('./controller')

const PORT = process.env.PORT || 8080

dotenv.config();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());

nunjucks.configure('public/layout', {
    express: app,
    watch: true,
});

app.use(
    cors({
        origin: 'http://localhost:3000',
        method: ["GET", "POST"],
        credentials: true,
    })
);


// access token을 secret key 기반으로 생성
const generateAccessToken = (id) => {
    return jwt.sign({ id }, SECRET_KEY, {
        expiresIn: "15m",
    });
};

// refersh token을 secret key  기반으로 생성
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, REFRESH_SECRET_KEY, {
        expiresIn: "180 days",
    });
};

// app.post("/api/auth/register", (req, res) => {
//     bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
//       if (err) {
//         console.log(err);
//       } else {
//         maria.query(
//           `INSERT INTO user (id, password) VALUES (?, ?)`,
//           [req.body.username, hash],
//           (error, results, fields) => {
//             if (error) {
//               console.log(error);
//               res.send({
//                 status: 400,
//               });
//             } else {
//               res.send("회원가입이 완료되었습니다");
//               // res.send({
//               //   status: 200,
//               //   results: results,
//               // });
              
//             }
//           }
//         );
//       }
//     });
// });

// app.post("/api/auth/login", (req, res) => {
//     maria.query(
//       `SELECT * FROM user WHERE id = ?`,
//       [req.body.username],
//       (error, results, fields) => {
//         if (error) {
//           res.send({
//             status: "error",
//           });
//         } else {
//           if (results.length > 0) {
//             bcrypt.compare(
//               req.body.password,
//               results[0].password,
//               (err, response) => {
//                 if (response) {
//                     let accessToken = generateAccessToken(results[0].id);
//                     let refreshToken = generateRefreshToken(results[0].id);
                    
//                     res.json({ state:"succes",accessToken, refreshToken });
//                 } else {
//                   res.send({
//                     status: "incorrect password",
//                   });
//                 }
//               }
//             );
//           } else {
//             console.log("no user");
//             res.send({
//               status: "error",
//             });
//           }
//         }
//       }
//     );
// });

app.post('/api/auth/register',register);

app.post("/api/auth/login",login);

app.get('/api/auth/accesstoken', accessToken);

app.get('/api/auth/refreshtoken', refreshToken);

app.get('/api/auth/loginsuccess', loginSuccess);

app.get('/api/auth/logout', logout);
  
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));