import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import ProblemStatement from "../components/codingArena/ProblemStatement";
import Solutions from "../components/codingArena/Solutions";
import Submissions from "../components/codingArena/Submissions";
import Editor from "../components/CodeEditor/Editor";
import { customStyles } from "../constants/customStyles";


const problemData = {
  title: "Binary Search",
  description: `Given a sorted array of integers, write a function that returns the index of a given target value. 
                If the target is not found in the array, return -1.`,
  constraints: `1. The array is sorted in ascending order.
                2. The function should have a time complexity of O(log n).`,
  examples: [
    "Input: arr = [1, 2, 3, 4, 5, 6, 7], target = 5\nOutput: 4",
    "Input: arr = [1, 2, 3, 4, 5, 6, 7], target = 9\nOutput: -1",
  ],
};

const CodingArena = () => {
  const [currentView, setCurrentView] = useState("Problem");
  const [solutions, setSolutions] = useState([]); // Initialize with default value
  const [submissions, setSubmissions] = useState([
    "questionName: Two Sum, Memory: 15MB, Time: 0.02s, isCorrect: true",
  ]); // Initialize with default value

  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  const renderContent = () => {
    switch (currentView) {
      case "Solutions":
        return <Solutions solutions={solutions} />;
      case "Submissions":
        return <Submissions submissions={submissions} />;
      case "Problem":
      default:
        return (
          <ProblemStatement
            title={problemData.title}
            description={problemData.description}
            constraints={problemData.constraints}
            examples={problemData.examples}
          />
        );
    }
  };

  return (
    <>
      <Grid container spacing={2} sx={{ height: "100vh", padding: 2 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <Button
                sx={{
                  width: "auto",
                  maxWidth: "none",
                  marginRight: 1,
                  backgroundColor: currentView === "Problem" ? "#000" : "#444",
                }}
                onClick={() => setCurrentView("Problem")}
                variant="contained"
              >
                Problem
              </Button>
              <Button
                sx={{
                  width: "auto",
                  maxWidth: "none",
                  marginRight: 1,
                  backgroundColor:
                    currentView === "Solutions" ? "#000" : "#444",
                }}
                onClick={() => setCurrentView("Solutions")}
                variant="contained"
              >
                Solutions
              </Button>
              <Button
                sx={{
                  width: "auto",
                  maxWidth: "none",
                  backgroundColor:
                    currentView === "Submissions" ? "#000" : "#444",
                }}
                onClick={() => setCurrentView("Submissions")}
                variant="contained"
              >
                Submissions
              </Button>
            </Box>
            {renderContent()}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Editor />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          border: 0,
          marginRight: 2,
          position: "fixed",
          bottom: 0,
          right: 0,
          backgroundColor: "transparent", // Transparent background
          zIndex: 1,
        }}
      >
        <Button
          sx={{
            ...customStyles.control,
            width: "auto",
            maxWidth: "none",
            padding: "6px 12px",
            marginRight: 1,
            border: "none", // Remove border
            backgroundColor: "black", // Transparent background
            color: "white", // Black font color
            "&:hover": {
              cursor: "pointer",
              color: "blue", // Change color on hover if desired
            },
          }}
          variant="text" // Ensures no background is applied
          onClick={() => handleViewChange("Submit")} // Replace with actual Run functionality
        >
          Run
        </Button>
        <Button
          sx={{
            ...customStyles.control,
            width: "auto",
            maxWidth: "none",
            padding: "6px 12px",
            border: "none", // Remove border
            backgroundColor: "black", // Transparent background
            color: "white", // Black font color
            "&:hover": {
              cursor: "pointer",
              color: "blue", // Change color on hover if desired
            },
          }}
          variant="text" // Ensures no background is applied
          onClick={() => handleViewChange("Submit")} // Replace with actual Submit functionality
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default CodingArena;
