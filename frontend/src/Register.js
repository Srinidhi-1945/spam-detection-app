import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function Register() { 
  const [phone, setPhone] = useState(''); 
  const navigate = useNavigate(); 

  const isValidPhoneNumber = (number) => /^[0-9]{10}$/.test(number); // Validate only 10 digits

  const handleRegister = async () => { 
    if (!isValidPhoneNumber(phone)) { 
      alert('Please enter a valid 10-digit phone number.'); 
      return; 
    }

    try { 
      const res = await axios.post('http://localhost:5000/api/auth/register', { phone_number: phone }); 
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token); 
        localStorage.setItem('userPhone', res.data.phone_number); 
        navigate('/check'); // Navigate to the number check page after successful registration
      } else {
        alert(res.data.message || 'Registration failed'); 
      }
    } catch (err) { 
      alert(err.response?.data?.message || 'Registration failed'); 
    } 
  };

  return ( 
    <div className="centered-box"> 
      <h2>Register</h2> 
      <input 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        placeholder="Enter phone number" 
      /> 
      <button onClick={handleRegister}>Register</button> 
    </div> 
  ); 
}

export default Register;
