import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { TransitionGroup } from "react-transition-group";
import AddIcon from "@mui/icons-material/Add";
import { NewNoteDialog } from "~/components/NewNoteDialog";
import { type FC, useState } from "react";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signOut } from "next-auth/react";
import { MobileRemove } from "~/components/MobileRemove";

interface DashboardItemProps {
  title: string;
  content: string;
  id: string;
  tags: Array<string>;
}

const DashboardItem: FC<DashboardItemProps> = ({
  title,
  content,
  id,
  tags,
}) => {
  return (
    <Link
      href={`/edit/${id}`}
      className="flex  overflow-hidden bg-white p-2 text-black no-underline shadow transition-all hover:shadow-lg"
    >
      <Box className="flex h-32 flex-1 flex-col">
        <Typography variant="h5">{title}</Typography>
        <Typography className="my-2 flex-1 overflow-hidden">
          {content}
        </Typography>
        <Box className="flex justify-start gap-2">
          {tags.map((tag) => (
            <Typography
              key={tag}
              className="rounded-full p-1 outline outline-slate-300"
            >
              {tag}
            </Typography>
          ))}
        </Box>
      </Box>
    </Link>
  );
};

const Dashboard: NextPage = () => {
  const [search, setSearch] = useState("");
  const { data } = api.notes.all.useQuery(
    { search },
    { keepPreviousData: true }
  );
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 justify-center bg-blue-50 pt-32">
        <Box className="flex w-full max-w-[800px] flex-col gap-4 p-4">
          <Box className="flex w-full items-center justify-between">
            <Typography variant="h2">Your notes</Typography>
            <Box className="flex items-center justify-center">
              <Button
                color="error"
                onClick={() => void signOut({ callbackUrl: "/" })}
                sx={{ gap: 1 }}
              >
                <LogoutIcon />
                <MobileRemove>Logout</MobileRemove>
              </Button>
              <Button onClick={() => setIsNewDialogOpen(true)} sx={{ gap: 1 }}>
                <AddIcon />
                <MobileRemove>Add note</MobileRemove>
              </Button>
            </Box>
          </Box>
          <Box className="bg-white shadow">
            <Input
              fullWidth
              sx={{ p: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </Box>
          {data && (
            <Box className="flex justify-start gap-2">
              {data.tags.map((tag) => (
                <Typography
                  key={tag}
                  className="cursor-pointer rounded-full bg-white p-1 shadow outline outline-slate-300 transition-all hover:shadow-lg"
                  onClick={() => setSearch(tag)}
                >
                  {tag}
                </Typography>
              ))}
            </Box>
          )}
          {data ? (
            <Box className="flex-wrap4 flex w-full flex-col">
              <TransitionGroup>
                {data.notes.map((item) => (
                  <Collapse key={item.id} sx={{ mb: 2 }}>
                    <DashboardItem {...item} />
                  </Collapse>
                ))}
              </TransitionGroup>
            </Box>
          ) : (
            <Box className="flex flex-1 items-center justify-center">
              <CircularProgress />
            </Box>
          )}
        </Box>
      </main>
      <NewNoteDialog
        open={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />
    </>
  );
};

export default Dashboard;
