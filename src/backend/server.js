const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 4000;
const mongoose = require("mongoose");
const {Users} = require("./models");
app.use(cors());
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());
app.set("view engine", "ejs");
const router = express.Router();
const argon2 = require('argon2');
'use strict';
var crypto = require('crypto');
const signatureFunction = crypto.createSign('RSA-SHA256');
const verifyFunction = crypto.createVerify('RSA-SHA256');
const base64 = require('base64url');
var randomize = require('randomatic');




mongoose.connect("mongodb://localhost/crypto_tp", {
  useNewUrlParser: true,
  useCreateIndex: true, 
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.set('useFindAndModify', false);
connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

app.use("/", router);
app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

async function hash(textToHash) {
  var textHashed = "";
  try {
    textHashed = await argon2.hash(textToHash, {type: argon2.argon2i});
  } catch (err) {
    console.log(err)
  }
  return textHashed
}

async function verify(hashedText, plainText){
  var match
  try {
    if (await argon2.verify(hashedText, plainText)) {
      match = true
    } else {
      match = false
    }
  } catch (err) {
    console.log(err)
  }
  return match
}
app.post('/create', async (req, res) => { 
  var pin = await hash(randomize('0', 4));
  var request = { 
      nom: req.body.nom,
      prenom: req.body.prenom,
      civility: req.body.civility,
      birth: req.body.birth,
      email: req.body.email,
      accountnumber: "16091" + randomize('0', 7) + randomize('A', 1),
      pin: pin
    };
    var find;
    Users.find(
        {'accountnumber': request.accountnumber}, 
        async function(err, result) {
        while (find) {
          if (err) {
            res.send(err);
          } 
          else {
            if(result && result.length){
              request.accountnumber = "16091" + randomize('0', 7) + randomize('A', 1)
            }
            else {
              find  = false
            }
          }
        }
      })
    var mod = new Users(request);  
        mod.save(function(err, response){  
            if(err){  
                res.send(err);                
            }  
            else{      
                response.pin = pin
                console.log(response.pin)
                console.log(response)
                res.send({response});  
            }  
        });  
}); 
router.route("/apibank/create")
  .post( async function(req, res) { 
    var request = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      civility: req.body.civility,
      birth: req.body.birth,
      email: req.body.email,
      accountnumber: "16091" + randomize('0', 7) + randomize('A', 1),
      pin: await hash(randomize('0', 4))
    };
    console.log(req.body);
    console.log(request);
    var mod = new Users(request);  
        mod.save(function(err, response){  
            if(err){  
                res.send(err);                
            }  
            else{        
                res.send({response});  
            }  
        });  
}); 

 router.route("/login")
  .get( function(req, res) {
      var request = {};
      request["email"] = req.query.email;
      console.log(request)
      Users.find(
          request, 
          async function(err, result) {
          if (err) {
            res.send(err);
          } else {
            if(result && result.length){
              var match = await verify(result[0].pass, req.query.pass)
              if (match) {

                const header = {
                  "alg": "RS256",
                  "typ": "JWT"
                }

                const payload = { 
                  iss: 'webservice.it', 
                  sub: 'Azure/'+ result[0].email,
                  scope: "self, admins",
                  jti: "c84280e6-0021-4e69-ad76-7a3fdd3d4ede",
                  iat: 1434660338,
                  exp: 1434663938,
                  nbf: 1434663938,
                }
                let base64dataPayload = new Buffer.from(JSON.stringify(payload)).toString('base64');
                let base64dataHeader = new Buffer.from(JSON.stringify(header)).toString('base64');

                base64dataHeader = base64.fromBase64(base64dataHeader);

                base64dataPayload = base64.fromBase64(base64dataPayload);

                let headerClaims = base64dataHeader+ '.' + base64dataPayload

                signatureFunction.write(headerClaims);
                signatureFunction.end();

                const PRIV_KEY = fs.readFileSync(__dirname + '/id_rsa_priv.pem', 'utf8');
                const PUB_KEY = fs.readFileSync(__dirname + '/id_rsa_pub.pem', 'utf8');

                let signatureBase64 = signatureFunction.sign(PRIV_KEY, 'base64');
                
                signatureBase64 = base64.fromBase64(signatureBase64);

                console.log(signatureBase64);

                
                let token = headerClaims + '.' + signatureBase64;

                const jwtParts = token.split('.');
                const headerInBase64UrlFormat = jwtParts[0];
                const payloadInBase64UrlFormat = jwtParts[1];
                const signatureInBase64UrlFormat = jwtParts[2];

                
                verifyFunction.write(headerInBase64UrlFormat + '.' + payloadInBase64UrlFormat);
                const signatureInBase64 = base64.toBase64(signatureInBase64UrlFormat);
                verifyFunction.end();
                const signatureIsValid = verifyFunction.verify(PUB_KEY, signatureInBase64, 'base64');
                
                console.log(signatureInBase64);
                console.log(signatureIsValid);

                res.send(match);
              }
              else {
                console.log(match)
                res.send(match);
              }
            }
          }
      });
});

