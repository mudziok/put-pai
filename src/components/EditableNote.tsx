import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState, type FC, type ReactNode } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { MobileRemove } from "~/components/MobileRemove";

interface Props {
  title: string;
  initialContent: string;
  onSave: (content: string) => void;
  additionalActions?: ReactNode;
}

export const EditableNote: FC<Props> = ({
  title,
  initialContent,
  onSave,
  additionalActions,
}) => {
  const [content, setContent] = useState(initialContent);

  const isContentChanged = initialContent !== content;

  return (
    <Box className="flex w-full max-w-[800px] flex-col gap-4 p-4">
      <Box className="flex w-full items-center justify-between">
        <Typography variant="h2">
          <Link href="/dashboard">
            <IconButton color="primary">
              <ArrowBackIcon fontSize="large" />
            </IconButton>
          </Link>
          {title}
        </Typography>
        <Box>
          {additionalActions}
          <Tooltip
            title="You have unsaved changes!"
            open={isContentChanged}
            placement="top"
          >
            <Button
              onClick={() => onSave(content)}
              sx={{ gap: 1 }}
              disabled={!isContentChanged}
            >
              <SaveIcon />
              <MobileRemove>{isContentChanged ? "Save" : "Saved"}</MobileRemove>
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Box className="w-full bg-white shadow">
        <TextField
          value={content}
          multiline
          fullWidth
          minRows={6}
          onChange={(e) => setContent(e.target.value)}
        />
      </Box>
    </Box>
  );
};
