import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoginModal from "../components/modals/LoginModal";
import { useNavigate } from "react-router-dom";

// Dark theme setup
const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Page = ({ startTime, endTime }) => {
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

  const navigate = useNavigate();

  // Define columns for problems table
  const problemColumns = [
    { id: "id", label: "ID" },
    { id: "title", label: "Title", align: "left" }, // Ensure title is left-aligned for better readability
    { id: "positive", label: "Positive Points", align: "right" },
    { id: "negative", label: "Negative Points", align: "right" },
  ];

  const scoreboardColumns = [
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
    { id: "finishTime", label: "Finish Time" },
  ];

  // Extract rows from the questions in contestData
  const problemRows =
    contestData?.questions?.map((question, index) => ({
      id: index + 1, // Auto-incrementing ID
      title: (
        <Link
          href={`/contest/${contestId}/${question.id}`} // Change this to the appropriate URL for problem detail
          color="inherit"
          underline="hover"
        >
          {question.title}
        </Link>
      ), // Render title as a link
      positive: question?.points?.positive, // Access points safely
      negative: question?.points?.negative, // Access points safely
    })) || [];

  const getFinishTime = (finishTime) => finishTime || "Running";

  const scoreboardRows =
    contestData?.scoreboard?.map((row) => ({
      ...row,
      finishTime: getFinishTime(row.finishTime),
    })) || [];

  // Render Table component inline
  const renderTable = (columns, rows) => (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                sx={{ width: column.width || "auto" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || "left"}>
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container>
        {loading ? (
          <Typography variant="h6" textAlign="center">
            Loading...
          </Typography>
        ) : isLoggedIn ? (
          contestData && (
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
                  {contestData.isHost && (
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/contest/${contestId}/add`)}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        "&:hover": { color: "white" },
                        maxHeight: "40px",
                        textTransform: "none",
                      }}
                    >
                      Add Problem
                    </Button>
                  )}
                </Box>

                <Typography variant="body1" color="textSecondary">
                  {contestData?.description}{" "}
                </Typography>
              </Box>
              <Box display="flex" mt={2}>
                <Box flex={3} mr={2}>
                  <Typography variant="h6" gutterBottom>
                    Problems
                  </Typography>
                  {renderTable(problemColumns, problemRows)}
                </Box>
                <Box flex={2}>
                  <Typography variant="h6" gutterBottom>
                    Scoreboard
                  </Typography>
                  {renderTable(scoreboardColumns, scoreboardRows)}
                </Box>
              </Box>
            </>
          )
        ) : (
          <LoginModal open={modalOpen} onClose={handleModalClose} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Page;
