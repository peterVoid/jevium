import { useMutation } from "@tanstack/react-query";
import { updateAbout } from "./actions";

export function useUpdateAbout() {
  const mutation = useMutation({
    mutationFn: updateAbout,
  });

  return mutation;
}
