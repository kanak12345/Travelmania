var express=require("express");
var app=express();
var bodyParser=require("body-parser")
var mongoose=require("mongoose")
var passport=require("passport")
var LocalStrategy=require("passport-local")
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true});
var User=require("./models/user");
const { session, initialize } = require("passport");
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");

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
app.get("/",function(req,res){
    res.render("travel")
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
            res.redirect("/travel"); 
         });
     });
 });
 app.get("/login", function(req, res){
    res.render("login"); 
 });
 app.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/travel",
         failureRedirect: "/login"
     }), function(req, res){
 });
 app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/travel");
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
