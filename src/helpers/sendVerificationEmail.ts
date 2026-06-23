import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

// email hamesha async hote h 
export async function sendVerificationEmail(
    email:string,
    username: string,
    verifycode: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: ' Mystery message verification code',
        react: VerificationEmail({username, otp:verifycode}),
    });
        return{ success:true,message:'Verification email send successfully'}
        
        
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return{ success:false,message:'Failed to send verification email'}
        
    };
}