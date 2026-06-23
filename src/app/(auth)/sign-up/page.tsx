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



const page =() => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    // loader phase to manage state
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)
    // const { toast } = useSonner()
    const router = useRouter();


    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username:'',
            email:'',
            password:''
        }
    })

    

    useEffect(()=>{
        const checkUsernameUnique = async () =>{
            if(username){
                setIsCheckingUsername(true)
                setUsername('')
                try {
                     const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    //  console.log(response.data.message)
                     setUsernameMessage(response.data.message)
                    
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                } finally{
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()

    },[username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) =>{
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast.success("Success", {
               description: response.data.message,
            })      
            router.replace(`/verify/${username}`)
            setIsSubmitting(false)
        } catch (error) {
            console.log("Error in signup of user" , error)
             const axiosError = error as AxiosError<ApiResponse>;
                const errorMessage =
                   axiosError.response?.data.message || "Something went wrong"

            toast.error("Signup failed", {
            description: errorMessage,});
            setIsSubmitting(false)
          }
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-wmd p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure 

                    </p>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6">
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel >Username
                  </FieldLabel>
                  <Input placeholder="username"
                    {...field}
                    onChange={(e) =>{
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                  />
                  
                </Field>
              )}
            /> 
            {isCheckingUsername && <Loader2 className="animate-spin" />}
            <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
              test {usernameMessage}
            </p>
                    
            
          </FieldGroup>


          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => (
                <Field >
                  <FieldLabel >Email
                  </FieldLabel>
                  <Input placeholder="email"
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

          <Button type="submit" disabled={isSubmitting}>
            {
              // is submitting true h toh kuch kr lenge ...or agr false h toh kuch or kr lenge
              isSubmitting ?(
                <>
                <Loader2  className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ) : ('Signup')
            }
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