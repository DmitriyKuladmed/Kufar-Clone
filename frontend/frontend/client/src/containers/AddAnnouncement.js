import { useState, useEffect, userRef } from 'react';
import Layout from 'components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { registerNewAnnouncement } from 'features/announcement';
import axios from 'axios';


const AnnouncementPage = () => {
	const dispatch = useDispatch();
	const { user, loading } = useSelector(state => state.user);

	const [formData, setFormData] = useState({
		title: '',
        first_name: '',
        last_name: '',
		email: '',
		city: '',
		description: '',
		price: '',
        category: '',
		photo: null
	});

	const [message, setMessage] = useState('');

	const { title, first_name, last_name, email, city, description, price } = formData;

	const [postimage, setPostImage] = useState([]);


    useEffect(() => {
        if (user && user.email) {
          setFormData({ ...formData, first_name: user.first_name, last_name: user.last_name, email: user.email });
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
			announcementData.append('email', formData.email);
			announcementData.append('city', formData.city);
			announcementData.append('description', formData.description)
			announcementData.append('price', formData.price);
			announcementData.append('category', selectedCategory);
			announcementData.append('photo', postimage.photo[0]);
			console.log(title, first_name, last_name, email, city, price, selectedCategory, postimage.photo[0]);
			

		  await dispatch(
			registerNewAnnouncement({
			  title: formData.title,
			  first_name: formData.first_name,
			  last_name: formData.last_name,
			  email: formData.email,
			  city: formData.city,
			  description: formData.description,
			  price: formData.price,
			  category: selectedCategory,
			  photo: postimage.photo[0]
			})
		  );
	
		  setMessage('Объявление успешно создано!');
		} catch (error) {
		  console.error(error);
		  setMessage('Ошибка при создании объявления');
		}
	  };

    
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
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
			<h1>Создайте новое объявление</h1>
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
					<button className='btn btn-primary mt-4'>Создать объявление</button>
                    
				)}
			</form>
            <br /><br />
		</Layout>
	);
};

export default AnnouncementPage;
