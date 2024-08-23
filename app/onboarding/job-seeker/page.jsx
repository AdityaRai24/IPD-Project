"use client";
import { ChevronRight } from "lucide-react"
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
  FormDescription,
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
            name="phoneNumber"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Mobile Number"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
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
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your School Name"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="collegeName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>College Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your College Name"
                      type="tel"
                      {...field}x
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="gradYear"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Graduation Year"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="currentCompany"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Current Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Current Company Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="currentJobLocation"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Current Job Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Current Job Location"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="prefJobLocation"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Prefered Job Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Prefered Job Location"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="linkdenLink"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Linkden Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Linkden Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="gitHubLink"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>GitHub Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your GitHub Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Next<ChevronRight className="h-4 w-4" /></Button>
        </form>
      </Form>
    </main>
  );
};

export default JobSeekerPage;