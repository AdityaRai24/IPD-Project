"use client"
import React from "react";
import {useFormStatus} from "react-dom"
import { Button } from "../ui/button";

const LoginButton = () => {

    const {pending} = useFormStatus()

  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
};

export default LoginButton;
