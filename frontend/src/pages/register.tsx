import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.jpg';
import rightLogo from '../assets/right_logo.png';
import ButtonComponent from '../components/button';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  background-color: #fff;
  position: relative;
  background-image: url(${rightLogo}), url(${logo});
  background-position: right bottom, 20px 20px;
  background-repeat: no-repeat, no-repeat;
  background-size: 600px 600px, auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 20px;
  text-align: center;
`;

const StyledContentBox = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  max-width: 600px;
`;

const FormField = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const RegisterButton = styled(ButtonComponent)`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
`;

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleRegister = async () => {
    const response = await fetch('http://localhost:8003/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      const tokenResponse = await fetch('http://localhost:8003/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
      });
      if (tokenResponse.ok) {
        const tokenResult = await tokenResponse.json();
        login(tokenResult.access_token, username); // Pass both token and username
        navigate('/home');
      }
    } else {
      const result = await response.json();
      setMessage(result.detail || 'Registration failed');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <RegisterContainer>
      <StyledContentBox>
        <h2>Register</h2>
        <FormField>
          <Label>Username:</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormField>
        <FormField>
          <Label>Email:</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField>
          <Label>Password:</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <RegisterButton buttonLabel="Register" onClick={handleRegister} />
        <p>{message}</p>
      </StyledContentBox>
    </RegisterContainer>
  );
};

export default Register;
