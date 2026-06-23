import mongoose from "mongoose";



type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbconnect (): Promise<void> {

    console.log("URI:", process.env.MONGODB_URI);
    // check connection if it is already exist
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }
    // if nhi h 
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || 
            '',{}
        )
        connection.isConnected = db.connections[0].readyState

        console.log("db connected successfully")

    }
    catch(error){

        console.log("Database connectoin failed", error);

        process.exit(1)

    }
}

export default dbconnect;