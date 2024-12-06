"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import AuthDialog from "../(auth)/AuthDialog";
import Image from "next/image";
import heroImage from "@/app/assets/heroImage.png";

export default function LandingPage() {
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  return (
    <main className="flex h-screen w-screen flex-col">
      <header className="border-b-2 border-black px-10 py-6">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          <Link
            href="/"
            className="title-navbar-font-custom text-4xl font-bold"
          >
            Jevium
          </Link>
          <nav className="flex items-center gap-5">
            <Button variant="link" className="text-md hidden lg:block" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
            <Button
              variant="link"
              className="text-md hidden md:block"
              onClick={() => setOpenAuthDialog(true)}
            >
              Sign In
            </Button>
            <Button
              className="text-md rounded-xl py-6"
              onClick={() => setOpenAuthDialog(true)}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>
      <section className="relative flex-1 border-b-2 border-black px-10">
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center gap-9">
          <div className="flex flex-col gap-10">
            <div className="title-navbar-font-custom text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
              Human <div> Stories & ideas </div>
            </div>
            <span className="text-lg font-medium md:text-xl lg:text-2xl">
              A Place to read,write,and deepen your understanding
            </span>
            <Button
              className="w-fit rounded-full p-8 text-2xl"
              size="lg"
              onClick={() => setOpenAuthDialog(true)}
            >
              Start Reading
            </Button>
          </div>
          <div className="hidden justify-end lg:block">
            <Image
              src={heroImage}
              alt="Hero Image"
              width={600}
              height={600}
              className="absolute right-0 top-2"
            />
          </div>
        </div>
      </section>
      <footer className="px-10 py-5">
        <div className="mx-auto flex w-full max-w-[1400px] justify-center">
          <h5 className="text-md text-muted-foreground">Copyright @2024</h5>
        </div>
      </footer>
      {openAuthDialog && <AuthDialog onOpenChange={setOpenAuthDialog} />}
    </main>
  );
}
