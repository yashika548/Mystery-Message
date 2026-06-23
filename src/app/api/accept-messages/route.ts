import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function Post(request:Request) {
    await dbconnect()

    // now we want currently logged in user
    const session =  await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || session.user){
        return Response.json({
                    success:false,
                    message:"Not authenticated"
                },{
                    status:401
                })
    }

    const userId  = user._id;
    const {acceptMessages}= await request.json()
    try {
        const updatedUser=  await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if (!updatedUser){
            return Response.json({
            success:false,
            message:"failed to update user status to accept mesaages"
                    
            },{
            status:401
            })
        }
        return Response.json({
            success:true,
            message:"Message acceptance status updated successfully",
            updatedUser        
        },{
            status:200
        })



    } catch (error) {
        console.log("failed to update user status to accept mesaages")
        return Response.json({
            success:false,
            message:"failed to update user status to accept mesaages"
                    
        },{
            status:500
        })
    }



}

export async function GET(request:Request) {
    await dbconnect()

    // now we want currently logged in user
    const session =  await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authenticated"
        },{
            status:401
        })
    }

    const userId  = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
    if(!foundUser){
        return Response.json({
            success:false,
            message:" User not found"
        },{
            status:404
        })

    }
    // if user found
    return Response.json({
            success:true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        
    },{
            status:200
    })


    } catch (error) {
        console.log("failed to update user status to accept mesaages")
        return Response.json({
            success:false,
            message:"Error in getting messages acceptance status"
                    
        },{
            status:500
        })
    }
}