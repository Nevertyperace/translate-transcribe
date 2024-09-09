import React from 'react'
import styled from 'styled-components';
import { InputComponent } from '../components/input';
import ButtonComponent from './button';

export const Text = styled.p`
  color: rgb(83, 100, 113);
  width: 277px;
  font-size: 1rem;
`;

const EvaluationContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-basis: 40%;
  align-items: center;
  padding: 2rem;
  background-color: #000C4B;
  color: white;
  margin-left: 1rem;
  border-radius: 1rem;
`;

const EvalutionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  margin: 1rem;
  font-weight: bold;
`;

type PropType = {
  data: any; // replace 'any' with a more specific type if you can
}

export default function TranslationResult({data}: PropType) {

  return (
    <EvaluationContainer>
      <h2>Result</h2>
      <EvalutionWrapper >
        <Label>
          Source Language:
          <InputComponent inputValue={data.source_lang}  />
        </Label>
        <Label>
          Target Language:
          <InputComponent inputValue={data.target_lang}  />
        </Label>
        <Label>
          Translation:
          <InputComponent inputValue={data.translated}  />
        </Label>
      </EvalutionWrapper>
    </EvaluationContainer>
  )
}