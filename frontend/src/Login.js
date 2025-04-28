import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import './App.css'; 

function Login() { 
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [isRegistering, setIsRegistering] = useState(false); 
  const navigate = useNavigate(); 

  const isValidPhoneNumber = (number) => /^[0-9]{10}$/.test(number); // Validate only 10 digits

  const handleLogin = async () => { 
    if (!isValidPhoneNumber(phoneNumber)) { 
      alert('Please enter a valid 10-digit phone number.'); 
      return; 
    } 

    try { 
      const response = await axios.post('http://localhost:5000/api/auth/login', { phone_number: phoneNumber }); 

      if (response.data.success) { 
        localStorage.setItem('userPhone', phoneNumber); 
        localStorage.setItem('token', response.data.token); 
        navigate('/check'); 
      } else { 
        alert(response.data.message || 'Login failed.'); 
      } 
    } catch (err) { 
      console.error(err); 
      alert('Login failed. Please try again.'); 
    } 
  };

  const handleRegister = async () => { 
    if (!isValidPhoneNumber(phoneNumber)) { 
      alert('Please enter a valid 10-digit phone number.'); 
      return; 
    }

    try { 
      const response = await axios.post('http://localhost:5000/api/auth/register', { phone_number: phoneNumber }); 

      if (response.data.success) { 
        localStorage.setItem('userPhone', phoneNumber); 
        localStorage.setItem('token', response.data.token); 
        navigate('/check'); 
      } else { 
        alert(response.data.message || 'Registration failed.'); 
      } 
    } catch (err) { 
      console.error(err); 
      alert('Registration failed. Please try again.'); 
    } 
  };

  return ( 
    <div className="centered-box"> 
      <h2>{isRegistering ? 'Register' : 'Login'}</h2> 
      <input 
        type="text" 
        placeholder="Enter your phone number" 
        value={phoneNumber} 
        onChange={(e) => setPhoneNumber(e.target.value)} 
      /> 
      <button onClick={isRegistering ? handleRegister : handleLogin}> 
        {isRegistering ? 'Register' : 'Login'} 
      </button> 
      <p style={{ marginTop: '10px' }}> 
        {isRegistering ? ( 
          <> 
            Already registered?{' '} 
            <span className="link" onClick={() => setIsRegistering(false)} style={{ color: 'blue', cursor: 'pointer' }}> 
              Login 
            </span> 
          </> 
        ) : ( 
          <> 
            Didn't register?{' '} 
            <span className="link" onClick={() => setIsRegistering(true)} style={{ color: 'blue', cursor: 'pointer' }}> 
              Register 
            </span> 
          </> 
        )} 
      </p> 
    </div> 
  ); 
}

export default Login;
