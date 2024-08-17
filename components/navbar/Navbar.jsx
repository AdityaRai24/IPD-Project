import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-between place-items-center">
      <div>
        <ul className="flex my-1 place-items-center">
          <li className=" ml-10 mr-6 font-extrabold text-2xl ">
            <Link href="/">
              <span className="text-3xl text-primary">E</span>mlpo
              <span className="text-3xl text-primary">E</span>ase
            </Link>
          </li>
          <li className="mx-6"> <Link href="/">Home</Link></li>
          <li className="mx-6"> <Link href="/about">About</Link></li>
          <li className="mx-6"> <Link href="/contact">Contact us</Link></li>
        </ul>
      </div>
      <div>
        <ul className="flex my-1">
          <li className="mx-4">
            <Button variant="outline">
              <Link href="/">Login</Link>
            </Button>
          </li>
          <li className="mx-4">
            <Button asChild>
              <Link href="/">Sign up</Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
