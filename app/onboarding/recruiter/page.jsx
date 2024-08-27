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
import UploadImage from "@/components/uploads/UploadImage"

const formSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  companyRole: z.string().min(2),
});

const onSubmit = () => {
  // handle form submission logic here
};

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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-secondary">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Recruiter Form</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Full Name"
                      {...field}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Company Name"
                      {...field}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Company Role</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the role you're looking for"
                      {...field}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <UploadImage />
            <Button type="submit" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default RecruiterPage;
