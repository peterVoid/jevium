import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserInformation } from "./actions";
import { updateUserInformationValues } from "@/lib/validation";
import { useUploadThing } from "@/lib/uploadthing";

export function useUpdateProfileInformation() {
  const router = useRouter();

  const { startUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      profilePic,
    }: {
      values: updateUserInformationValues;
      profilePic?: File;
    }) => {
      return Promise.all([
        updateUserInformation({
          displayName: values.name,
          pronouns: values.pronouns,
          shortBio: values.shortBio,
        }),
        profilePic && startUpload([profilePic]),
      ]);
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return mutation;
}
