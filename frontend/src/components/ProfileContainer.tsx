import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import rightLogo from '../assets/right_logo.png'; 
import logo from '../assets/logo.jpg';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

export const StyledProfileContainer = styled(Container)`
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

const LogoutButton = styled.button`
  position: absolute;
  top: 20px; /* Adjust top position */
  right: 20px; /* Adjust right position */
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    background: linear-gradient(135deg, #ff4b2b, #ff416c);
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4);
  }
`;

interface Props {
    children?: ReactNode;
}

const ProfileContainer: FC<Props> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <StyledProfileContainer>
      {isAuthenticated && (
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      )}
      {children}
    </StyledProfileContainer>
  );
};

export default ProfileContainer;
