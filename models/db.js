const mongoose=require("mongoose");
const connectionDB=()=>{
  mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("Data base is Connected ")
  }).catch(()=>{
    console.log("something went wrong in the database connection")
  })
}

module.exports=connectionDB;