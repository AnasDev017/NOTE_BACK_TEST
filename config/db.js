import mongoose from "mongoose";

const DbCon=async()=>{
    try {
        mongoose.connect("mongodb+srv://anastahirhussain7_db_user:HFguLhncgCI9wc5E@cluster0.ekz2hmy.mongodb.net/notesApp?appName=Cluster0")
        console.log('Mongodb is connected')
        
    } catch (error) {
        console.log("Error in mongodb connection",error)
    }
}
export default DbCon