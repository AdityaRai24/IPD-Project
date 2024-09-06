"use client";
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";

const User = () => {
  const { data: session } = useSession();


  const imageUrl = session?.user?.image
    ? session?.user?.image
    : "https://github.com/shadcn.png";


  const handleLogout = async() => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Popover>
        <PopoverTrigger>
          <Image width={45} height={45} alt="image" src={imageUrl} className="rounded-full" />
        </PopoverTrigger>
        <PopoverContent className="">
          <div>
            <h1
              onClick={handleLogout}
              className="cursor-pointer hover:underline hover:underline-offset-2"
            >
              Logout
            </h1>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default User;
