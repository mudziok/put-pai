import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";

export default function Recovery() {
  const [email, setEmail] = useState("");

  const { mutate, data } = api.user.generateRecovery.useMutation();

  return (
    <Box className="flex flex-1 items-center justify-center bg-blue-50">
      <Box className="flex w-96 bg-white shadow">
        <Box className="flex flex-1 flex-col gap-8 p-8">
          {!data ? (
            <>
              <Typography variant="h4">Forgot password?</Typography>
              <Box className="flex flex-1 flex-col gap-4">
                <TextField
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                onClick={() => mutate({ email })}
              >
                Send recovery link
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h4">
                Recovery email has been sent!
              </Typography>
              <Typography>{`Recovery email containing a link to recover your account has been sent (not really)! For the ease of presentation it is displayed below`}</Typography>

              <Link href={`/auth/recovery/${data.id}`}>
                <Button fullWidth>Take me to recovery</Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
