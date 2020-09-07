// NPM Requirements
var express           = require("express"),
    app               = express(),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local");

var photoRoutes       = require("./photos");
var startPage         = require("./index")

//Blog Schema
var travel_photo      = require("./models/schema1")
var User              = require("./models/user");

//Local DataServer Connection
mongoose.connect("mongodb://localhost:27017/travel_photo", { useNewUrlParser: true, useUnifiedTopology: true });

//Basic NodeJS Settings
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressSanitizer());
//app.use(MethodOverride('_method'));

//Settings LogIn
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


//Creat a Database

/*
travel_photo.create( {
    name: "Ladakh",
    image: "https://www.thrillophilia.com/blog/wp-content/uploads/2015/01/Chadar-trek-1024x577.jpg",
    location:"ladakh",    
},function(err,travel_photo){
    if(err){
        console.log(err);
    }
});
*/

//Routing Starts Here

app.get("/photos/:id",function(req,res){
    travel_photo.findById(req.params.id,function(err,foundcamground){
        if(err){
            console.log(err);
        }
        else
        res.render("show",{kanak:foundcamground});
        });
        
});

// Register Route
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

 //LogIN Route
 app.get("/login", function(req, res){
    res.render("login"); 
 });
 app.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/photos",
         failureRedirect: "/login"
     }), function(req, res){
 });

 //LogOUT Route
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
 
// Server Listen Route
app.listen(3000, function() { 
    console.log('Server listening on port 3000'); 
  });
