"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import UploadImage from "@/components/UploadImage"



const formSchema = z.object({
    fullName: z.string().min(2),
    companyName: z.string().min(2),
    companyRole: z.string().min(2)
    });

const onSubmit = () => {

}

const RecruiterPage = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fullName: "",
          companyName: "",
          companyRole: "",
        },
      });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
         <FormField
          control={form.control}
          name="companyRole"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Company Name </FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Company Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Company Role </FormLabel>
                <FormControl>
                  <Input placeholder="Enter the role your looking for" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
          <UploadImage/>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  </main>
  )
}

export default RecruiterPage

