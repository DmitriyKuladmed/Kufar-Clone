import Layout from 'components/Layout';
import React, { useEffect, useState } from 'react';
import styles from './homepage.css'
import { Link } from 'react-router-dom'; // Import Link from React Router
import AdDetailPage from './DetailPage';
import axios from 'axios';

const HomePage = () => {
	  const [loading, setLoading] = useState(true);
  	const [announcements, setAnnouncements] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('')
	
	  useEffect(() => {
      axios
        .get('http://127.0.0.1:8000/api/category/')
        .then((response) => {
            setCategories(response.data['results']);
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });
		fetchAnnouncements();
	  }, []);


  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFilterClick = () => {
    fetchFilterAnnouncements(selectedCategory, searchQuery);
  };
	
  const handleSearchClick = () => {
    fetchSearchAnnouncements(searchQuery);
  };
	  
	  const fetchAnnouncements = async () => {
		try {
		  const res = await fetch('http://127.0.0.1:8000/api/announcement/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
			},
		  });
		  
		  if (res.status === 200) {
			const data = await res.json();
			setAnnouncements(data['results']);
			setLoading(false);

		  } else {

			const errorData = await res.json();
			setLoading(false);

		  }
		} catch (err) {

		  console.error('2. Error fetching announcements:', err);
		  setLoading(false);

		}
	  };

    const fetchSearchAnnouncements = async (query) => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/search_by_title/?query=${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (res.status === 200) {
          const data = await res.json();
          setAnnouncements(data['results']);
          setLoading(false);
        } else {
          const errorData = await res.json();
          console.error('Error fetching announcements:', errorData);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setLoading(false);
      }
    };


    const fetchFilterAnnouncements = async (category = selectedCategory) => {
      try {
        const categoryQueryParam = selectedCategory ? `?category=${selectedCategory}` : '';
        const res = await fetch('http://127.0.0.1:8000/filtered_advertisements/' + categoryQueryParam, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
        },
        });
        
        if (res.status === 200) {
        const data = await res.json();
        
        setAnnouncements(data);
        setLoading(false);
  
        } else {
  
        const errorData = await res.json();
        setLoading(false);
  
        }
      } catch (err) {
  
        console.error('2. Error fetching announcements:', err);
        setLoading(false);
  
      }
      };
	

	return (
		 <Layout title='Kuvar | Главная' content='Home page'>

      {loading ? (
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Загрузка...</span>
        </div>
      ) : (
        <>
          <h1 style={{ 'textAlign': 'center'} }className='mb-5'>Добро пожаловать на Kuvar!</h1>
          <input
              type="text"
              placeholder="Поиск по названию"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />&nbsp;&nbsp;
            <button className="filter-button" onClick={handleSearchClick}>Искать</button>
            <br /><br />
            <div>
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="category.name">Выберите категорию</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>&nbsp;&nbsp;
              <button className="filter-button" onClick={handleFilterClick}>Фильтровать</button>
            </div>
          <hr />
          <div className="announcement-list">
            {Array.isArray(announcements) && announcements.map((announcement) => (
              <div style={{ textAlign: 'center' }} key={announcement.id} className="announcement-container">
                <img src={announcement.photo} style={{ height: '150px', width: '230px', display: 'block', margin: '0 auto' }} />
                <b>{announcement.title}.</b><br />
                <u>Цена: {announcement.price} бел. руб.</u>
                <p>Опубликовано: {announcement.publication_date}</p>
                <Link to={`/${announcement.id}`} key={announcement.id}>
                  <div className="announcement-container">
                    <button className="floating-button">Детальнее</button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <br />
        </>
      )}
    </Layout>
	);
};

export default HomePage;
