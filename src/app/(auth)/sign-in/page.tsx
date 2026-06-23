'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import {  toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios,{AxiosError} from'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { fi } from "zod/v4/locales"
import { title } from "process"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/ui/field"
import { FieldDescription } from "@/components/ui/field"
import { FieldContent } from "@/components/ui/field"
import { FieldLabel } from "@/components/ui/field"
import { FieldGroup } from "@/components/ui/field"
import { FieldError } from "@/components/ui/field"
import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";



const page =() => {
   
    
   

   
    const router = useRouter();


    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier:'',
            password:''
        }
    })

    

    

    const onSubmit = async (data: z.infer<typeof signInSchema>) =>{
        const result = await signIn('credentials',{
          redirect: false,
          identifier: data.identifier,
          password: data.password
        })
        if(result?.error){
          toast.error("Login failed", {
            description: "Incorrect username or password"});
        }
        if(result?.url){
          router.replace('/dashboard')
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-wmd p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure 

                    </p>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
          


          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel >Email/Username
                  </FieldLabel>
                  <Input placeholder="email/username"
                    {...field}
                    
                  />  
                </Field>
              )}
            /> 
          </FieldGroup>


          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel >Password
                  </FieldLabel>
                  <Input type="password" placeholder="password"
                    {...field}
                    
                  />  
                </Field>
              )}
            /> 
          </FieldGroup>

          <Button type="submit" >
            Signin
          </Button>
                    </form>

                </Form>
                <div>
                  <p>
                    Already a member?{''}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800 ">
                    Sign in
                    </Link>
                  </p>
                </div>
 
            </div>
        </div>

    )
}

export default page