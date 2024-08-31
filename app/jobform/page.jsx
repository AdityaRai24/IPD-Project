"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import JobDetails from "@/components/jobformcomponents/JobDetails";
import LocationDetails from "@/components/jobformcomponents/LocationDetails";
import JobRequirements from "@/components/jobformcomponents/JobRequirements";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  jobtypes,
  jobIndustry,
  workexp,
  indianCities,
  jobSalary,
  indianStates,
  skilloptions,
} from "@/components/dataset/jobformdata.js";
import ContactInformation from "@/components/jobformcomponents/ContactInformation";

const JobFormpage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        contactName: z.string().nonempty(),
        contactPhone: z.string().nonempty(),
        contactEmail: z.string().nonempty().email(),
        jobType: z.string().nonempty(),
        industry: z.string().nonempty(),
        salary: z.string().nonempty(),
        experience: z.string().nonempty(),
        State: z.string().nonempty(),
        City: z.string().nonempty(),
        requiredskills: z.array(z.object({ label: z.string(), value: z.string() })),
        jobDescription: z.string().nonempty(),
      })
    ),
  });

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };

  return (
    <div className="w-full max-w-full mx-auto py-8 px-4 sm:px-8 lg:px-12 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-8">Post a Job</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <ContactInformation form={form} />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Job Details</h2>
            <JobDetails form={form} jobtypes={jobtypes} jobIndustry={jobIndustry} jobSalary={jobSalary} workexp={workexp} />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Location Details</h2>
            <LocationDetails form={form} indianStates={indianStates} indianCities={indianCities} />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Job Requirements</h2>
            <JobRequirements
              form={form}
              skilloptions={skilloptions}
              selectedOptions={selectedOptions}
              handleChange={handleChange}
            />
          </section>
          <div className="text-center">
            <Button
              type="submit"
              className="mt-6 px-6 py-3 w-96 hover:opacity-50 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JobFormpage;
