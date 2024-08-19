"use client"
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

const RegisterForm = () => {
  return (
    <TabsContent value="register" className="shadow-sm shadow-primary/30">
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription className="">
            Enter your credentials to create an account.
          </CardDescription>
        </CardHeader>
       <form action={registerWithCredentials}>
       <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="email">Email Id</Label>
            <Input id="email" name="emailId" placeholder="johndoe@gmail.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" placeholder="********" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <RegisterButton />
          <div className="text-center py-2 text-gray-500 text-sm">OR</div>
          <Button  onClick={()=>login("google")} className="w-full gap-2" variant="outline">
            <Image src={"/google.png"} width={25} height={25} alt="google" />
            <span> Register With Google</span>
          </Button>
        </CardFooter>
       </form>
      </Card>
    </TabsContent>
  );
};

export default RegisterForm;
