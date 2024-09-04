import { Button } from "@/components/ui/button";
import Link from "next/link";
import { poppins } from "@/utils/fonts";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <>
      <div className=" h-full">
        <div className="flex items-center justify-center w-full h-[80vh]">
          <div className="flex items-center w-[65%] ">
            <div>
              <h1 className="text-7xl font-semibold text-center text-[#0B1215] tracking-normal leading-[1.15]">
                Hiring made<span className="text-primary/90"> intelligent</span>{" "}
                <img
                  src="/underline.svg"
                  className="w-[350px] top-[295px] right-96 absolute"
                />
                for modern businesses.
              </h1>
              <p className="max-w-[70%] text-[#0B1215] text-lg mt-4 block mx-auto text-center">
                Most recruitment processes are time-consuming and inefficient.
                We use AI to streamline hiring, helping you find the best talent
                efficiently
              </p>
              <div className="mt-8 flex items-center gap-4 justify-center">
                <Link href={"/authenticate"}>
                  <Button className="active:scale-[0.95] hover:scale-[1.05] transition duration-300 ease-in px-10 py-[26px] rounded-full ">
                    Get Started
                  </Button>
                </Link>
                <Link href={"/authenticate"}>
                  <Button
                    className="active:scale-[0.95] hover:scale-[1.05] transition duration-300 ease-in px-10 py-[26px] rounded-full "
                    variant="outline"
                  >
                    Login Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
