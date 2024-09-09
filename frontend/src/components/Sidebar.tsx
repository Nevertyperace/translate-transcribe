import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledSidebar = styled.div`
  flex: 0 0 25%;
  padding: 20px;
  border-right: 2px solid #e0e0e0;
  height: 100vh;
  background-color: #f7f7f7;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  font-size: 15px; // Uniform font size
  color: #444;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
      text-align: center; // Center-align text

      &:last-child {
        border-bottom: none;
      }

      a, button {
        align-items: center; 
        height: 100%;
        width: 100%;
        padding: 10px; 
        color: #0066cc;
        background: none;
        border: none;
        cursor: pointer;
        text-decoration: none; 

        &:hover {
          color: #004499;
        }
      }
    }
  }
`;

interface Props {
    children?: ReactNode;
}

const Sidebar: FC<Props> = ({ children }) => {
  return <StyledSidebar>{children}</StyledSidebar>;
};

export default Sidebar
