"use client";

import {
  jobtypes,
  jobIndustry,
  workexp,
  indianCities,
  jobSalary,
  indianStates,
  skilloptions,
} from "components/dataset/jobformdata.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";

function extractTextFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() || "";
}

const formSchema = z.object({
  jobDescription: z.string().refine((value) => {
    return extractTextFromHTML(value).trim().length >= 5;
  }),
  jobTitle: z.string().min(2),
  contactName: z.string().min(2),
  contactPhone: z.string().min(10).max(10),
  contactEmail: z.string().email(),
  jobType: z.string(),
  salary: z.string(),
  workexp: z.string(),
  requiredskills: z.string().array(),
  industry: z.string(),
  State: z.string(),
  city: z.string(),
});

const JobFormpage = () => {
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      industry: "",
      State: "",
      city: "",
      salary: "",
      workexp: "",
      jobType: "",
    },
  });

  const onSubmit = () => {};

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    console.log(selectedOptions);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
              name="contactPhone"
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
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Email Address"
                      type="email"
                      {...field}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-xl font-semibold">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Job Type</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? jobtypes.find(
                                (job) => job.value === field.value
                              )?.label
                            : "Job Type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Job Types" />
                        <CommandList>
                          <CommandEmpty>No Job Found</CommandEmpty>
                          <CommandGroup>
                            {jobtypes.map((job) => (
                              <CommandItem
                                value={job.label}
                                key={job.value}
                                onSelect={() => {
                                  form.setValue("jobType", job.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    job.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {job.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Job Industry</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? jobIndustry.find(
                                (job) => job.value === field.value
                              )?.label
                            : "Industries"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Job Industries" />
                        <CommandList>
                          <CommandEmpty>No Industry Found</CommandEmpty>
                          <CommandGroup>
                            {jobIndustry.map((industry) => (
                              <CommandItem
                                value={industry.label}
                                key={industry.value}
                                onSelect={() => {
                                  form.setValue("industry", industry.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    industry.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {industry.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Salary</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? jobSalary.find(
                                (sal) => sal.value === field.value
                              )?.label
                            : "Job Salary"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Salary" />
                        <CommandList>
                          <CommandEmpty>No Salary</CommandEmpty>
                          <CommandGroup>
                            {jobSalary.map((sal) => (
                              <CommandItem
                                value={sal.label}
                                key={sal.value}
                                onSelect={() => {
                                  form.setValue("salary", sal.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    sal.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {sal.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workexp"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Work Experience</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? workexp.find(
                                (exp) => exp.value === field.value
                              )?.label
                            : "Job Experience"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Experience" />
                        <CommandList>
                          <CommandEmpty>No Experience</CommandEmpty>
                          <CommandGroup>
                            {workexp.map((exp) => (
                              <CommandItem
                                value={exp.label}
                                key={exp.value}
                                onSelect={() => {
                                  form.setValue("workexp", exp.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    exp.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {exp.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-xl font-semibold">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="State"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? indianStates.find(
                                (st) => st.value === field.value
                              )?.label
                            : "States"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="States" />
                        <CommandList>
                          <CommandEmpty>No State Found</CommandEmpty>
                          <CommandGroup>
                            {indianStates.map((state) => (
                              <CommandItem
                                value={state.label}
                                key={state.value}
                                onSelect={() => {
                                  form.setValue("State", state.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    state.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {state.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>City</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full md:w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? indianCities.find(
                                (ct) => ct.value === field.value
                              )?.label
                            : "Cities"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Cities" />
                        <CommandList>
                          <CommandEmpty>No City Found</CommandEmpty>
                          <CommandGroup>
                            {indianCities.map((city) => (
                              <CommandItem
                                value={city.label}
                                key={city.value}
                                onSelect={() => {
                                  form.setValue("city", city.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    city.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <h2 className="text-xl font-semibold">Job Requirements</h2>
          <FormField
            control={form.control}
            name="requiredskills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills Required</FormLabel>
                <Select
                  isMulti
                  value={selectedOptions}
                  onChange={(selectedOption) => {
                    handleChange(selectedOption);
                    field.onChange(selectedOption);
                  }}
                  options={skilloptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select skills required for the job"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-indigo-600 text-white">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default JobFormpage;
