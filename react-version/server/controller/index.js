const jwt = require("jsonwebtoken");
const maria = require('./maria');
const bcrypt = require('bcrypt');

const REFRESH_SECRET_KEY = "refresh-key";
const SECRET_KEY = "TEST-KEY";
const saltRounds = 10;

const accessTokenTimeout = '1m'
const refreshTokenTimemout = '24h'

function getToken(userid, secret_key,expiresIn){
  const token = jwt.sign({
    id : userid,
  }, secret_key, {
    expiresIn: expiresIn,
    issuer: "About Tech",
  })

  return token
};

function checkLogin(reqData, res){
  try {
    const token = reqData.cookies.accessToken;
    const data = jwt.verify(token, SECRET_KEY);
    console.log(data)
    maria.query(`SELECT id FROM user WHERE id = ?`,
    [data.id],(error, results, fields) => {
      if (error) {
        res.json(error);
      } else {
        if (results.length > 0) {
          console.log(results[0].id);
          res.status(200).json(results[0]);
        }
      }
    });
  } catch(error){
    res.status(500).json(error);
  }
}

const register = (req, res) => {
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
              res.send("회원가입이 완료되었습니다");
              // res.send({
              //   status: 200,
              //   results: results,
              // });
              
            }
          }
        );
      }
    });
};

const login = (req, res) => {
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
                if (response) {
                    //accessToken 발급
                    const accessToken = getToken(results[0].id,SECRET_KEY,accessTokenTimeout)

                    const refreshToken = getToken(results[0].id,REFRESH_SECRET_KEY,refreshTokenTimemout)

                    res.cookie("accessToken", accessToken, {
                        secure : false,
                        httpOnly : true,
                    })

                    res.cookie("refreshToken", refreshToken, {
                        secure : false,
                        httpOnly : true,
                    })
                    
                    res.status(200).json("login success");
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
};

const accessToken = (req, res) => {
  checkLogin(req, res);
}

const refreshToken = (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      const data = jwt.verify(token, REFRESH_SECRET_KEY)
      maria.query(`SELECT id FROM user WHERE id = ?`,
      [data.id],(error, results, fields) => {
        if (error) {
          res.send({
            status: "error",
          });
        } else {
          if (results.length > 0) {
            console.log(results[0])
            const accessToken = getToken(results[0].id,SECRET_KEY,refreshTokenTimemout)
            res.cookie("accessToken", accessToken, {
              secure : false,
              httpOnly : true,
          })
            res.status(200).json("Access Token Recreated");
          }
        }
      });
    }catch (error){
      res.status(500);
    }
}

const loginSuccess = (req, res) => {
  checkLogin(req, res);
}

const logout = (req, res) => {
  console.log("a")
    try{
      res.cookie('accessToken', '');
      res.cookie('refreshToken','');
      res.status(200).json("Logout Success");
    } catch(error){
      res.status(500).json(error);
    }
};

module.exports = {
    register,
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout
}