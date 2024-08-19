import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TableComponent from "../components/contest/ContestTable";
import LoginModal from "../components/modals/LoginModal";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// Dark theme setup
const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Page = () => {
  const { "contest-id": contestId } = useParams(); // Access the contestId parameter
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
          const response = await axios.get(
            `http://localhost:6969/get-contest-question/${contestId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response.data.data);
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
  };

  const problemColumns = [
    { id: "contestNumber", label: "ID" },
    { id: "title", label: "Title" },
    { id: "score", label: "Score", align: "right" },
  ];

  const scoreboardColumns = [
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
    { id: "finishTime", label: "Finish Time" },
  ];

  const problemRows = contestData?.questions || []; // Adjust based on your data structure

  const getFinishTime = (finishTime) => finishTime || "Running";

  const scoreboardRows =
    contestData?.scoreboard ||
    [].map((row) => ({
      ...row,
      finishTime: getFinishTime(row.finishTime),
    }));

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container>
        {isLoggedIn ? (
          <>
            <Box p={3}>
              <Box className="flex justify-between">
                <Typography
                  variant="h4"
                  display={"block"}
                  textAlign={"center"}
                  gutterBottom
                >
                  {contestData?.contestTitle} {/* Displaying contest title */}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/contest/${contestId}/add`)}
                  sx={{
                    backgroundColor: "white",
                    color: "black",
                    "&:hover": { color: "white" },
                    maxHeight: "40px",
                    textTransform: "none"
                  }}
                >
                  Add Problem
                </Button>
              </Box>

              <Typography variant="body1" color="textSecondary">
                {contestData?.description}{" "}
                {/* Displaying contest description */}
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
