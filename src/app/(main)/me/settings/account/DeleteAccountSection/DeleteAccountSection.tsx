"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { deleteUser } from "./actions";

export default function DeleteAccountSection() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [deleteText, setDeleteText] = useState<string>("");

  const isDisabled = deleteText !== "delete";

  const handleClick = async () => {
    const { error } = await deleteUser();
    if (error) return;
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <div className="flex flex-col">
          <Button
            variant="link"
            className="h-auto self-start p-0 text-red-600 hover:no-underline"
          >
            Delete account
          </Button>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete your account and all of your content.
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Delete Account
          </DialogTitle>
        </DialogHeader>
        <p className="text-lg">To confirm, type {'"delete"'} below:</p>
        <Input
          type="text"
          value={deleteText}
          onChange={(e) => setDeleteText(e.target.value)}
        />
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isDisabled} onClick={handleClick}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
