// frontend/src/pages/BlockSpam.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container } from '@mui/material';

function BlockSpam() {
  const [blockNumber, setBlockNumber] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleBlock = async () => {
    if (!/^[0-9]{10}$/.test(blockNumber)) {
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/numbers/block',
        { number: blockNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setMessage('Number successfully blocked!');
      } else {
        setMessage('Failed to block number.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error blocking number.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Block a Spam Number
      </Typography>
      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        margin="normal"
        inputProps={{ maxLength: 10 }}
      />
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleBlock}
        style={{ marginTop: '20px' }}
      >
        Block Number
      </Button>
      {message && (
        <Typography variant="body1" color="primary" align="center" style={{ marginTop: '20px' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
}

export default BlockSpam;
