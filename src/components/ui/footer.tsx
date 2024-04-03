import Link from "next/link"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white z-50">
      <div className="container flex flex-wrap items-center justify-center px-4 py-8 mx-auto  lg:justify-between">
        <div className="flex flex-wrap justify-center">
          <ul className="flex items-center space-x-4">
            <p>Made By ❤ Dulmina Geegange</p>
          </ul>
        </div>
        <div className="flex justify-center space-x-4 mt-4 lg:mt-0">
  
          <Link href={"https://github.com/dulmina-jayaru"}>
            <Github />
          </Link>
          <Link href={"https://www.linkedin.com/in/dulmina-geeganagee/"}>
            <Linkedin />
          </Link>
        </div>
      </div>
      <div className="pb-2">
        <p className="text-center">
          @2024 All rights reserved!
        </p>
      </div>
    </footer>
  )
}