// components/JobDetails.js

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
const JobDetails = ({
  form,
  jobTitle,
  jobtypes,
  jobIndustry,
  jobSalary,
  workexp,
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between gap-6">
      <FormField
        control={form.control}
        name="jobTitle"
        render={({ field }) => (
          <FormItem className="w-[65%]">
            <FormLabel className="text-md font-medium text-gray-700">
              Job Title
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Job Title"
                {...field}
                className="border-gray-300  rounded-md bg-white text-gray-900"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="jobType"
        render={({ field }) => (
          <FormItem className="flex flex-col flex-1">
            <FormLabel className="text-md font-medium text-gray-700">
              Job Type
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? jobtypes.find((job) => job.value === field.value)?.label
                      : "Job Type"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className=" p-0">
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
    </div>
    <div className="flex items-center  justify-between gap-6">
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem className="flex flex-col w-1/3">
            <FormLabel className="text-md font-medium text-gray-700">
              Job Industry
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      " justify-between bg-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? jobIndustry.find((job) => job.value === field.value)
                          ?.label
                      : "Industries"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
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
        className=""
        render={({ field }) => (
          <FormItem className="flex flex-col w-1/3">
            <FormLabel className="text-md font-medium text-gray-700">
              Salary
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? jobSalary.find((sal) => sal.value === field.value)
                          ?.label
                      : "Job Salary"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
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
        className=""
        render={({ field }) => (
          <FormItem className="flex flex-col w-1/3">
            <FormLabel className="text-md font-medium text-gray-700">
              Work Experience
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-white",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? workexp.find((exp) => exp.value === field.value)?.label
                      : "Job Experience"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
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
  </div>
);

export default JobDetails;
