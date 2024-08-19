"use client"
import React from "react";
import {useFormStatus} from "react-dom"
import { Button } from "../ui/button";

const RegisterButton = () => {

    const {pending} = useFormStatus()

  return (
    <Button disabled={pending} type="submit" className="w-full">
      {pending ? "Registering..." : "Register"}
    </Button>
  );
};

export default RegisterButton;
