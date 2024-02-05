import { Box, Button, Typography } from "@mui/material";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notes</title>
        <meta name="description" content="Notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 items-center justify-center bg-blue-50">
        <Box className="flex flex-col gap-8 bg-white p-8 shadow md:flex-row">
          <Box className="flex w-96 flex-col gap-4">
            <Typography variant="h2">Your notes, simple</Typography>
            <Typography>
              Organize your thoughts with our simple and intuitive note-taking
              app.
            </Typography>
          </Box>
          {/* <hr className=" w-0 border-blue-100" /> */}
          <Box className="flex w-40 flex-col items-stretch justify-center gap-4">
            <Button variant="contained" onClick={() => void signIn()} fullWidth>
              Sign in
            </Button>
            <Link href="/auth/signup" className="w-full">
              <Button variant="outlined" className="w-full" fullWidth>
                Sign up
              </Button>
            </Link>
          </Box>
        </Box>
      </main>
    </>
  );
};

export default Home;
