var express=require("express");
var router=express.Router();
var travelMania=require("./models/schema1")
router.get("/",function(req,res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        travelMania.find({name: regex}, function(err, photo){
           if(err){
               console.log(err);
           } else {
            res.render("places",{kanak:photo});
           }
        });
    }
    else{
        travelMania.find({},function(err,photo){
            if(err){
                console.log("err");
            }
            else{
                res.render("places",{kanak:photo});
            }
        });
    }
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;