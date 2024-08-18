import { Box, Button } from '@mui/material';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const Contest = () => {
  const navigate = useNavigate();
  const {'contest-id': contestID} = useParams();
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height='100vh'>
    <Button variant='contained' color='secondary' onClick={()=>{navigate(`/contest/${contestID}/add`)}}>Add Problem</Button>

    </Box>
  )
}

export default Contest;