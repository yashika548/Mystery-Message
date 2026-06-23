import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

// now make query schema

const UsernameQuerySchema = z.object({
    username: usernameValidation

})
// now we write get method to check username exist or not
export async function GET(request:Request) {
    // // todo: use this in all other routes
    // console.log('Recieved request with method:${request.method}');
    // if(request.method!= 'GET'){
    //     return Response.json({
    //             success:false,
    //             message: 'Method not allowed',
    //         },{status:405})
    //     }

    



    await dbconnect()
    // localhost:3000/api/cuu?username=yashika?phone=android?
    try {
        const {searchParams} = new URL(request.url)
        const queryParam ={
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) //todo remove
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length>0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters',
            },{status:400}
        )
        }

        const {username}  =result.data

        const existingVerifiedUser = await UserModel.findOne({username,isVerified: true})

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message: 'Username is already taken',
            },{status:400})
        }

       
            return Response.json({
                success:true,
                message: 'Username is unique',
            },{status:200})
        


    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{
            status:500
        })
    }
}
