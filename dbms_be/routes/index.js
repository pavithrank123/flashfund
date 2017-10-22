var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
/*
var db = require('../app');
*/
var promise = require('bluebird');
var options = {
    // Initialization Options
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
var cn = {
    port : 5432,
    user : 'postgres',
    host  : '127.0.0.1',
    database : 'postgres',
    password : '1234'
};
var db = pgp(cn);
db.connect()
    .then (function(){
        console.log("Connected to db")},function (err) {console.log("DB not connected");
        console.log(err); });

router.post('/register',function(req,res){
    try {
        var first_name=req.body.name;
        var password=req.body.password;
        var id=Math.ceil(Math.random()*100000);
        console.log(first_name);
        console.log(password);
        console.log(id);
        console.log(typeof(first_name));
        console.log(typeof(password));
        console.log(id);
        db.query("select custid from customer where email=$1",[first_name]).then(function onSuccess(data) {
            if(data.length!=0)
            {
                console.log("User already exists");
                res.sendStatus(401);
            }
            else{
                db.query("insert into customer (custid,email,password) values ($1,$2,$3)",[id,first_name,password]).then(function onSuccess(){
                    console.log("Query successful");
                    db.query("insert into balance (email,balance) values ($1,10001)",[first_name]).then(function onSuccess(){
                        console.log("Query successful");
                        res.sendStatus(200);

                    },function onFailure(err){
                        console.log(err);
                    });
                },function onFailure(err){
                    console.log(err);
                });
            }
        },function onFailure(err){
            console.log(err);
        });

    }
    catch(err){
        console.log(err);
    }
});
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log("got the details");
    db.query("select custid from customer where email=$1 ",[username]).then(function onSuccess(data){
        console.log("The data is");
        console.log(data[0]);
        if(data.length==0)
        {
            console.log("NO USER FOUND");
            res.sendStatus(402);
        }
        else{
            db.query("select password from customer where email=$1 ",[username]).then(function onSuccess(data){
                if(password==data[0].password)
                {
                    console.log("password matching ");
                    db.query("update customer set token = '1001' where email=$1",[username]).then(function onSuccessdata() {
                        console.log("Token provided");
                        var datas={
                            data:username
                        };
                        console.log(datas);
                        res.status(200).json(datas);
                    }, function onFailure(err){console.log(err);})
                }
                else
                {
                    console.log("password mismatch");
                    res.sendStatus(401);
                }
            },function onFailure(err){console.log(err);})
        }

    },function onFailure(err){
        console.log(err);
    });
});
router.post('/logout', function(req, res) {
    var email = req.body.emailid;
    console.log("got the details");
    db.query("select custid from customer where email=$1 ",[email]).then(function onSuccess(data){
        console.log("The data is");
        console.log(data[0]);
        if(data.length==0)
        {
            console.log("NO USER FOUND");
            res.sendStatus(402);
        }
        else{
            db.query("select token from customer where email=$1 ",[email]).then(function onSuccess(data){
                if(data[0].token==1001)
                {
                    console.log("The token status is ");
                    console.log(data[0].token);
                    db.query("update customer set token = 'null' where email=$1",[email]).then(function onSuccessdata() {
                        console.log("Token Deleted");
                        res.sendStatus(200);
                    }, function onFailure(err){console.log(err);})
                }
                else
                {
                    console.log("token already signed out");
                    res.sendStatus(401);
                }
            },function onFailure(err){console.log(err);})
        }

    },function onFailure(err){
        console.log(err);
    });
});

router.post('/balance', function(req, res) {
    var email = req.body.data;
    console.log("got the details");
    db.query("select custid from customer where email=$1 ",[email]).then(function onSuccess(data){
        console.log("The data is");
        console.log(data[0]);
        if(data.length==0)
        {
            console.log("NO USER FOUND");
            res.sendStatus(402);
        }
        else{
            db.query("select balance from balance where email=$1 ",[email]).then(function onSuccess(data){
                var balance=data[0].balance;
                console.log(data[0].balance);
                res.status(200).json(balance);
            },function onFailure(err){console.log(err);})
        }

    },function onFailure(err){
        console.log(err);
    });
});
router.post('/verify', function(req, res) {
    var email = req.body.email;
    var femail = req.body.femail;
    var amount = req.body.amt;
    console.log(email);
    console.log(femail);
    console.log(amount);
    if(email==femail)
    {
        res.sendStatus(408);
    }
    console.log("got the details");
    db.query("select custid from customer where email=$1 ",[email]).then(function onSuccess(data){
        if(data.length==0)
        {
            console.log("NO USER FOUND");
            res.sendStatus(402);
        }
        else {
            console.log("Userfound");
            db.query("select balance from balance where email=$1 ",[femail]).then(function onSuccess(data){
                if(data[0].balance<amount){
                    res.sendStatus(401);
                }
                else
                {
                    var newbalance=data[0].balance-amount;
                    console.log("NEW BALANCE IS ");
                    console.log(newbalance);
                    db.query("update balance set balance=$1 where email=$2",[newbalance,femail]).then(function onSuccess(data){
                        console.log("BALANCE DEDUCTED");

                    },function onFailure(err){
                        console.log(err);
                    });
                    db.query("select balance from balance where email=$1 ",[email]).then(function onSuccess(data1) {
                        var recbalance=data1[0].balance+amount;
                        console.log("ADDED BALANCE IS ");
                        console.log(recbalance);
                        db.query("update balance set balance=$1 where email=$2",[recbalance,email]).then(function onSuccess(data){
                            console.log("BALANCE ADDED");
                            var day = new Date().toDateString();
                            var type="MoneyTransfer";
                            db.query("insert into logs values($1,$2,$3,$4,$5)",[femail,email,amount,type,day]).then(function onSuccess(data){
                                console.log("BALANCE ADDED");
                                res.sendStatus(200);

                            },function onFailure(err){
                                console.log(err);
                            });
                        },function onFailure(err){
                            console.log(err);
                        });
                    },function onFailure(err) {
                        console.log(err);
                    })
                }
            },function onFailure(err){
                console.log(err);
            });
        }
    },function onFailure(err){
        console.log(err);
    });
});
module.exports=router;