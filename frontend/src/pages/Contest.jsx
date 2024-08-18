import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Container, Button, TextField } from "@mui/material";
import ContestTable from "../components/contest/ContestTable";
import { useNavigate } from "react-router-dom";

const Contest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contests, setContests] = useState({ current: [], past: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContests = async () => {
    try {
      setLoading(true);

      // Fetching contests
      const [upcomingResponse, ongoingResponse, pastResponse] = await Promise.all([
        axios.get("http://localhost:6969/all-contest", {
          params: { type: "upcoming" },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get("http://localhost:6969/all-contest", {
          params: { type: "ongoing" },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get("http://localhost:6969/all-contest", {
          params: { type: "previous" },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      // Merge ongoing and upcoming contests into the current category
      const allContests = [
        ...upcomingResponse.data.data,
        ...ongoingResponse.data.data
      ];

      setContests({
        current: allContests,
        past: pastResponse.data.data
      });

    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCurrentContests = contests.current.filter((contest) =>
    contest.contestTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastContests = contests.past.filter((contest) =>
    contest.contestTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentContestColumns = [
    { id: "contestNumber", label: "Contest Number" },
    { id: "contestTitle", label: "Contest Title" },
    { id: "start", label: "Start Time", align: "right" },
    { id: "end", label: "End Time", align: "right" },
    { id: "register", label: "Register", align: "right" },
  ];

  const pastContestColumns = [
    { id: "contestNumber", label: "Contest Number" },
    { id: "contestTitle", label: "Contest Title" },
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
          onClick={() => navigate('/create-contest')}
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
          start: new Date(contest.schedule.start).toLocaleString(),
          end: new Date(contest.schedule.end).toLocaleString(),
          register: contest.isHost ? "Host" : "Register"
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
        rows={filteredPastContests.map(contest => ({
          ...contest,
          hostedDate: new Date(contest.schedule.start).toLocaleDateString(), // Adjust date format
          standings: "View Standings" // Placeholder text
        }))} 
        titleAsLink={true} 
      />
    </Container>
  );
};

export default Contest;
