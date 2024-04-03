import Image from "next/image";
import { question } from "../../assets";
import Link from "next/link";
import { Footer } from "@/components/ui/footer";
import Head from 'next/head'


export default function Home() {
  return (
 
    <div className="h-screen w-full flex flex-col justify-between">
 
      <div className="h-screen w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
          <div className="h-full flex items-center justify-center">
            <div className="relative h-1/2 w-1/2 flex flex-col items-center justify-center">
              <div className="backdrop-blur-sm bg-white/30 h-full w-full z-10 absolute inset-0 rounded-md border-[2px]"></div>
              <Image src={question} alt="" width={500} height={500} className="absolute z-5"/>
              <div className="relative z-30 text-center">
                <h1 className="text-4xl font-madimi_one_regular pr-[100px] pl-[100px] pt-[100px] text-wrap font-extrabold">The Best AI Powered Quiz Platform.</h1>
                <br />
                <Link href={"/form"}>
                  <button className="w-2/6 h-[60px] rounded-xl bg-blue-500 text-white text-xl border-[1px]">Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
