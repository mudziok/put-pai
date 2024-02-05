import { Box, Button, CircularProgress } from "@mui/material";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { EditableNote } from "~/components/EditableNote";
import ShareIcon from "@mui/icons-material/Share";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { ShareDialog } from "~/components/ShareDialog";
import { DeleteDialog } from "~/components/DeleteDialog";
import { MobileRemove } from "~/components/MobileRemove";
import { RenameDialog } from "~/components/RenameDialog";

const Edit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const context = api.useContext();

  const { data } = api.notes.byId.useQuery({ id: id as string });
  const updateMutation = api.notes.save.useMutation({
    onSuccess: async () => {
      await context.notes.byId.invalidate({ id: id as string });
    },
  });
  const deleteMutation = api.notes.delete.useMutation({
    onSuccess: async () => {
      await context.notes.all.invalidate({ search: "" });
      await router.push("/dashboard");
    },
  });

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Edit</title>
        <meta name="description" content="Edit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 justify-center bg-blue-50 pt-32">
        {data ? (
          <>
            <EditableNote
              title={data.title}
              initialContent={data.content}
              onSave={(content) =>
                updateMutation.mutate({ id: data.id, content })
              }
              additionalActions={
                <>
                  <Button
                    color="warning"
                    sx={{ gap: 1 }}
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <DeleteIcon />
                    <MobileRemove>delete</MobileRemove>
                  </Button>
                  <Button
                    sx={{ gap: 1 }}
                    onClick={() => setIsRenameDialogOpen(true)}
                  >
                    <DriveFileRenameOutlineIcon />
                    <MobileRemove>rename</MobileRemove>
                  </Button>
                  <Button
                    sx={{ gap: 1 }}
                    onClick={() => setIsShareDialogOpen(true)}
                  >
                    <ShareIcon />
                    <MobileRemove>Share</MobileRemove>
                  </Button>
                </>
              }
            />
            <ShareDialog
              open={isShareDialogOpen}
              onClose={() => setIsShareDialogOpen(false)}
              id={data.id}
            />
            <DeleteDialog
              open={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              onDelete={() => deleteMutation.mutate({ id: data.id })}
            />
            <RenameDialog
              id={data.id}
              open={isRenameDialogOpen}
              onClose={() => setIsRenameDialogOpen(false)}
            />
          </>
        ) : (
          <CircularProgress />
        )}
      </main>
    </>
  );
};

export default Edit;
