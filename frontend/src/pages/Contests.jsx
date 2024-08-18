import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Contests = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box p={2}>
        <Typography variant="h4" display={"block"} textAlign={"center"}>Contests</Typography>
        <Button variant="contained" className="block text-center" onClick={()=>navigate("/create-contest")}>Create Contest</Button>
      </Box>
    </Container>
  );
};

export default Contests;
