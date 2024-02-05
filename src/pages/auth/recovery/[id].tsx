import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

export default function Recovery() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { id } = router.query;

  const { mutate, error } = api.user.changePassword.useMutation({
    onSuccess: async () => {
      await router.push("/auth/signin");
    },
  });

  const fieldErrors = error?.data?.zodError?.fieldErrors;
  const globalError =
    error?.data?.code === "FORBIDDEN" && z.string().safeParse(error?.message);
  const globalErrorText =
    globalError && globalError.success ? globalError.data : null;

  return (
    <Box className="flex flex-1 items-center justify-center bg-blue-50">
      <Box className="flex w-96 bg-white shadow">
        <Box className="flex flex-1 flex-col gap-8 p-8">
          <Typography variant="h4">Recovery</Typography>
          <Box className="flex flex-1 flex-col gap-4">
            <TextField
              id="password"
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors?.password}
              helperText={fieldErrors?.password?.join("\n ")}
            />
          </Box>
          {globalErrorText && z.string() && (
            <Typography color={"error"}>{globalErrorText}</Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={() => mutate({ password, id: id as string })}
          >
            Change password
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
