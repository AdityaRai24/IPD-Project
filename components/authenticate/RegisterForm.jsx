"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import Image from "next/image";
import { login, registerWithCredentials } from "@/actions/auth";
import RegisterButton from "../buttons/RegisterButton";
import { redirect, useRouter } from "next/navigation";

const registerSchema = z.object({
  emailId: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  cpassword: z.string()
}).refine((data) => data.password === data.cpassword, {
  message: "Passwords don't match",
  path: ["cpassword"],
});

const RegisterForm = () => {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = (formData) => {
    try {
      registerSchema.parse({
        emailId: formData.get("emailId"),
        password: formData.get("password"),
        cpassword: formData.get("cpassword")
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (formData) => {
    setErrors({});
    
    if (!validateForm(formData)) {
      return;
    }

    const result = await registerWithCredentials(formData);
    if (result?.error) {
      setErrors({ form: result.error });
    } else {
      console.log("Registration success");
      window.location.href = "/roadmap";
    }
  };

  return (
    <TabsContent value="register" className="shadow-sm shadow-primary/30">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your credentials to create an account.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email Id</Label>
              <Input
                id="email"
                name="emailId"
                placeholder="johndoe@gmail.com"
                required
              />
              {errors.emailId && <div className="text-red-500 text-sm">{errors.emailId}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                required
              />
              {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input
                id="cpassword"
                type="password"
                name="cpassword"
                placeholder="********"
                required
              />
              {errors.cpassword && <div className="text-red-500 text-sm">{errors.cpassword}</div>}
            </div>
            {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <RegisterButton />
            <div className="text-center py-2 text-gray-500 text-sm">OR</div>
            <Button
              onClick={() => login("google",true)}
              className="w-full gap-2"
              variant="outline"
            >
              <Image src="/google.png" width={25} height={25} alt="google" />
              <span> Register With Google</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};

export default RegisterForm;