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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface Props {
  open: boolean;
  onClose: () => void;
  id: string;
}

export function ShareDialog(props: Props) {
  const { onClose, open } = props;
  const { palette } = useTheme();

  const link = `${window.location.origin}/share/${props.id}`;

  return (
    <Dialog
      onClose={() => onClose()}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderTop: `0.5rem ${palette.primary.main} solid`,
          minWidth: "40vw",
        },
      }}
    >
      <DialogTitle>Share a Note</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <DialogContentText>
          You can share this link with anyone.
        </DialogContentText>
        <TextField
          id="title"
          label="Share link"
          type="text"
          fullWidth
          value={link}
        />
        <DialogActions sx={{ gap: 1 }}>
          <Button onClick={() => onClose()} color="warning">
            Close
          </Button>
          <a target="_blank" href={link} rel="noopener noreferrer">
            <Button sx={{ gap: 1 }} variant="outlined">
              <OpenInNewIcon />
              Open in a new tab
            </Button>
          </a>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
