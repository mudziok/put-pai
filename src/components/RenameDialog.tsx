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
  id: string;
}

const titleSchema = z.string().min(1);

export function RenameDialog(props: SimpleDialogProps) {
  const { onClose, open, id } = props;
  const [title, setTitle] = useState("");
  const { palette } = useTheme();
  const router = useRouter();

  const context = api.useContext();

  const { mutate, isLoading } = api.notes.rename.useMutation({
    onSuccess: async () => {
      await context.notes.byId.invalidate({ id });
      await context.notes.all.invalidate({ search: "" });
      onClose();
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
      <DialogTitle>Rename Note</DialogTitle>
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
            onClick={() => mutate({ id, title })}
          >
            Rename
          </LoadingButton>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
