"use client";
import { ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  fullName: z.string().min(2),
  phoneNumber: z.string().min(10).max(10),
  currentCompany: z.string().min(2),
  currentJobLocation: z.string().min(2),
  prefJobLocation: z.string().min(2),
  schoolName: z.string().min(2),
  collegeName: z.string().min(2),
  gradYear: z.string().min(2),
  gitHubLink: z.string().min(6),
  linkdenLink: z.string().min(6),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

const onSubmit = () => {};

const JobSeekerPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      currentCompany: "",
      currentJobLocation: "",
      prefJobLocation: "",
      schoolName: "",
      collegeName: "",
      gradYear: "",
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-secondary">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Job Seeker Form</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Mobile Number"
                      type="tel"
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
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full sm:w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your School Name"
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
              name="collegeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your College Name"
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
              name="gradYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Graduation Year"
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
              name="currentCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Current Company Name"
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
              name="currentJobLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Job Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Current Job Location"
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
              name="prefJobLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Job Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Preferred Job Location"
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
              name="linkdenLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your LinkedIn Profile URL"
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
              name="gitHubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your GitHub Profile URL"
                      {...field}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default JobSeekerPage;
