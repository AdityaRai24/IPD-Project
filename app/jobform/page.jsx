"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import JobDetails from "@/components/jobformcomponents/JobDetails";
import LocationDetails from "@/components/jobformcomponents/LocationDetails";
import JobRequirements from "@/components/jobformcomponents/JobRequirements";
import ContactInformation from "@/components/jobformcomponents/ContactInformation";
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
import axios from "axios";
import { useRouter } from "next/navigation";


const JobFormpage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
      const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        contactName: z.string().nonempty(),
        contactPhone: z.string().nonempty(),
        contactEmail: z.string().nonempty().email(),
        jobTitle: z.string().nonempty(),
        jobType: z.string().nonempty(),
        industry: z.string().nonempty(),
        salary: z.string().nonempty(),
        experience: z.string().nonempty(),
        State: z.string().nonempty(),
        City: z.string().nonempty(),
        requiredskills: z.array(
          z.object({ label: z.string(), value: z.string() })
        ),
        jobDescription: z.string().nonempty(),
      })
    ),
  });

  const onSubmit = async (data) => {
    const isValid = await form.trigger();

    if (isValid) {
            try {
        data.requiredskills = selectedOptions.map((skill) => skill.value);
        const response = await axios.post(
          "http://localhost:3000/api/submit-job-post",
          data
        );
        if (!response.data) {
          throw new Error("Failed to submit form");
        }
        router.push("/");
      } catch (error) {
        console.error("Error submitting form:", error);
      } 
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-8 sm:px-12 lg:px-16 bg-white shadow-2xl rounded-2xl">
      <h1 className="text-4xl font-extrabold text-center text-rose-500 mb-12">
        Post a Job
        <img
          src="/underline.svg"
          className="w-[350px] top-[150px] right-[540px] absolute"
        />
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => console.log(data))}
          className="space-y-12"
        >
          <section className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Contact Information
            </h2>
            <p className="text-gray-600 mb-6">
              Provide the contact details for this job listing. This information
              will be used to reach out to you regarding the job post.
            </p>
            <ContactInformation form={form} />
          </section>

          <section className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Job Details
            </h2>
            <p className="text-gray-600 mb-6">
              Fill in the specifics about the job role. This includes job type,
              industry, and expected salary.
            </p>
            <JobDetails
              form={form}
              jobtypes={jobtypes}
              jobIndustry={jobIndustry}
              jobSalary={jobSalary}
              workexp={workexp}
            />
          </section>

          <section className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Location Details
            </h2>
            <p className="text-gray-600 mb-6">
              Specify where the job is located, including the state and city.
            </p>
            <LocationDetails
              form={form}
              indianStates={indianStates}
              indianCities={indianCities}
            />
          </section>

          <section className="bg-gray-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Job Requirements
            </h2>
            <p className="text-gray-600 mb-6">
              List the skills and experience required for this job. This will
              help applicants understand if they're a good fit.
            </p>
            <JobRequirements
              form={form}
              skilloptions={skilloptions}
              selectedOptions={selectedOptions}
              handleChange={handleChange}
            />
          </section>

          <div className="flex justify-center">
            <Button
              type="submit"
              onClick={onSubmit}
              className="mt-10 px-10 py-4 bg-primary text-white text-lg font-bold rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              Submit Job
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JobFormpage;
