var mongoose =require("mongoose")
var travelSchema=new mongoose.Schema({
    name:String,
    image:String,
    location:String,
    id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
    }

});
module.exports=mongoose.model("places",travelSchema)