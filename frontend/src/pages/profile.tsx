import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StyledProfileContainer from '../components/ProfileContainer'; 
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import styled from 'styled-components';
import { Translation, Transcription } from '../types';
import { useAuth } from '../contexts/AuthContext'; 

const DataSection = styled.div`
  margin-top: 20px;
  padding: 30px; 
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
`;

const FormInput = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
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



const Profile: React.FC = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<{ username: string; email: string; created_at: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<'profile' | 'History' | 'settings'>('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [usernameToDelete, setUsernameToDelete] = useState('');
  
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8003/user-info', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        if (!response.ok) throw new Error(`Failed to fetch user info: ${await response.text()}`);
        const data = await response.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          created_at: new Date(data.created_at).toLocaleDateString(),
        });
      } catch (err) {
        console.error('Failed to fetch user info:', err);
        setError('Error: Could not fetch user info');
      }
    };

    fetchUserInfo();
    fetchLatestData('translations');
    fetchLatestData('transcriptions');
  }, []);

  const fetchLatestData = async (dataType: 'translations' | 'transcriptions') => {
    try {
      const response = await fetch(`http://localhost:8002/latest_data/default_user/${dataType}?count=3`);
      if (!response.ok) throw new Error(`Failed to fetch ${dataType}: ${await response.text()}`);
      const data = await response.json();
      if (dataType === 'translations') {
        setTranslations(data.data.map((item: any) => ({
          id: item.id,
          text: item.text,
          sourceLang: item.source_lang,
          targetLang: item.target_lang,
          translatedText: item.translated.join(', '),
        })));
      } else {
        setTranscriptions(data.data.map((item: any) => ({
          id: item.id,
          transcription: item.transcription
        })));
      }
    } catch (error) {
      console.error(`Failed to fetch ${dataType}:`, error);
    }
  };

  const fetchAllData = async (dataType: 'translations' | 'transcriptions') => {
    try {
        const response = await fetch(`http://localhost:8002/all_data/default_user/${dataType}`);
        if (!response.ok) throw new Error(`Failed to fetch all ${dataType}: ${await response.text()}`);
        const data = await response.json();
        if (dataType === 'translations') {
            setTranslations(data.data.map((item: any) => ({
                id: item.id,
                text: item.text,
                sourceLang: item.source_lang,
                targetLang: item.target_lang,
                translatedText: item.translated.join(', '),
            })));
        } else {
            setTranscriptions(data.data.map((item: any) => ({
                id: item.id,
                transcription: item.transcription
            })));
        }
    } catch (error) {
        console.error(`Failed to fetch all ${dataType}:`, error);
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

  const updatePassword = async () => {
    try {
      const response = await fetch('http://localhost:8003/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });
      if (!response.ok) throw new Error(`Failed to update password: ${await response.text()}`);
      alert('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Error: Could not update password');
    }
  };

  const updateEmail = async () => {
    try {
      const response = await fetch('http://localhost:8003/update-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ new_email: newEmail })
      });
      if (!response.ok) throw new Error(`Failed to update email: ${await response.text()}`);
      alert('Email updated successfully');
      setNewEmail('');
    } catch (error) {
      console.error('Error updating email:', error);
      setError('Error: Could not update email');
    }
  };

  const deleteAccount = async () => {
    if (usernameToDelete !== userInfo?.username) {
      alert("Entered username doesn't match the current username");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8003/users/${userInfo.username}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
  
      if (!response.ok) throw new Error(`Failed to delete user: ${await response.text()}`);
  
      alert('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error: Could not delete account');
    }
  };

  return (
    <StyledProfileContainer>
        <Sidebar>
            <h2>User Profile</h2>
            <ul>
                <li><a href="/">Home</a></li>
                <li><button onClick={() => setCurrentPage('profile')}>Profile</button></li>
                <li><button onClick={() => setCurrentPage('History')}>History</button></li>
                <li><button onClick={() => setCurrentPage('settings')}>Profile Settings</button></li>
            </ul>
        </Sidebar>
        <MainContent>
            <h1>User Profile</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {currentPage === 'profile' && userInfo && (
                <DataSection>
                    <h2>Profile Information</h2>
                    <DataItem>
                        <LangLine>Username: {userInfo.username}</LangLine>
                        <LangLine>Email: {userInfo.email}</LangLine>
                        <LangLine>Joined: {userInfo.created_at}</LangLine>
                    </DataItem>
                </DataSection>
            )}

            {currentPage === 'History' && (
                <>
                    <DataSection>
                        <h2>Translations History</h2>
                        <Button onClick={() => fetchAllData('translations')}>Load All Translations</Button>
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
                        <h2>Transcriptions History</h2>
                        <Button onClick={() => fetchAllData('transcriptions')}>Load All Transcriptions</Button>
                        {transcriptions.length > 0 ? transcriptions.map((transcription, index) => (
                            <DataItem key={index}>
                                {transcription.transcription}
                                <Button onClick={() => deleteData('transcriptions', transcription.id)}>Delete</Button>
                            </DataItem>
                        )) : <p>No transcriptions found</p>}
                    </DataSection>
                </>
            )}

            {currentPage === 'settings' && userInfo && (
              <DataSection>
                <h2>Profile Settings</h2>
                <FormSection>
                  <FormLabel>Old Password:</FormLabel>
                  <FormInput type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                  <FormLabel>New Password:</FormLabel>
                  <FormInput type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <Button onClick={updatePassword}>Update Password</Button>
                </FormSection>
                <FormSection>
                  <FormLabel>New Email:</FormLabel>
                  <FormInput type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  <Button onClick={updateEmail}>Update Email</Button>
                </FormSection>

                <FormSection>
                  <FormLabel>Type Username to Confirm Deletion:</FormLabel>
                  <FormInput type="text" value={usernameToDelete} onChange={(e) => setUsernameToDelete(e.target.value)} />
                  <Button onClick={deleteAccount} style={{ backgroundColor: '#ff0000' }}>Delete Account</Button>
                </FormSection>
              </DataSection>
            )}
        </MainContent>
    </StyledProfileContainer>
  );
};
export default Profile;
