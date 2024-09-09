import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ButtonComponent from '../components/button';
import { SelectorComponent } from '../components/selector';
import { languageOptions } from '../data';
import { InputComponent } from '../components/input';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.jpg';
import rightLogo from '../assets/right_logo.png';
import TranslationResult from '../components/translation_evaluation';

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

const TranslateText: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [target, setTarget] = useState<string>('eng_Latn');
  const [source, setSource] = useState<string>('Unknown');
  const [language_choices, setLanguageChoices] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationData, setEvaluationData] = useState<any>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/language_code_mapping')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched language choices:", data);
        setLanguageChoices(data);
      })
      .catch(error => {
        console.error('Failed to load language data:', error);
      });
  }, []);

  const handleChangeSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value);
  };
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);
  const handleChangeTarget = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTarget(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(false);

    try {
      const response = await fetch('http://localhost:8000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          target_lang: target,
          source_lang: source === 'Unknown' ? undefined : source
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setEvaluationData(responseData);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <MainContainer>
      <div style={{ flexBasis: '30%', display: 'flex'}}><img src={logo} alt="Main Logo" /></div>
      <FormContainer>
        <h2>Translate Text</h2>
        <Form onSubmit={handleSubmit}>
          <Label>
            Source Language:
            <SelectorComponent options={Object.keys(language_choices)} handleChange={handleChangeSource} />
          </Label>
          <Label>
            Text:
            <InputComponent inputValue={text} handleChange={handleChangeText} />
          </Label>
          <Label>
            Target Language:
            <SelectorComponent options={Object.keys(language_choices)} handleChange={handleChangeTarget} />
          </Label>
          <ButtonComponent buttonLabel={isSubmitted ? "Submitted" : "Send Data"} />
        </Form>
      </FormContainer>
      <ContentContainer>
        <TranslationResult data={evaluationData} />
      </ContentContainer>
    </MainContainer>
  );
};

export default TranslateText;
