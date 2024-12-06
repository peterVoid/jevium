"use client";

import { logout } from "./actions";

export default function SignOutUserDropdown() {
  const handleClick = async () => {
    const { error } = await logout();
    if (error) return;
  };

  return (
    <div className="px-3 text-muted-foreground hover:text-slate-700">
      <button onClick={handleClick}>Sign out</button>
    </div>
  );
}
