import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TableComponent from "../components/contest/ContestTable";
import LoginModal from "../components/modals/LoginModal";
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Dark theme setup
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Page = () => {
  const { 'contest-id': contestId } = useParams(); // Access the contestId parameter
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [contestData, setContestData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (contestId) {
      const fetchContestData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:6969/get-contest-question/${contestId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          console.log(response.data.data)
          setContestData(response.data.data);
        } catch (error) {
          console.error("Error fetching contest data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchContestData();
    }
  }, [contestId]);

  const handleModalClose = () => {
    setModalOpen(false);
    // Redirect to login page or show login form
    // Example: window.location.href = '/login';
  };

  // Define columns for problems table
  const problemColumns = [
    { id: "id", label: "ID" },
    { id: "title", label: "Title" },
    { id: "positive", label: "Positive Points", align: "right" },
    { id: "negative", label: "Negative Points", align: "right" },
  ];

  const scoreboardColumns = [
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
    { id: "finishTime", label: "Finish Time" },
  ];

  // Extract rows from the questions in contestData
  const problemRows = contestData?.questions?.map((question, index) => ({
    id: index + 1,  // Auto-incrementing ID
    title: question?.title,  // Access title safely
    positive: question?.points?.positive,  // Access points safely
    negative: question?.points?.negative,  // Access points safely
  })) || [];  

  const getFinishTime = (finishTime) => finishTime || "Running";

  const scoreboardRows = contestData?.scoreboard || []
    .map(row => ({
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
                {contestData?.contestTitle} {/* Displaying contest title */}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {contestData?.description} {/* Displaying contest description */}
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
                {/* Assuming scoreboard data would be handled similarly */}
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
