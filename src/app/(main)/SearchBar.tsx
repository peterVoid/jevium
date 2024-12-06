import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="hidden items-center gap-5 rounded-full bg-slate-100 p-3 md:flex">
      <SearchIcon />
      <form>
        <input
          type="text"
          className="bg-transparent focus:outline-none"
          placeholder="Search"
        />
      </form>
    </div>
  );
}
