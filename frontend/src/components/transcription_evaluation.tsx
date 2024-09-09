import React from 'react'
import styled from 'styled-components';
import { InputComponent } from '../components/input';

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

const EvaluationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  margin: 1rem;
  font-weight: bold;
`;

type PropType = {
  data: any; 
}

export default function TranscriptionResult({ data }: PropType) {
  console.log('Data received:', data);
  
  const transcription = data && data.transcription ? data.transcription : "No transcription available.";

  return (
    <EvaluationContainer>
      <h2>Transcription Result</h2>
      <EvaluationWrapper>
        <Label>
          Transcription:
          <InputComponent inputValue={transcription} readOnly />
        </Label>
      </EvaluationWrapper>
    </EvaluationContainer>
  );
}
