import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TableComponent from "../components/contest/ContestTable";
import LoginModal from "../components/modals/LoginModal";

// Dark theme setup
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Check authentication status (e.g., check localStorage or context)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setModalOpen(true);
    }
  }, []);

  const handleModalClose = () => {
    setModalOpen(false);
    // Redirect to login page or show login form
    // Example: window.location.href = '/login';
  };

  const problemColumns = [
    { id: "id", label: "ID" },
    { id: "title", label: "Title" },
    { id: "score", label: "Score", align: "right" },
  ];

  const scoreboardColumns = [
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
    { id: "finishTime", label: "Finish Time" },
  ];

  const problemRows = [
    { id: 1, title: "Frozen yoghurt", score: "100" },
    { id: 2, title: "Ice cream sandwich", score: "1000" },
    // other rows...
  ];

  const getFinishTime = (finishTime) => finishTime || "Running";

  const scoreboardRows = [
    { name: "User1", score: 120, finishTime: "00:01:30" },
    { name: "User2", score: 110, finishTime: null },
    // other rows...
  ].map(row => ({
    ...row,
    finishTime: getFinishTime(row.finishTime),
  }));

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {isLoggedIn ? (
          <>
            <Box p={3}>
              <Typography variant="h4" display={"block"} textAlign={"center"} gutterBottom>
                Contest Name
              </Typography>
              <Typography variant="body1" color="textSecondary">
                This is a description of the page. It provides an overview of the content and purpose of the page.
              </Typography>
            </Box>
            <Box display="flex" mt={2}>
              <Box flex={3} mr={2}>
                <Typography variant="h6" gutterBottom>
                  Problems
                </Typography>
                <TableComponent 
                  columns={problemColumns} 
                  rows={problemRows} 
                  titleAsLink 
                />
              </Box>
              <Box flex={2}>
                <Typography variant="h6" gutterBottom>
                  Scoreboard
                </Typography>
                <TableComponent 
                  columns={scoreboardColumns} 
                  rows={scoreboardRows} 
                  titleAsLink
                />
              </Box>
            </Box>
          </>
        ) : (
          <LoginModal open={modalOpen} onClose={handleModalClose} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Page;
