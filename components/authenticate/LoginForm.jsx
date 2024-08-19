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
import LoginButton from "../buttons/LoginButton";
import { loginWithCredentials } from "@/actions/auth";

const LoginForm = () => {
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
        <form action={async (formData)=>{
          const {msg} = await loginWithCredentials(formData)
          if(msg){
            console.log(msg)

          }
        }}>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email Id</Label>
              <Input id="email" name="email" placeholder="johndoe@gmail.com" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="********" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <LoginButton />
            <div className="text-center py-2 text-gray-500 text-sm">OR</div>
            <Button type="button" className="w-full gap-2" variant="outline">
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
