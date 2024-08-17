import { useState } from "react";
import axios from "axios";
import { TableContainer, Paper, TableRow, Table, TableHead, TableCell, TableBody, Snackbar, Alert } from "@mui/material";
import TestCaseModal from "./TestCaseModal";
import TestCaseRow from './TestCaseRow';

const TestCaseTable = ({ testCases, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Default severity is "success"

  const handleOpenModal = async (testCase) => {
    try {
      const response = await axios.get(
        `http://localhost:6969/problem/${testCase.problemNumber}`
      );
      setSelectedTestCase({
        ...response.data.data,
        testcaseID: testCase._id, // Make sure to pass the testcaseID
        input: testCase.givenInput,
        output: testCase.correctOutput,
      });
      setOpen(true);
    } catch (err) {
      console.error("Error fetching problem details:", err);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTestCase(null);
  };

  const handleApproveOrDecline = async (testcaseID, action) => {
    try {
      const response = await axios.post(
        `http://localhost:6969/${action}-test-case`,
        { testcaseID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status >= 200 && status < 500,
        }
      );

      if (response.status === 200) {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(response.data.message || "An error occurred.");
        setSnackbarSeverity("error");
      }

      setSnackbarOpen(true); // Open the Snackbar
      onRefresh(); // Trigger a refresh after approval/decline
      handleCloseModal(); // Close the modal after the action
    } catch (err) {
      console.error(err);
      setSnackbarMessage("An error occurred while processing the request.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
      handleCloseModal(); // Close the modal even if there's an error
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // Ensure the container has relative positioning
      }}
    >
      <TableContainer
        component={Paper}
        style={{ width: "80vw", margin: "0 auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Problem Number</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testCases.map((testCase, index) => (
              <TestCaseRow
                key={index}
                problemNumber={testCase.problemNumber}
                problemTitle={testCase.title}
                testcase={{
                  input: testCase.givenInput,
                  output: testCase.correctOutput,
                  testCaseId: testCase._id
                }}
                onApprove={() => handleApproveOrDecline(testCase._id, "add")}
                onDecline={() =>
                  handleApproveOrDecline(testCase._id, "decline")
                }
                onOpenModal={() => handleOpenModal(testCase)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedTestCase && (
        <TestCaseModal
          open={open}
          handleClose={handleCloseModal}
          details={selectedTestCase}
          onApprove={(testCaseId) => handleApproveOrDecline(testCaseId, "add")}
          onDecline={(testCaseId) => handleApproveOrDecline(testCaseId, "decline")}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Set the position to top-right
        sx={{ 
          marginTop: 8 // Adjust this value to move the Snackbar down
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TestCaseTable;
