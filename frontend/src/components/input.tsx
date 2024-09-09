import React from 'react';
import styled from "styled-components";

export const Input = styled.input`
    border-color: rgb(207, 217, 222);
    border: 0 solid black;
    box-sizing: border-box;
    text-decoration: none;
    height: 3rem;
    border-radius: 4px;
    font-size: 15px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    border-top-width: 1px;
    width: 100%;
`;

export const InputComponent: React.FC<{
  inputValue?: number | string, 
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  readOnly?: boolean 
}> = ({ inputValue, handleChange, readOnly = false }) => (
  <Input
    id="fname"
    name="fname"
    defaultValue={inputValue}
    onChange={handleChange}
    readOnly={readOnly} 
    step="0.01"
  />
);
