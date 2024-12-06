"use client";

import AuthDialog from "@/app/(auth)/AuthDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-[rgb(36,36,36)] text-white">
      <header className="border-b-2 border-white px-10 py-6">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between">
          <Link
            href="/"
            className="title-navbar-font-custom text-4xl font-bold"
          >
            Jevium
          </Link>
          <nav className="flex items-center gap-5">
            <Button
              variant="default"
              className="text-md rounded-full bg-white p-6 text-black hover:bg-white hover:text-black"
              size="lg"
              onClick={() => setOpenAuthDialog(true)}
            >
              Sign In
            </Button>
          </nav>
        </div>
      </header>
      <div className="flex-1 border-b-2 border-white px-10 pb-20">
        <div className="mx-auto mt-40 flex w-full max-w-[1500px]">
          <div className="w-full space-y-12 xl:w-1/2">
            <div className="title-navbar-font-custom text-6xl font-bold md:text-7xl">
              Everyone has a <div>story to tell</div>
            </div>

            <div className="text-2xl">
              Jevium is a home for human stories and ideas. Here, anyone can
              share knowledge and wisdom with the world—without having to build
              a mailing list or a following first. The internet is noisy and
              chaotic; Jevium is quiet yet full of insight. It’s simple,
              beautiful, collaborative, and helps you find the right readers for
              whatever you have to say.
            </div>

            <div className="text-3xl underline">
              Ultimately, our goal is to deepen our collective understanding of
              the world through the power of writing.
            </div>

            <div className="text-2xl">
              We believe that what you read and write matters. Words can divide
              or empower us, inspire or discourage us. In a world where the most
              sensational and surface-level stories often win, we’re building a
              system that rewards depth, nuance, and time well spent. A space
              for thoughtful conversation more than drive-by takes, and
              substance over packaging.
            </div>

            <div className="text-2xl">
              Over 100 million people connect and share their wisdom on Jevium
              every month. They’re software developers, amateur novelists,
              product designers, CEOs, and anyone burning with a story they need
              to get out into the world. They write about what they’re working
              on, what’s keeping them up at night, what they’ve lived through,
              and what they’ve learned that the rest of us might want to know
              too.
            </div>

            <div className="text-2xl">
              Instead of selling ads or selling your data, we’re supported by a
              growing community of over a million Jevium members who believe in
              our mission. If you’re new here, start reading. Dive deeper into
              whatever matters to you. Find a post that helps you learn
              something new, or reconsider something familiar—and then write
              your story.
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white px-10 py-5">
        <div className="mx-auto flex w-full max-w-[1400px] justify-between">
          <Link
            href="/"
            className="title-navbar-font-custom text-4xl font-bold text-[rgb(26,26,26)]"
          >
            Jevium
          </Link>
        </div>
      </footer>
      {openAuthDialog && <AuthDialog onOpenChange={setOpenAuthDialog} />}
    </div>
  );
}
