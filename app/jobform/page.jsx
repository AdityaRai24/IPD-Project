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

const formSchema = z.object({
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
  requiredskills: z.array(z.object({ label: z.string(), value: z.string() })),
  jobDescription: z.string(),
});

const JobFormpage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [htmlcontent, sethtmlcontent] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      jobTitle: "",
      jobType: jobtypes[0].value,
      industry: jobIndustry[0].value,
      salary: jobSalary[0].value,
      experience: workexp[0].value,
      State: indianStates[0].value,
      City: indianCities[0].value,
      requiredskills: [],
      jobDescription: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(htmlcontent);
    console.log("Form submitted with data:", data);

    // const isValid = await form.trigger();

    // if (isValid) {
    //         try {
    //     data.requiredskills = selectedOptions.map((skill) => skill.value);
    //     const response = await axios.post(
    //       "http://localhost:3000/api/submit-job-post",
    //       data
    //     )
    //     console.log("done");
    //     if (!response.data) {
    //       throw new Error("Failed to submit form");
    //     }
    //     router.push("/");
    //   } catch (error) {
    //     console.error("Error submitting form:", error);
    //   }
    // }
  };

  const handleoptionChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    form.setValue("requiredskills", selectedOption);
  };

  const handleEditorSave = (html) => {
    sethtmlcontent(html);
    form.setValue("jobDescription", html);
  };

  return (
    <div className="w-full bg-background">
      <h1 className="text-4xl tracking-normal font-bold text-center py-8">
        Post a <span className="text-primary">Job</span>
        <img
          src="/dual-underline.svg"
          className="w-[100px] top-34 right-[660px] absolute"
        />
      </h1>
      <div className="max-w-5xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <section className="bg-white p-8 rounded-lg shadow-sm shadow-primary">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-6">
                Provide the contact details for this job listing. This
                information will be used to reach out to you regarding the job
                post.
              </p>
              <ContactInformation form={form} />
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm shadow-primary">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                Job Details
              </h2>
              <p className="text-gray-600 mb-6">
                Fill in the specifics about the job role. This includes job
                type, industry, and expected salary.
              </p>
              <JobDetails
                form={form}
                jobtypes={jobtypes}
                jobIndustry={jobIndustry}
                jobSalary={jobSalary}
                workexp={workexp}
              />
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm shadow-primary">
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

            <section className="bg-white p-8 rounded-lg shadow-sm shadow-primary">
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
                handleoptionChange={handleoptionChange}
                handleEditorSave={handleEditorSave}
              />
            </section>


            <div className="pb-12">
              <Button className="w-1/3 text-md py-6">Post Job</Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobFormpage;
