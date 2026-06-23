import { AISDKError } from "ai";
import { NextResponse } from "next/server";
import { APICallError } from "ai";

export function handleAIError(error: unknown) {
   

if (error instanceof APICallError) {
  console.log(error.statusCode);
}
  if (error instanceof AISDKError) {
    return NextResponse.json(
      {
        success: false,
        name: error.name,
        message: error.message,
        
      },
      {
        status: 500,
      }
    );
  }

  console.error("Unexpected Error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
    }
  );
}