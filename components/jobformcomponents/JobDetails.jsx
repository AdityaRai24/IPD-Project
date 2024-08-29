// components/JobDetails.js

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const JobDetails = ({ form, jobtypes, jobIndustry, jobSalary, workexp }) => (
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
                  className={cn("w-full md:w-[200px] justify-between bg-white", !field.value && "text-muted-foreground")}
                >
                  {field.value ? jobtypes.find((job) => job.value === field.value)?.label : "Job Type"}
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
                        <Check className={cn("mr-2 h-4 w-4", job.value === field.value ? "opacity-100" : "opacity-0")} />
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
                            "w-full md:w-[200px] justify-between bg-white",
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
                            "w-full md:w-[200px] justify-between bg-white",
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
                            "w-full md:w-[200px] justify-between bg-white",
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
);

export default JobDetails;
