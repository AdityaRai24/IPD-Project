"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UploadImage from "@/components/uploads/UploadImage";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL"),
  companyWebsite: z.string().url("Invalid company website URL"),
  companyIndustry: z
    .string()
    .min(2, "Company industry must be at least 2 characters"),
  companyLogo: z.string().url("Please upload the company logo"),
});

const RecruiterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      phoneNumber: "",
      linkedinUrl: "",
      companyWebsite: "",
      companyIndustry: "",
      companyLogo: "",
    },
  });

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
      form.setValue("companyLogo", response.data.secure_url);
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Error uploading logo");
    } finally {
      setUploadingResume(false);
    }
  };

  if (!session && status !== "loading") {
    router.push("/authenticate");
  }

  const onSubmit = async (data) => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsSubmitting(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/submit-recruiter",
          data
        );
        if (!response.data) {
          throw new Error("Failed to submit form");
        }
        toast.success("Onboading Successful");
        console.log(response.data);
        router.push("/");
      } catch (error) {
        toast.error("Error submitting form");
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="flex min-h-screen text-[#0B1215] flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-center text-3xl font-bold tracking-normal">
        Recruiter <span className="text-primary">Onboarding</span>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Full Name"
                      {...field}
                      className="border-gray-300  rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Company Name"
                      {...field}
                      className="border-gray-300  rounded-md"
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
                      {...field}
                      className="border-gray-300  rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your LinkedIn Profile URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Company Website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Industry</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Your Company Industry"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleResumeUpload(e);
                        field.onChange(e);
                      }}                      disabled={uploadingResume}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-md"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default RecruiterPage;
