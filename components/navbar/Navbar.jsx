"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import User from "./User";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Navbar = () => {
  const { data: session, status } = useSession();
  console.log(session,status)
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (status === "unauthenticated" && session) {
      signIn("credentials"); // Re-fetch session data if not authenticated
    }
  }, [status, session]);

  return (
    <div className="border-b border-primary/30">
      <div className="flex max-w-[95%] mx-auto flex-row my-2 justify-between place-items-center">
        <div>
          <ul className="flex place-items-center">
            <li className=" ml-10 mr-6 font-extrabold text-2xl ">
              <Link href="/">
                <span className="text-3xl text-primary">E</span>mlpo
                <span className="text-3xl text-primary">E</span>ase
              </Link>
            </li>
            <div className="flex items-center gap-10 ml-8">
              <Button variant="link" className="h-12 text-[17px]">
                <Link href="/" className="font-semibold">
                  Home
                </Link>
              </Button>

              <Button variant="link" className="h-12 text-[17px]">
                <Link href="/about" className="font-semibold">
                  About
                </Link>
              </Button>

              <Button variant="link" className="h-12 text-[17px]">
                <Link href="/contact" className="font-semibold">
                  Contact us
                </Link>
              </Button>
            </div>
          </ul>
        </div>
        <div>
          {session?.user ? (
            <User />
          ) : (
            <ul className="flex gap-6">
              <Button variant="outline">
                <Link href="/authenticate">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/authenticate">Register</Link>
              </Button>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
