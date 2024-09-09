import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import ButtonComponent from '../components/button';
import Checkbox from '@mui/material/Checkbox';
import logo from '../assets/logo.jpg';
import TranscriptionResult from '../components/transcription_evaluation';
import FormControlLabel from "@mui/material/FormControlLabel";
import ErrorBoundary from '../components/ErrorBoundary';

const MainContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  align-items: center;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-basis: 40%;
  align-items: center;
  padding: 2rem;
  background-color: #000C4B;
  color: white;
  border-radius: 1rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 50%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  margin: 1rem;
  font-weight: bold;
`;

const TranscribeAudio = () => {
  const [translate, setTranslate] = useState(false);
  const [onFileChange, setOnFileChange] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangeTranslate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTranslate(e.target.checked);
  };

  const uploadFileHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files;
    if (file) {
      setOnFileChange(file[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onFileChange) {
      alert("Please upload a file before submitting!");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('audio_file', onFileChange);
    const url = 'http://localhost:8001/transcribe';
    const queryParams = `?translate=${translate}`;
  
    try {
      const response = await fetch(url + queryParams, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
        mode: 'cors',
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setEvaluationData(responseData);
        setIsSubmitted(true);
      } else {
        setError("API request failed: " + await response.text());
      }
    } catch (error) {
      setError('An error occurred: ' + error);
    }
    setLoading(false);
  };

  return (
    <MainContainer>
      <div style={{ flexBasis: '30%', display: 'flex'}}><img src={logo} alt="Main Logo" /></div>
      <FormContainer>
        <h2>Transcribe Audio</h2>
        <Form onSubmit={handleSubmit}>
          <FormControlLabel
            control={<Checkbox name="translate" checked={translate} onChange={handleChangeTranslate} />}
            label="Translate Audio"
          />
          <Label>
            Please upload your audio file:
            <input
              id="file-input"
              type="file"
              accept=".flac"
              onChange={uploadFileHandler}
            />
          </Label>
          <ButtonComponent buttonLabel={isSubmitted ? "Submitted" : "Send Data"} disabled={!onFileChange} />
        </Form>
      </FormContainer>
      <ContentContainer>
        <ErrorBoundary>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <TranscriptionResult data={evaluationData} />
          )}
        </ErrorBoundary>
      </ContentContainer>
    </MainContainer>
  );
};

export default TranscribeAudio;
