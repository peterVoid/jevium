"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUsernameSchema, updateUsernameValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdateUsername } from "./mutations";

interface UsernameSectionProps {
  currentUsername: string;
}

export default function UsernameSection({
  currentUsername,
}: UsernameSectionProps) {
  const form = useForm<updateUsernameValues>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: currentUsername,
    },
  });

  const username = form.watch("username");

  const { mutate } = useUpdateUsername();

  const onSubmit = (values: updateUsernameValues) => {
    mutate(values);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center justify-between py-2">
          <div>
            <h2 className="text-base font-medium">Username</h2>
            <p className="text-left text-muted-foreground">
              @{currentUsername}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Username</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex items-center rounded-sm bg-slate-100 p-2">
                      <span className="text-sm text-muted-foreground">@</span>
                      <input
                        className="w-full bg-transparent focus:outline-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-muted-foreground">
                jevium.com/@{username}
              </span>
              <span>{username.length}/30</span>
            </div>
            <div className="ml-auto flex gap-3">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
