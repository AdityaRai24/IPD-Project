"use client"
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
import LoginButton from "../buttons/LoginButton";
import { loginWithCredentials, login } from "@/actions/auth";
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  emailId: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const LoginForm = () => {
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = (formData) => {
    try {
      loginSchema.parse({
        emailId: formData.get("emailId"),
        password: formData.get("password"),
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

    const result = await loginWithCredentials(formData);
    if (result?.error) {
      setErrors({ form: result.error });
    } else {
      router.refresh(); 
    }
  };

  return (
    <TabsContent value="login" className="shadow-sm shadow-primary/30">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription className="">
            If you already have an account enter your Email Id and Password to
            login.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email Id</Label>
              <Input id="email" name="emailId" placeholder="johndoe@gmail.com" required />
              {errors.emailId && <div className="text-red-500 text-sm">{errors.emailId}</div>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="********" required />
              {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
            </div>
            {errors.form && <div className="text-red-500 text-sm">{errors.form}</div>}
          </CardContent>
          <CardFooter className="flex flex-col">
            <LoginButton />
            <div className="text-center py-2 text-gray-500 text-sm">OR</div>
            <Button type="button" onClick={() => login("google")} className="w-full gap-2" variant="outline">
              <Image src={"/google.png"} width={25} height={25} alt="google" />
              <span> Login With Google</span>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  );
};

export default LoginForm;