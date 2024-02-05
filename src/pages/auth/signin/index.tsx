import { Box, Button, TextField, Typography } from "@mui/material";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import Link from "next/link";

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Box className="flex flex-1 items-center justify-center bg-blue-50">
      <Box className="flex w-96 border border-blue-100 bg-white shadow">
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="flex flex-1 flex-col gap-4 p-8"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Typography variant="h4">Sign In</Typography>
          <TextField id="email" label="Email" name="email" type="email" />
          <TextField
            id="password"
            label="Password"
            name="password"
            type="password"
          />
          <Button type="submit" variant="contained">
            Sign in
          </Button>
          <Link href="/auth/forgot" className="w-full">
            <Button fullWidth>Forgot your password?</Button>
          </Link>
        </form>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
