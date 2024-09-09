import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import StyledProfileContainer from '../components/ProfileContainer';
import { Translation, Transcription } from '../types';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = styled.h1`
  font-size: 36px;
  color: #0056b3;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubHeader = styled.h2`
  font-size: 26px;
  color: #04346C;
  margin-bottom: 15px;
`;

const DataSection = styled.div`
  margin-top: 20px;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DataItem = styled.div`
  padding: 25px;
  margin-bottom: 25px;
  background-color: #f3f3f3;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
`;

const LangLine = styled.div`
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const TranslatedText = styled(LangLine)`
  color: #0056b3;
  font-weight: normal;
`;

const Button = styled.button`
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

  svg {
    margin-right: 8px;
  }
`;

const Home: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
    fetchLatestData('translations');
    fetchLatestData('transcriptions');
  }, [isAuthenticated]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8003/user-info', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (!response.ok) throw new Error(`Failed to fetch user info: ${await response.text()}`);
      const userInfo = await response.json();
      console.log('User Info:', userInfo);
      setUserId(userInfo.id);
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setError('Error: Could not fetch user info');
    }
  };

  const fetchLatestData = async (dataType: 'translations' | 'transcriptions') => {
    try {
      const response = await fetch(`http://localhost:8002/latest_data/default_user/${dataType}?count=3`);
      if (!response.ok) throw new Error(`Failed to fetch ${dataType}: ${await response.text()}`);
      const data = await response.json();
      if (dataType === 'translations') {
        setTranslations(
          data.data.map((item: any) => ({
            id: item.id,
            text: item.text,
            sourceLang: item.source_lang,
            targetLang: item.target_lang,
            translatedText: item.translated.join(', '),
          }))
        );
      } else {
        setTranscriptions(
          data.data.map((item: any) => ({
            id: item.id,
            transcription: item.transcription,
          }))
        );
      }
    } catch (error) {
      console.error(`Failed to fetch ${dataType}:`, error);
    }
  };

  const deleteData = async (dataType: 'translations' | 'transcriptions', dataId: string) => {
    try {
      await fetch(`http://localhost:8002/delete_specific/default_user/${dataType}/${dataId}`, { method: 'DELETE' });
      if (dataType === 'translations') {
        setTranslations((prev) => prev.filter((translation) => translation.id !== dataId));
      } else {
        setTranscriptions((prev) => prev.filter((transcription) => transcription.id !== dataId));
      }
      await fetchLatestData(dataType);
    } catch (error) {
      console.error(`Failed to delete ${dataType}:`, error);
      setError(`Error: Could not delete data`);
    }
  };

  return (
    <StyledProfileContainer>
      <Sidebar>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/profile">Profile</NavLink></li>
          <li><NavLink to="/translate_text">Translate Text</NavLink></li>
          <li><NavLink to="/transcribe_audio">Transcribe Audio</NavLink></li>
        </ul>
      </Sidebar>

      <MainContent>
        <Header>
          {username ? `Hello ${username}!` : 'Fetching user information...'}
        </Header>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <DataSection>
          <SubHeader>Recent Translations</SubHeader>
          {translations.length > 0 ? translations.map((translation, index) => (
            <DataItem key={index}>
              <LangLine>Source Language: {translation.sourceLang}</LangLine>
              <LangLine>Original Text: {translation.text}</LangLine>
              <LangLine>Target Language: {translation.targetLang}</LangLine>
              <TranslatedText>Translated: {translation.translatedText}</TranslatedText>
              <Button onClick={() => deleteData('translations', translation.id)}>Delete</Button>
            </DataItem>
          )) : <p>No translations found</p>}
        </DataSection>

        <DataSection>
          <SubHeader>Recent Transcriptions</SubHeader>
          {transcriptions.length > 0 ? transcriptions.map((transcription, index) => (
            <DataItem key={index}>
              {transcription.transcription}
              <Button onClick={() => deleteData('transcriptions', transcription.id)}>Delete</Button>
            </DataItem>
          )) : <p>No transcriptions found</p>}
        </DataSection>
      </MainContent>
    </StyledProfileContainer>
  );
};

export default Home;
