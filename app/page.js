import { Button } from "@/components/ui/button";
import Link from "next/link";
import { montserrat } from "@/utils/fonts";


export default function Home() {
  return (
    <>
      <div className="bg-secondary h-full">
        <div className=" text-white h-[500px]  w-[900px] flex">
          <div className="flex items-center pl-11 ">
            <div >
              <h1 className={`${montserrat.className} text-black text-5xl leading-12`}>Empowering your journey with the depth of our experience</h1>
              <div className="mt-2">
                <Button className="h-12 "><Link href="/authenticate">Get Started!</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
