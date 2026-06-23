import mongoose, {Schema, Document}from "mongoose";


export interface Message extends Document{
    _id:mongoose.Types.ObjectId,
    content: string;
    createdAt: Date;

}

//mongoose me string capital me but in typescript string in small
const MessageSchema: Schema<Message> = new Schema({ 
    content: {
        type:  String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now()
    }
})
// extends keyword used to create a subclass that inherits the property of parent class
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true,"Username is required"],
        trim: true,
        unique: true,
    },
    email:{
        type: String,
        required:[true,"Email is required"],
        unique: true,
        match: [/.+\@.+\..+/,'please use a valid email address']
    },
    password:{
        type: String,
        required:[true,"Password is required"],   
    },
    verifyCode:{
        type: String,
        required:[true,"Verify code is required"],
    },
    verifyCodeExpiry:{
        type: Date,
        required:[true,"Verify code expiry is required"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAcceptingMessage:{
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema]

})
// exporting our schema in nextjs
const UserModel = (mongoose.models.User as mongoose.Model<User>) ||
 ( mongoose.model<User>("User" , UserSchema))

export default UserModel;