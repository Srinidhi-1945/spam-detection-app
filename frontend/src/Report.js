import React, { useState } from 'react'; 
import { TextField, Button, Container, Typography, 
Paper, CircularProgress } from '@mui/material'; 
import axios from 'axios'; 
import './App.css'; 
function Report() { 
const [number, setNumber] = useState(''); 
const [message, setMessage] = useState(''); 
const [success, setSuccess] = useState(false); 
const [loading, setLoading] = useState(false); 
const [error, setError] = useState(''); 
const validatePhoneNumber = (phone) => { 
const regex = /^[0-9]{10}$/; // Simple validation for 10-digit phone number 
return regex.test(phone); 
}; 
const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (!validatePhoneNumber(number)) { 
      setError('Please enter a valid 10-digit phone number'); 
      return; 
    } 
    setError(''); 
    setLoading(true); 
    try { 
      const response = await 
axios.post('http://localhost:5000/api/numbers/report', 
{ 
        number, 
        message 
      }, { 
        headers: { 
          'Authorization': `Bearer 
${localStorage.getItem('token')}` // Passing token for authentication 
        } 
      }); 
 
      if (response.data.success) { 
        setSuccess(true); 
        setNumber(''); 
        setMessage(''); 
      } else { 
        setError('Failed to report. Please try again.'); 
      } 
    } catch (error) { 
      console.error('Error:', error); 
      setError('Failed to report. Please try again.'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
 
  return ( 
    <Container maxWidth="sm"> 
      <Paper style={{ padding: 20, marginTop: 20 }}> 
        <Typography variant="h5" gutterBottom> 
          Report Spam Number 
        </Typography> 
 
        {success && ( 
          <Typography color="primary" style={{ 
marginBottom: 20 }}> 
            Thank you for reporting! Your contribution helps 
keep the community safe. 
          </Typography> 
        )} 
 
        {error && ( 
          <Typography color="error" style={{ 
marginBottom: 20 }}> 
            {error} 
          </Typography> 
        )} 
 
        <form onSubmit={handleSubmit}> 
          <TextField 
            label="Phone Number" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            required 
            error={!!error && 
!validatePhoneNumber(number)} // Show error on 
invalid phone number 
            helperText={error && 
!validatePhoneNumber(number) ? 'Enter a valid 10digit phone number' : ''} 
          /> 
          <TextField 
            label="Optional: Describe the spam (e.g., 'Scam 
call about credit cards')" 
            variant="outlined" 
            fullWidth 
            margin="normal" 
            multiline 
            rows={4} 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          /> 
          <Button 
            type="submit" 
            variant="contained" 
            color="secondary" 
            fullWidth 
            style={{ marginTop: 20 }} 
            disabled={loading || success} // Disable after 
successful submission 
          > 
            {loading ? <CircularProgress size={24} 
color="secondary" /> : 'Report as Spam'} 
          </Button> 
        </form> 
      </Paper> 
    </Container> 
  ); 
} 
 
export default Report;