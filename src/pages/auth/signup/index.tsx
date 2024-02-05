import { Box, Button, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, error } = api.user.register.useMutation({
    onSuccess: async () => {
      await signIn("credentials", { email, password });
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
          <Typography variant="h4">Sign Up</Typography>
          <Box className="flex flex-1 flex-col gap-4">
            <TextField
              id="email"
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!fieldErrors?.email}
              helperText={fieldErrors?.email?.join("\n ")}
            />
            <TextField
              id="password"
              label="Password"
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
            onClick={() => mutate({ email, password })}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
