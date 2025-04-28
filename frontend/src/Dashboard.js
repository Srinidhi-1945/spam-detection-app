import React, { useEffect } from 'react';
import { Button, Container, Typography, Paper, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Check if the user is logged in by looking for a token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if not authenticated
    }
  }, [navigate]);

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: 20, marginTop: 20 }}>
        <Typography variant="h4">Spam Call Detector Dashboard</Typography>
        <Typography variant="subtitle1">What would you like to do today?</Typography>

        <Grid container spacing={3} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={Link}
              to="/check"
            >
              Check Number
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              component={Link}
              to="/report"
            >
              Report Spam
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#4caf50', color: 'white' }}
              component={Link}
              to="/leaderboard"
            >
              Leaderboard
            </Button>
          </Grid>
          {/* New Block Spam Button */}
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              style={{ backgroundColor: '#ff9800', color: 'white' }}
              component={Link}
              to="/block"
            >
              Block Spam
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Dashboard;
