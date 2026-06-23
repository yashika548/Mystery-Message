"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React  from "react";
import { Controller, useForm } from "react-hook-form";
import {toast} from "sonner"
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()

    // zod implementation
        const form = useForm<z.infer<typeof verifySchema>>({
            resolver: zodResolver(verifySchema),
            
        })
    
        const onSubmit  = async (data:z.infer<typeof verifySchema>) =>{

            try {
                const response = await axios.post(`/api/verify-code`,{
                    username: params.username,
                    code: data.code
                })

            toast.success("Success", {
               description: response.data.message,
            })  

            router.replace('sign-in')
            } catch (error) {
                console.log("Error in signup of user" , error)
                    const axiosError = error as AxiosError<ApiResponse>;
                    const errorMessage =axiosError.response?.data.message || "Something went wrong"
                    toast.error("Signup failed", {
                    description: errorMessage,});
                   
                
            }
        }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">Enter the verifivation ode sent to your email

                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
                <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel>Verification Code
                  </FieldLabel>
                  <Input placeholder="code"
                    {...field}
                    
                  />
                  
                </Field>
              )}
            /> 
            
                    
            
          </FieldGroup>
          <Button type="submit">Submit</Button>

          </form>
          </Form>

            </div>
        </div>
    )
}

export default VerifyAccount