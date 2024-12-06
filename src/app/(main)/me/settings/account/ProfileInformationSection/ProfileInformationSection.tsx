"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import UserAvatar from "@/components/UserAvatar";
import { pronounsOptions } from "@/lib/selectOptions";
import { UserData } from "@/lib/types";
import {
  updateUserInformationSchema,
  updateUserInformationValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { useUpdateProfileInformation } from "./mutations";
import ImageSection from "./ImageSection";

interface ProfileInformationSection {
  userData: UserData;
}

export default function ProfileInformationSection({
  userData,
}: ProfileInformationSection) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedPronouns, setSelectedPronouns] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<updateUserInformationValues>({
    resolver: zodResolver(updateUserInformationSchema),
    defaultValues: {
      name: userData.displayName,
      pronouns: [],
      shortBio: userData.shortBio || "",
    },
  });

  const nameValue = form.watch("name");
  const shortBioValue = form.watch("shortBio");

  const { mutate } = useUpdateProfileInformation();

  const onSubmit = (values: updateUserInformationValues) => {
    mutate(
      {
        values: {
          name: values.name,
          pronouns: selectedPronouns,
          shortBio: values.shortBio,
        },
        ...(avatarFile && {
          profilePic: new File([avatarFile], `avatar_${userData.id}.png`),
        }),
      },
      {
        onSuccess: () => {
          console.log("success");
          setOpenDialog(false);
        },
        onError: () => {
          console.log("error");
        },
      },
    );
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <div
          className="flex items-center gap-2"
          onClick={() => setOpenDialog(true)}
        >
          <span>{userData.displayName}</span>
          <UserAvatar src={userData.avatar!} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Profile Information
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <ImageSection
            currentAvatar={userData.avatar}
            setAvatarFile={setAvatarFile}
          />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex items-center rounded-sm bg-slate-100 p-2">
                        <input
                          className="w-full bg-transparent focus:outline-none"
                          {...field}
                        />
                      </div>
                      <span className="self-end text-sm text-muted-foreground">
                        {nameValue.length}/50
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pronouns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pronouns</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-4">
                      <Select
                        isMulti
                        onChange={(selectedValues) => {
                          const values = selectedValues as {
                            value: string;
                            label: string;
                          }[];

                          const stringValue = values.map(
                            (value) => value.value,
                          );

                          setSelectedPronouns(stringValue);
                        }}
                        isOptionDisabled={() => selectedPronouns.length >= 4}
                        name="topics"
                        options={pronounsOptions}
                        className="basic-multi-select"
                      />
                      <span className="self-end text-sm text-muted-foreground">
                        {selectedPronouns?.length || 0}/4
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex items-center rounded-sm bg-slate-100 p-2">
                        <Textarea
                          className="w-full resize-none border-none bg-transparent"
                          {...field}
                        />
                      </div>
                      <span className="self-end text-sm text-muted-foreground">
                        {shortBioValue?.length}/160
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
