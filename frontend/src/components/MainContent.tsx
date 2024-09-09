// src/components/MainContent.tsx
import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

const StyledMainContent = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #fff;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  border-radius: 8px;
  margin-bottom: 120px;
  border: 1px solid #e6e6e6;
`;

interface Props {
  children?: ReactNode;
}

const MainContent: FC<Props> = ({ children }) => {
  return <StyledMainContent>{children}</StyledMainContent>;
};

export default MainContent;
