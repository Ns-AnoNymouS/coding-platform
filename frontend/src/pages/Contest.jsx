import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Container, Button, TextField } from "@mui/material";
import ContestTable from "../components/contest/ContestTable";

const Contest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentContests, setCurrentContests] = useState([]);
  const [pastContests, setPastContests] = useState([]);

  const fetchContests = async () => {
    try {
      const [currentResponse, pastResponse] = await Promise.all([
        axios.get("http://localhost:6969/current-contests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }),
        axios.get("http://localhost:6969/past-contests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      setCurrentContests(currentResponse.data);
      setPastContests(pastResponse.data);
    } catch (error) {
      console.error("Error fetching contests:", error);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCurrentContests = currentContests.filter((contest) =>
    contest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastContests = pastContests.filter((contest) =>
    contest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentContestColumns = [
    { id: "id", label: "ID" },
    { id: "name", label: "Contest Name" },
    { id: "startTime", label: "Start Time", align: "right" },
    { id: "endTime", label: "End Time", align: "right" },
    { id: "register", label: "Register", align: "right" },
  ];

  const pastContestColumns = [
    { id: "id", label: "ID" },
    { id: "name", label: "Contest Name" },
    { id: "hostedDate", label: "Hosted Date", align: "right" },
    { id: "standings", label: "Standings", align: "right" },
  ];

  return (
    <Container>
      <Box p={2}>
        <Typography variant="h4" display={"block"} textAlign={"center"}>
          Contests
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search contests..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '70%' }} 
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#f5f5f5', color: '#000', marginLeft: 2 }}
        >
          Add Contest
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" display={"block"} textAlign={"left"} gutterBottom>
          Current or Upcoming Contests
        </Typography>
      </Box>
      <ContestTable 
        columns={currentContestColumns} 
        rows={filteredCurrentContests.map(contest => ({
          ...contest,
          register: contest.registered ? "Registered" : "Register"
        }))} 
        titleAsLink={true} 
        registrationStatus={true} 
      />
      <Box mt={4} />
      <Typography variant="h6" display={"block"} textAlign={"left"} gutterBottom>
        Past Contests
      </Typography>
      <ContestTable 
        columns={pastContestColumns} 
        rows={filteredPastContests} 
        titleAsLink={true} 
      />
    </Container>
  );
};

    </Box>
  )
}

export default Contest;