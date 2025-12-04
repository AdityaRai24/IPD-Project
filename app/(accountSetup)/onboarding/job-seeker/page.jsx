"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "react-select";
import { skilloptions } from "@/components/dataset/jobformdata";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  dob: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    })
    .max(new Date(), "Date of birth cannot be in the future"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  collegeName: z.string().min(2, "College name must be at least 2 characters"),
});

const step2Schema = z.object({
  currentJobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  currentCompany: z
    .string()
    .min(2, "Company name must be at least 2 characters"),
  desiredJobTitle: z
    .string()
    .min(2, "Desired job title must be at least 2 characters"),
  desiredSalaryRange: z
    .string()
    .regex(
      /^\d+,\d{3}\s*-\s*\d+,\d{3}$/,
      "Invalid salary range format (e.g., 600,000 - 700,000)"
    ),
  employmentType: z.enum(["part-time", "full-time", "any"], {
    required_error: "Please select an employment type",
  }),
});

const step3Schema = z.object({
  skills: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "Please select at least one skill"),
  linkedInUrl: z.string().url("Please enter a valid LinkedIn URL"),
  resumeUrl: z.string().url("Please upload a resume file"), // Changed to string for Cloudinary URL
});

const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

const JobSeekerPage = () => {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  if (!session && status !== "loading") {
    router.push("/authenticate");
  }
  ``;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      dob: undefined,
      location: "",
      collegeName: "",
      currentJobTitle: "",
      currentCompany: "",
      desiredJobTitle: "",
      desiredSalaryRange: "",
      employmentType: undefined,
      skills: [],
      linkedInUrl: "",
      resumeUrl: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    const isValid = await form.trigger();
    console.log(data)
    if (isValid) {
      setIsSubmitting(true);
      try {
        data.skills = data.skills.map((skill) => skill.value);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/submit-job-seeker`,
          data
        );
        if (!response.data) {
          throw new Error("Failed to submit form");
        }
        toast.success("Onboarding Successful");
        router.push("/");
      } catch (error) {
        toast.error("Error submitting form");
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const currentSchema =
    step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema;

  const handleNext = async () => {
    const fieldsToValidate = Object.keys(currentSchema.shape);
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 form={form} />;
      case 2:
        return <Step2 form={form} />;
      case 3:
        return <Step3 form={form} />;
      default:
        return null;
    }
  };

  const renderStepHeading = () => {
    switch (step) {
      case 1:
        return (
          <StepHeading
            title="Personal Information"
            subtitle="Enter your basic personal details."
          />
        );
      case 2:
        return (
          <StepHeading title="Work Details" subtitle="Enter work details." />
        );
      case 3:
        return (
          <StepHeading
            title="Skills and Socials"
            subtitle="Almost Done! Enter your skills and social links."
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen text-[#0B1215] flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-center text-3xl font-bold tracking-normal">
        Job Seeker <span className="text-primary">Onboarding</span>
        <img
          src="/dual-underline.svg"
          className="w-[140px] absolute right-[40%]"
          alt=""
        />
      </h1>
      <p className="text-sm text-[#5a5a5a] font-medium mt-3">
        These personal details can be always updated later.
      </p>

      <div className="w-full max-w-2xl bg-white mt-6 p-8 rounded-lg shadow-sm shadow-primary">
        <ProgressBar step={step} />
        {renderStepHeading()}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-6"
          >
            {renderStepContent()}
            <NavigationButtons
              step={step}
              onPrev={handlePrev}
              onNext={handleNext}
              isSubmitting={isSubmitting}
            />
          </form>
        </Form>
      </div>
    </main>
  );
};

const StepHeading = ({ title, subtitle }) => (
  <>
    <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
    <p className="text-sm text-[#5a5a5a] font-medium">{subtitle}</p>
  </>
);

const ProgressBar = ({ step }) => (
  <div className="flex items-center justify-between mb-6 gap-1">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className={cn(
          "w-1/3 h-[2px] rounded-md",
          step >= item ? "bg-primary" : "bg-gray-300"
        )}
      />
    ))}
  </div>
);

const NavigationButtons = ({ step, onPrev, onNext, isSubmitting }) => (
  <div className="flex items-center justify-between">
    {step > 1 && (
      <Button
        onClick={onPrev}
        type="button"
        className="btn-primary w-[30%] active:scale-[0.98] hover:scale-[1.02] transition duration-300 ease text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center"
        disabled={isSubmitting}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Prev
      </Button>
    )}
    {step === 3 ? (
      <Button
        type="submit"
        className={cn(
          "btn-primary w-[30%] active:scale-[0.98] hover:scale-[1.02] transition duration-300 ease text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center",
          step === 1 ? "w-[100%]" : ""
        )}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
        {!isSubmitting && <ChevronRight className="h-4 w-4 ml-2" />}
      </Button>
    ) : (
      <Button
        onClick={onNext}
        type="button"
        className={cn(
          "btn-primary w-[30%] text-white active:scale-[0.98] hover:scale-[1.02] transition duration-300 ease font-semibold py-2 px-4 rounded-md flex items-center justify-center",
          step === 1 ? "w-[100%]" : ""
        )}
        disabled={isSubmitting}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    )}
  </div>
);

const Step1 = ({ form }) => (
  <>
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
              className="border-gray-300 rounded-md"
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
              placeholder="Enter Your Phone Number"
              type="tel"
              {...field}
              className="border-gray-300 rounded-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="flex justify-between items-center">
      <FormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
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
        name="location"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input
                placeholder="Location"
                {...field}
                className="border-gray-300 rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
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
              className="border-gray-300 rounded-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

const Step2 = ({ form }) => (
  <div className="flex flex-col gap-4">
    <FormField
      control={form.control}
      name="currentJobTitle"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current/Most Recent Job Title</FormLabel>
          <FormControl>
            <Input
              placeholder="Software Engineer"
              {...field}
              className="border-gray-300 rounded-md"
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
          <FormLabel>Current/Most Recent Company Name </FormLabel>
          <FormControl>
            <Input
              placeholder="ABC Company"
              {...field}
              className="border-gray-300 rounded-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="desiredJobTitle"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Desired Job Title </FormLabel>
          <FormControl>
            <Input
              placeholder="Software Engineer"
              {...field}
              className="border-gray-300 rounded-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="flex items-center justify-between">
      <div className="w-[40%]">
        <FormField
          control={form.control}
          name="desiredSalaryRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Salary Range </FormLabel>
              <FormControl>
                <Input
                  placeholder="600,000 - 700,000"
                  {...field}
                  className="border-gray-300 rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="w-[40%]">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  </div>
);

const Step3 = ({ form }) => {
  const [uploadingResume, setUploadingResume] = useState(false);

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Ipd-Project");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dhgkbncpv/upload`,
        formData
      );
      form.setValue("resumeUrl", response.data.secure_url);
      form.clearErrors("resumeUrl"); 
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Error uploading resume");
      form.setError("resumeUrl", {
        type: "manual",
        message: "Failed to upload resume. Please try again.",
      });
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select your Skills</FormLabel>
            <MultiSelect
              isMulti
              value={field.value}
              onChange={field.onChange}
              options={skilloptions}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Your Skillset"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="linkedInUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.linkedin.com/in/yourprofile"
                {...field}
                className="border-gray-300 rounded-md"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    <FormField
        control={form.control}
        name="resumeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Your Resume</FormLabel>
            <FormControl>
              <Input
                id="resumeUrl"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  handleResumeUpload(e);
                  field.onChange(e);
                }}
                disabled={uploadingResume}
              />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default JobSeekerPage;
