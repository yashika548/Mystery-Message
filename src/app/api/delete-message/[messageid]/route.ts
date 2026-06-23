import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";

export async function DELETE(request:Request, {params}:{params: {messageid: string}}) {
    const messageId = params.messageid
    await dbconnect()
    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session ||!session.user){
        return Response.json({
           success:false,
           message:"Not authenticated"
                    
        },
        {status:401}
        )


    }
    try {
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            // hamare case me poore document ja rhe h 
            {$pull: {messages: {_id: messageId}}}
        )
        if(updateResult.modifiedCount == 0){
            return Response.json({
                success: false,
                message: "Message not found or already delete"
            },
        {status: 404})

        }
        return Response.json({
                success: true,
                message: "Message deleted"
            },
        {status: 200})

    } catch (error) {
        console.log("Error in deleting message route", error)
        return Response.json({
                success: false,
                message: "Error deleting message"
            },
        {status: 500})
      }
        
    
    

    
    
}