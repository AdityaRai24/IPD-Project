import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import User from "./User";

const Navbar = async () => {
  const session = await auth();

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
              <li>
                {" "}
                <Link href="/">Home</Link>
              </li>
              <li>
                {" "}
                <Link href="/about">About</Link>
              </li>
              <li>
                {" "}
                <Link href="/contact">Contact us</Link>
              </li>
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
