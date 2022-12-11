const express = require('express');
const path = require('path');
const cors = require("cors")
const app = express();
const bodyParser = require("body-parser");
const maria = require('./maria');

maria.connect();

const PORT = process.env.PORT || 30000

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','layout','index.html'));
});

app.post('/blog/getBlogList', (req,res) => {
    var query_txt = "SELECT * FROM boardDB ORDER BY board_id DESC LIMIT 5"
    maria.query(query_txt, function(err, rows, fields) {
        if(!err) {
        res.send(rows); // responses send rows
        } else {
        console.log("err : " + err);
        res.send(err);  // response send err
        }
    });
})

app.post('/blog/getBlogDetail', (req,res) => {
  console.log(req.body)
  var query_txt = "SELECT * FROM boardDB WHERE board_id =" + req.body["id"]
  maria.query(query_txt, function(err, rows, fields) {
      if(!err) {
      res.send(rows); // responses send rows
      } else {
      console.log("err : " + err);
      res.send(err);  // response send err
      }
  });
})

app.post('/blog/addNewBoarder', (req,res) => {
  console.log(req.body)
  var query_txt = "INSERT TO boardDB (writter, content, title) VALUE (" + req.body["writter"] + "," + req.body['content'] + "," + req.body['title'] + ")";
  maria.query(query_txt, function(err, rows, fields) {
      if(!err) {
        res.send(rows); // responses send rows
      } else {
        console.log("err : " + err);
        res.send(err);  // response send err
      }
  });
})

app.listen(3000, () => console.log(`Example app listening on port 3000!`));