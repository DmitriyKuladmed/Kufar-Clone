import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from 'components/Layout';

const DetailPage = () => {
  const { adId } = useParams();
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    async function fetchAd() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/announcement/' + adId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
        
        const data = await res.json();
    
        if (res.status === 200) {
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
  }, [adId]);

  return (
    <Layout title='Kuvar | Объявление' content='Home page'>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', padding: '20px' }}>
          {adData ? (
            <>
              <h1 style={{ textAlign: 'center' }}>{adData.title}</h1>
              <img src={adData.photo} style={{ height: '350px', width: '570px', display: 'block', margin: '0 auto' }} />
              <p style={{ textAlign: 'center' }}>Дата публикации объявления: {adData.publication_date}</p>
              <p>Описание объявления: {adData.description}</p>
            </>
          ) : (
            <p>Загрузка...</p>
          )}
        </div>
        <div style={{ flex: '1', padding: '20px' }}>
          {adData ? (
            <>
              <h2>Данные продавца:</h2>
              <p>Имя и фамилия: {adData.first_name} {adData.last_name}</p>
              <p>Город: {adData.city}</p>
              <p><b>Цена товара: {adData.price} бел. руб.</b></p>
              <Link to={`/chat/${adData.id}`}>
                <button className="create-ad-button">Написать продавцу</button>
              </Link>
            </>
          ) : (
            <p>Загрузка данных о продавце...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};


export default DetailPage;