import { useState, useEffect, userRef } from 'react';
import Layout from 'components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { registerNewAnnouncement } from 'features/announcement';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const AnnouncementPage = () => {
	const dispatch = useDispatch();
	const { user, loading } = useSelector(state => state.user);

	const [formData, setFormData] = useState({
		title: '',
        first_name: '',
        last_name: '',
		city: '',
		description: '',
		price: '',
        category: '',
		photo: null
	});

	const [message, setMessage] = useState('');

	const { title, first_name, last_name, city, description, price, photo } = formData;
	const [postimage, setPostImage] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [adDetails, setAdDetails] = useState({});

    const { Id } = useParams();

    useEffect(() => {
        if (user && user.email) {
          setFormData({ ...formData, first_name: user.first_name, last_name: user.last_name });
        }
      }, [user]);

	const onChange = e => {
		const { name, value, files } = e.target;

		if (e.target.name === 'photo') {
			setPostImage({
				photo: e.target.files,
			});
			setFormData({ ...formData, [name]: [files[0]] });
		  } else {
			setFormData({ ...formData, [name]: [value] });
		  }		
		  
	};
	
	const onSubmit = async (e) => {
		e.preventDefault();
	
		try {
			const announcementData = new FormData();
			announcementData.append('title', formData.title);
			announcementData.append('first_name', formData.first_name);
			announcementData.append('last_name', formData.last_name);
			announcementData.append('city', formData.city);
			announcementData.append('description', formData.description)
			announcementData.append('price', formData.price);
			announcementData.append('category', selectedCategory);
			announcementData.append('photo', postimage.photo[0]);
			

            await axios.put(`http://127.0.0.1:8000/api/announcement/${Id}/`, announcementData);
	
		  setMessage('Объявление успешно обновлено!');
		} catch (error) {
		  console.error(error);
		  setMessage('Ошибка при обновлении объявления...');
		}
	  };


    useEffect(() => {
        if (user && user.email) {
            setFormData({ ...formData, first_name: user.first_name, last_name: user.last_name });
          }
        }, [user]);
      
        useEffect(() => {
          axios
            .get(`http://127.0.0.1:8000/api/announcement/${Id}/`)
            .then((response) => {
              const adData = response.data;
              setAdDetails(adData);
                
              setFormData({
                title: adData.title,
                first_name: adData.first_name,
                last_name: adData.last_name,
                city: adData.city,
                description: adData.description,
                price: adData.price,
                category: adData.category,
              });

              setSelectedCategory(adData.category || '');
            })
            .catch((error) => {
              console.error('Error fetching ad details:', error);
            });

        axios
        .get('http://127.0.0.1:8000/api/category/')
        .then((response) => {
            setCategories(response.data['results']);
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }, []);

    const handleCategoryChange = (event) => {
        
        setSelectedCategory(event.target.value);
		
    };



	return (
		<Layout title='Kuvar | Объявление' content='Register page'>
			<h1>Редактирование объявления</h1>
			{message && <p>{message}</p>}
			<form className='mt-5' onSubmit={onSubmit} encType="multipart/form-data">
				<div className='form-group'>
					<label className='form-label' htmlFor='title'>
						Заголовок
					</label>
					<input
						className='form-control'
						name='title'
						type='text'
						onChange={onChange}
						value={title}
						required
					/>
				</div>
                <div className='form-group mt-3'>
					<label className='form-label' htmlFor='city'>
                        Город
					</label>
					<input
						className='form-control'
						name='city'
						type='text'
						onChange={onChange}
						value={city}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='description'>
                        Описание
					</label>
					<input
						className='form-control'
						name='description'
						type='text'
						onChange={onChange}
						value={description}
						required
					/>
				</div>
                <div className='form-group mt-3'>
					<label className='form-label' htmlFor='price'>
                        Цена (в бел. руб.)
					</label>
					<input
						className='form-control'
						name='price'
						onChange={onChange}
						value={price}
						required
					/>
				</div>
                <br />
                <div>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="category.name">Выберите категорию</option>
                        {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                            {category.name}
                        </option>
                        ))}
                    </select>
                </div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='photo'>
						Фото
					</label>
					<input
						className='form-control'
						type='file'
						id='post-photo'
						name='photo'
						onChange={onChange}
						accept='image/*'
					/>
        		</div>

                
				{loading ? (
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</div>
				) : (
					<button className='btn btn-primary mt-4'>Обновить информацию</button>
                    
				)}
			</form>
            <br /><br />
		</Layout>
	);
};

export default AnnouncementPage;
