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
  jobSalary,
  skilloptions,
} from "@/components/dataset/jobformdata.js";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  contactName: z.string().min(1),
  contactEmail: z.string().min(1).email(),
  jobTitle: z.string().min(1),
  jobType: z.string().min(1),
  industry: z.string().min(1),
  salary: z.number().min(1),
  experience: z.number().min(1),
  isRemote: z.boolean(),
  state: z.string().optional(),
  city: z.string().optional(),
  requiredSkills: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(1, "Select at least 1 skill"),
  jobDescription: z.string(),
}).refine((data) => {
  if (!data.isRemote) {
    return data.state && data.city;
  }
  return true;
}, {
  message: "Either select Remote Work or provide both State and City",
  path: ["isRemote", "state", "city"],
});


const JobFormpage = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [htmlcontent, sethtmlcontent] = useState("");
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: "",
      contactEmail: "",
      jobTitle: "",
      jobType: "",
      industry: "",
      salary: "",
      experience: "",
      state: "",
      city: "",
      requiredSkills: [],
      jobDescription: "",
    },
  });

  const onSubmit = async (data) => {
    const isValid = await form.trigger();

    if (isValid) {
      try {
        setSubmitting(true)
        data.requiredSkills = selectedOptions.map((skill) => skill.value);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/submit-job-post`,
          data
        );
        console.log(response)
        setSubmitting(false)
        toast.success("Job Posted Successfully");
        if (!response.data) {
          setSubmitting(false)
          toast.error("Failed to submit form");
          throw new Error("Failed to submit form");
        }
        router.push("/");
      } catch (error) {
        setSubmitting(false)
        console.error("Error submitting form:", error);
      }
    }
  };

  const handleoptionChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
    form.setValue("requiredSkills", selectedOption);
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
          className="w-[100px] top-34 right-[760px] absolute"
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
              <Button className="w-1/3 text-md py-6" disabled={submitting}>{submitting ? "Submitting..." : "Submit"} {submitting && <Loader2 className="w-5 h-5 animate-spin"/>}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobFormpage;
