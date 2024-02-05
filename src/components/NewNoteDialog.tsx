import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { api } from "~/utils/api";
import { LoadingButton } from "@mui/lab";
import { z } from "zod";
import { useRouter } from "next/router";

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const titleSchema = z.string().min(1);

export function NewNoteDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
  const [title, setTitle] = useState("");
  const { palette } = useTheme();
  const router = useRouter();

  const { isLoading, mutate } = api.notes.create.useMutation({
    onSuccess: async (item) => {
      await router.push(`/edit/${item.id}`);
    },
  });
  const availableQuery = api.notes.availableName.useQuery({ title });

  const validTitle = titleSchema.safeParse(title).success;

  let error: string | null = null;

  if (availableQuery.isLoading) {
    error = `Loading...`;
  }

  if (availableQuery.data === false) {
    error = `You already have a note with a title "${title}"`;
  }

  if (!validTitle) {
    error = "Title must be at least 1 character long";
  }

  return (
    <Dialog
      onClose={() => onClose()}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderTop: `0.5rem ${palette.primary.main} solid`,
          minWidth: "30vw",
        },
      }}
    >
      <DialogTitle>New Note</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Make sure to choose a title that is easy to remember and unique.
        </DialogContentText>
        <TextField
          autoFocus
          id="title"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!error}
          helperText={error || " "}
        />
        <DialogActions>
          <Button onClick={() => onClose()} color="warning">
            Cancel
          </Button>
          <LoadingButton
            loading={isLoading}
            disabled={!!error}
            variant="contained"
            onClick={() => mutate({ title })}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
