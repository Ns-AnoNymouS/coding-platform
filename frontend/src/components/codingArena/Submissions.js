import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Modal, Button, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { customStyles } from "../../constants/customStyles";

const Submissions = ({ submissions }) => {
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState("");

  // Updated function to parse JSON data
  const parseSubmission = (submission) => {
    return {
      code: submission.code,
      verdict: submission.verdict,
      language: submission.language,
      submittedAt: new Date(submission.submittedAt).toLocaleString(), // Format date
    };
  };

  const handleOpen = (code) => {
    setCurrentCode(code); 
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {submissions.length > 0 ? (
        submissions.map((submission, index) => {
          const parsed = parseSubmission(submission);
          return (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: 2,
                marginBottom: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  Submitted At: {parsed.submittedAt}
                </Typography>
                <Divider sx={{ marginBottom: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleOpen(parsed.code)}
                >
                  Verdict: {parsed.verdict}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Language: {parsed.language}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  paddingLeft: 1.5,
                  borderLeft: "1px solid #ddd",
                }}
              >
              </Box>
            </Paper>
          );
        })
      ) : (
        <Typography variant="body1">No submissions available.</Typography>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="code-modal-title"
        aria-describedby="code-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography id="code-modal-title" variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              Submission Code
            </Typography>
            <IconButton 
              onClick={copyToClipboard} 
              sx={{ color: "blue" }}
              aria-label="copy to clipboard"
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Typography id="code-modal-description" variant="body1">
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {currentCode}
            </pre>
          </Typography>
          <Button
            sx={{ ...customStyles.control, marginTop: 2 }}
            onClick={handleClose}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Submissions;
