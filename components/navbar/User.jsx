"use client";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";
import { Button } from "../ui/button";

const User = () => {
  const { data: session } = useSession();

  return (
    <div>
      <span>{session?.user?.email}</span>
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};

export default User;