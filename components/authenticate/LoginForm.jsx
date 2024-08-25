"use client"
import { useState } from "react";
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

const LoginForm = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData) => {
    setError(""); // Clear previous errors
    const result = await loginWithCredentials(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh(); // Refresh the page to update the session
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
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="********" required />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
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