import { validateRequest } from "@/lib/auth";
import LandingPage from "./LandingPage";
import { SessionContextProvider } from "../SessionProvider";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  if (!session.user) {
    return <LandingPage />;
  }

  return (
    <SessionContextProvider value={session}>
      <div>{children}</div>
    </SessionContextProvider>
  );
}
