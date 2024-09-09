import React from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/logo.jpg';
import rightLogo from '../assets/right_logo.png';
import ButtonComponent from '../components/button';
import { useAuth } from '../contexts/AuthContext';

const WelcomeContainer = styled.div`
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

const Header = styled.h1`
  font-size: 42px;
  color: #0056b3;
  margin-bottom: 20px;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.1);
`;

const SubHeader = styled.h2`
  font-size: 26px;
  color: #04346C;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const AdjustedButtonComponent = styled(ButtonComponent)`
  width: auto;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
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
  margin-bottom: 40px;
`;

const Welcome: React.FC = () => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
      }
  return (
    <WelcomeContainer>
      <StyledContentBox>
        <Header>Welcome to Our Translation & Transcription Service</Header>
        <SubHeader>Seamlessly translate or transcribe your text and audio files.</SubHeader>
        <p>
          Our platform offers a comprehensive and user-friendly solution to meet all your translation and transcription
          needs. Join today and experience the power of our tools designed for accuracy and efficiency.
        </p>
      </StyledContentBox>

      <ButtonGroup>
        <NavLink to="/register">
          <AdjustedButtonComponent buttonLabel="Register" />
        </NavLink>
        <NavLink to="/login">
          <AdjustedButtonComponent buttonLabel="Login" />
        </NavLink>
      </ButtonGroup>
    </WelcomeContainer>
  );
};

export default Welcome;
