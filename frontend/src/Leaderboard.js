import React, { useState, useEffect } from 'react'; 
import { Container, Paper, Typography, Table, 
TableBody, TableCell, TableContainer, TableHead, 
TableRow, CircularProgress, Button } from 
'@mui/material'; 
import axios from 'axios'; 
import './App.css'; 
function Leaderboard() { 
const [leaderboard, setLeaderboard] = useState([]); 
const [loading, setLoading] = useState(true); 
const [error, setError] = useState(''); 
// Fetch leaderboard data 
const fetchLeaderboard = async () => { 
setLoading(true); // Set loading state to true 
try { 
const response = await 
axios.get('http://localhost:5000/api/user/leaderboard')
 ; 
      if (response.data.success) { 
        setLeaderboard(response.data.leaderboard); 
      } else { 
        setError('Failed to fetch leaderboard data'); 
      } 
    } catch (error) { 
      console.error('Error:', error); 
      setError('There was an error fetching the leaderboard.'); 
    } finally { 
      setLoading(false); // Set loading state to false 
    } 
  }; 
 
  // Fetch leaderboard on initial load 
  useEffect(() => { 
    fetchLeaderboard(); 
  }, []); 
 
  return ( 
    <Container maxWidth="md"> 
      <Paper style={{ padding: 20, marginTop: 20 }}> 
        <Typography variant="h4" gutterBottom> 
          Community Leaderboard 
        </Typography> 
        <Typography variant="subtitle1" style={{ 
marginBottom: 20 }}> 
          Top contributors in spam detection 
        </Typography> 
 
        {loading ? ( 
          <CircularProgress color="secondary" /> 
        ) : error ? ( 
          <div> 
            <Typography 
color="error">{error}</Typography> 
            <Button variant="contained" color="primary" 
onClick={fetchLeaderboard} style={{ marginTop: 20 }}> 
              Retry 
            </Button> 
          </div> 
        ) : leaderboard.length === 0 ? ( 
          <Typography>No leaderboard data 
available</Typography> 
        ) : ( 
          <TableContainer component={Paper}> 
            <Table> 
              <TableHead> 
                <TableRow> 
                  <TableCell>Rank</TableCell> 
                  <TableCell>Phone Number</TableCell> 
                  <TableCell align="right">Points</TableCell> 
                </TableRow> 
              </TableHead> 
              <TableBody> 
                {leaderboard.map((user, index) => ( 
                  <TableRow key={index}> 
                    <TableCell>{index + 1}</TableCell> 
                    <TableCell>{user.phone_number}</TableCell
 > 
                    <TableCell 
align="right">{user.points}</TableCell> 
                  </TableRow> 
                ))} 
              </TableBody> 
            </Table> 
          </TableContainer> 
        )} 
      </Paper> 
    </Container> 
  ); 
} 
 
export default Leaderboard;