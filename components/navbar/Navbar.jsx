"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import User from "./User";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  return (
    <div className="">
      <div
        className={cn(
          "flex max-w-[85%] mx-auto  justify-between items-center",
          pathname === "/" ? "p-8" : "p-3"
        )}
      >
        <div className="flex items-center gap-2">
          <Link href="/">
            <h1 className="text-2xl font-bold">
              Emplo<span className="text-primary">Ease</span>
            </h1>
          </Link>
          <div className="flex items-center gap-10 ml-8">
            <Link href="/" className="font-normal">
              Home
            </Link>
            <Link href="/about" className="font-normal">
              About
            </Link>
            <Link href="/contact" className="font-normal">
              Contact us
            </Link>
          </div>
        </div>
        <div>
          {isLoading ? (
            <>
              <div>loading...</div>
            </>
          ) : (
            <>
              {session?.user ? (
                <User />
              ) : (
                <ul className="flex gap-6">
                  <Button variant="ghost">
                    <Link href="/authenticate">Login</Link>
                  </Button>
                  <Button className="active:scale-[0.95] hover:scale-[1.05] transition duration-300 ease-in px-6 py-[20px]  rounded-full ">
                    <Link href="/authenticate">Register</Link>
                  </Button>
                </ul>
              )}
            </>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
};

export default Navbar;
