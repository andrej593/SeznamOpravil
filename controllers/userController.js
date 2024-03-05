var UserModel = require('../models/userModel.js');
var ListModel = require('../models/listModel.js');
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = {
    //show pages

    showLogin: function (req, res) {
        return res.render('login', {message:"", user:""});
   },
   
   showRegister: function (req, res) {
        return res.render('register', {message:"", user:""});
   },

    showHomePage: function (req, res) {
        ListModel.find(function (err, lists) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting list.',
                    error: err
                });
            }
            return res.render('userHome', {user:req.user, lists:lists});
        });
        
    },

   login:function(req, res){
        passport.authenticate("local", {
            successRedirect: 'homePage' ,
            failureRedirect: 'login',
          })(req, res)
   },

    logout:function(req, res){
        req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        });
    },

    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(user);
        });
    },

    create: function (req, res) {
        UserModel.findOne({username:req.body.username}, function(err, user){
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!user) {
                var user = new UserModel({
                    username : req.body.username,
                    name : req.body.name,
                    lastname : req.body.lastname,
                    email : req.body.email,
                    password : req.body.password
                });
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user.save(function (err, user) {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Error when creating User',
                                    error: err
                                });
                            }
                            console.log(user);
                            var message={message:"", user:""};
                            return res.render('login', message);
                            //return res.status(201).json(user);
                        });
                    })
                );
            }else{
                var message={message:"Account already exists! Try using a differnet username.", user:""};
                return res.render('register', message);
            }
        });
    },

    update: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            user.username = req.body.username ? req.body.username : user.username;
			user.name = req.body.name ? req.body.name : user.name;
			user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
			user.email = req.body.email ? req.body.email : user.email;
			user.password = req.body.password ? req.body.password : user.password;
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }

                return res.json(User);
            });
        });
    },
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
