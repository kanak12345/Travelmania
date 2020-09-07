var express=require("express");
var app=express();
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
var photoRoutes = require("./photos");
var startPage=require("./index")
var passport=require("passport")
var LocalStrategy=require("passport-local")
var travel_photo = require("./models/schema1")
var User=require("./models/user");
mongoose.connect("mongodb://localhost:27017/travel_photo", {useNewUrlParser:true});
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

app.use("/photos",photoRoutes)
app.use("/",startPage)
app.get("/photos/:id",function(req,res){
    travel_photo.findById(req.params.id,function(err,foundcamground){
        if(err){
            console.log(err);
        }
        else    res.render("show",{kanak:foundcamground});
        })
        
});
app.get("/register", function(req, res){
    res.render("register"); 
 });

 app.post("/register", function(req, res){
     var newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){
             console.log(err);
             return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
            res.redirect("/photos"); 
         });
     });
 });
 app.get("/login", function(req, res){
    res.render("login"); 
 });
 app.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/photos",
         failureRedirect: "/login"
     }), function(req, res){
 });
 app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
 });
 
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }
 

app.listen(3000, function() { 
    console.log('Server listening on port 3000'); 
  });
