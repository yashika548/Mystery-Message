import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAccepptingMessage?: boolean;
    messages?: Array<Message>
}