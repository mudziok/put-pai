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
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteDialog(props: Props) {
  const { onClose, open, onDelete } = props;
  const { palette } = useTheme();
  const router = useRouter();

  return (
    <Dialog
      onClose={() => onClose()}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderTop: `0.5rem ${palette.warning.main} solid`,
          minWidth: "40vw",
        },
      }}
    >
      <DialogTitle>Delete Note</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          Are you sure you want to delete this note?
        </DialogContentText>

        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={() => onClose()}>Close</Button>
          <Button
            sx={{ gap: 1 }}
            variant="contained"
            color="warning"
            onClick={() => onDelete()}
          >
            <DeleteIcon />
            Delete
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
