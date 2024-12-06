import Navbar from "@/app/(main)/Navbar";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth";
import { ArrowUpRight } from "lucide-react";
import UsernameSection from "./UsernameSection";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserDataSelect } from "@/lib/types";
import ProfileInformationSection from "./ProfileInformationSection/ProfileInformationSection";
import DeleteAccountSection from "./DeleteAccountSection/DeleteAccountSection";

const getCurrentUserData = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: UserDataSelect,
  });

  if (!user) return;

  return user;
};

export default async function SettingsPage() {
  const { user } = await validateRequest();

  if (!user) return notFound();

  const currentUserData = await getCurrentUserData(user.id);

  if (!currentUserData) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-[1000px] px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        {/* Navigation */}
        <nav className="mb-12 border-b">
          <div className="flex flex-wrap gap-6">
            <Button
              variant="link"
              className="h-auto px-0 py-3 font-medium text-foreground hover:no-underline"
            >
              Account
            </Button>
          </div>
        </nav>

        {/* Settings Content */}
        <div className="space-y-8">
          {/* Email */}
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-base font-medium">Email address</h2>
              <p className="text-muted-foreground">
                haikalpraseya.alhakim12@gm...
              </p>
            </div>
          </div>

          {/* Username */}
          <UsernameSection currentUsername={currentUserData?.username} />

          {/* Profile Information */}
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-base font-medium">Profile information</h2>
              <p className="text-muted-foreground">
                Edit your photo, name, pronouns, short bio, etc.
              </p>
            </div>
            <ProfileInformationSection userData={currentUserData} />
          </div>

          {/* Account Actions */}
          <div className="space-y-6 border-t pt-8">
            <DeleteAccountSection />
          </div>
        </div>
      </main>
    </div>
  );
}
