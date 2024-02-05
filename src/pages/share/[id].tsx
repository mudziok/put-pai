import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Edit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = api.notes.byId.useQuery({ id: id as string });

  return (
    <>
      <Head>
        <title>Share</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 justify-center bg-blue-50 pt-32">
        {data ? (
          <Box className="flex w-full max-w-[800px] flex-col gap-4 p-4">
            <Box className="flex w-full items-end justify-between">
              <Typography variant="h2">{data.title}</Typography>
              <Typography variant="subtitle1">
                shared by {data.user.email}
              </Typography>
            </Box>
            <Box className="w-full bg-white shadow">
              <TextField
                value={data.content}
                multiline
                fullWidth
                minRows={6}
                sx={{ ":disabled": { color: "black" } }}
              />
            </Box>
          </Box>
        ) : (
          <CircularProgress />
        )}
      </main>
    </>
  );
};

export default Edit;
