import { useMutation } from "@tanstack/react-query";
import { updateUsername } from "./actions";
import { useRouter } from "next/navigation";

export function useUpdateUsername() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      router.refresh();
    },
  });

  return mutation;
}
