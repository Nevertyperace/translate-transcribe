import React from 'react'
import styled from "styled-components";

export const Selector = styled.select`
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
    display: flex;
    width: 100%;
`;

export const SelectorComponent: React.FC<{options: Array<string>, handleChange: React.ChangeEventHandler<HTMLSelectElement>}> = ({options, handleChange}) => (
    <Selector name="dob" id="dob" onChange={handleChange}>
    {options.map((data, i) => (
        <option key={i} value={data}>{data}</option>
    ))}
    </Selector>
)