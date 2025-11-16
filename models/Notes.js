import mongoose from "mongoose";
const NotesSchema= new mongoose.Schema({
    title:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    
},{
    timestamps:true
})

const NotesModel=mongoose.model("Notes",NotesSchema)

export default NotesModel