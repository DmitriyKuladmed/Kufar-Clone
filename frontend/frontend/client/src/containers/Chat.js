import Layout from 'components/Layout';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './chatpage.css'


const Chat = () => {
  const [message, setMessage] = useState('');
  const { isAuthenticated, user, loading } = useSelector(state => state.user);

  const [displayedMessages, setDisplayedMessages] = useState([]);

  const { Id } = useParams();
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    async function fetchAd() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/announcement/' + Id, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
        
        const data = await res.json();
    
        if (res.status === 200) {
          console.log(data);
          setAdData(data)
          
          return data;
        } else {
          return res.rejectWithValue(data);
        }
      } catch (err) {
        console.log('no');
        
      }
    }
    fetchAd();
  }, [Id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplayedMessages([...displayedMessages, message]);
    setMessage('');
  };

  if (loading){
    return <h1>Loading..</h1>
} 
else if (!isAuthenticated){
    return (
        <Layout> 
            <h1 style={{ textAlign: 'center' }}> 
                Чтобы написать продавцу, нужно быть авторизованным! 
            </h1><br/><br/>
            <h5 style={{ textAlign: 'center' }}>Пройдите авторизацию</h5>
        </Layout>
    )
} else if (isAuthenticated) {
  return (
    <Layout>
    <div>
      <div style={{ textAlign: 'center' }} className='message-list'>
      {adData ? (
            <h2>Диалог с <u>{adData.first_name} {adData.last_name}</u></h2>
          ) : (
            <h2>Загрузка...</h2>
          )}
          <div className='chat-container'>
            <p style={{ textAlign: 'left' }}><u>Продавец</u>: Здравствуйте</p>
            <p style={{ textAlign: 'left' }}><u>Продавец</u>: Что Вас интересует по поводу объявления?</p>
              {displayedMessages.map((msg) => (
                <p className='message-bubble'><u>Вы</u>: {msg}</p>
              ))}
          </div>
        </div>
        <br /><br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="message">&nbsp;Напишите продавцу:&nbsp;&nbsp;</label>
          <div className='message-input-container'>
          <input
            className="message-input"
            type="text"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <br /><br />&nbsp;&nbsp;
          <button className="message-button" type="submit">Отправить сообщение</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
          }

export default Chat;