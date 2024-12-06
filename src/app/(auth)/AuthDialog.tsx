import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GoogleButton from "./GoogleButton";

interface AuthDialogProps {
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto flex h-screen w-full max-w-[900px] items-center justify-center p-10">
        <div className="flex flex-col gap-20">
          <h1 className="title-navbar-font-custom text-3xl font-medium">
            Join Jevium.
          </h1>
          <GoogleButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
