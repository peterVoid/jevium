"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Notebook } from "lucide-react";
import UserDropdown from "./UserDropdown";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const makeNewStory = async () => {
    try {
      const response = await axios.post("/api/new-story");
      router.push(`/story/${response.data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="border-b-2 border-black px-10 py-3">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-9">
          <Link
            href="/"
            className="title-navbar-font-custom text-4xl font-bold"
          >
            Jevium
          </Link>
          <SearchBar />
        </div>
        <nav className="flex items-center gap-10">
          <div
            onClick={makeNewStory}
            className="flex cursor-pointer items-center gap-2 hover:text-slate-800"
          >
            <Notebook size={30} className="text-muted-foreground" />
            <h4 className="text-lg text-muted-foreground">Write</h4>
          </div>
          <Bell
            size={30}
            className="cursor-pointer text-muted-foreground hover:text-slate-700"
          />
          <UserDropdown />
        </nav>
      </div>
    </header>
  );
}
