import React from 'react';
import styled from 'styled-components';

export const Button = styled.button<{ $size?: string, disabled?: boolean }>`
  width: ${props => props.$size || 'auto'};
  height: 40px;
  padding: 0 20px;
  flex: 0 0 auto;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #42a5f5, #1e88e5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  text-align: center;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(135deg, #1976d2, #1565c0);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
  }
`;

interface ButtonComponentProps {
  buttonLabel: string;
  size?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ buttonLabel, size, disabled, onClick }) => {
  return (
    <Button $size={size} disabled={disabled} onClick={onClick}>
      {buttonLabel}
    </Button>
  );
};

export default ButtonComponent;
