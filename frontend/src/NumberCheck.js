// frontend/src/NumberCheck.js
import React, { useState } from 'react';
import axios from 'axios';

function NumberCheck() {
  const [checkNumber, setCheckNumber] = useState('');
  const [result, setResult] = useState('');
  const [points, setPoints] = useState(0);
  const token = localStorage.getItem('token');

  // Function to check if the number is spam
  const checkSpam = async () => {
    if (!/^[0-9]{10}$/.test(checkNumber)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/numbers/check',
        {
          number: checkNumber
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setResult(
          response.data.isSpam
            ? `Spam Detected (${response.data.reportCount} reports)`
            : 'Not Spam'
        );
      } else {
        setResult('Check failed');
      }
    } catch (err) {
      console.error(err);
      setResult('Error checking number');
    }
  };

  // Handle Exit
  const handleExit = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Handle Blocking the number
  const handleBlock = () => {
    if (result.includes('Spam Detected')) {
      const blockedNumbers = JSON.parse(localStorage.getItem('blockedNumbers')) || [];

      if (!blockedNumbers.includes(checkNumber)) {
        blockedNumbers.push(checkNumber);
        localStorage.setItem('blockedNumbers', JSON.stringify(blockedNumbers));
        alert(`${checkNumber} has been blocked.`);
      } else {
        alert(`${checkNumber} is already blocked.`);
      }
    } else {
      alert('The number is not spam, so it cannot be blocked.');
    }
  };

  return (
    <div className="centered-box">
      <h2>Check Phone Number</h2>
      <input
        type="text"
        value={checkNumber}
        onChange={(e) => setCheckNumber(e.target.value)}
        placeholder="Enter number"
      />
      <button onClick={checkSpam}>Check</button>
      <p>{result}</p>

      {result.includes('Spam Detected') && (
        <button onClick={handleBlock}>Block</button>
      )}

      <div className="button-group">
        <button onClick={handleExit}>Exit</button>
      </div>
      <div className="points-box">
        <h4>Your Points: {points}</h4>
      </div>
    </div>
  );
}

export default NumberCheck;
