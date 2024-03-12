import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { resetRegistered, login } from 'features/user';
import Layout from 'components/Layout';

const LoginPage = () => {
	const dispatch = useDispatch();
	const { loading, isAuthenticated, registered } = useSelector(
		state => state.user
	);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	useEffect(() => {
		if (registered) dispatch(resetRegistered());
	}, [registered]);

	const { email, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();

		dispatch(login({ email, password }));
	};

	useEffect(() => {
		fetch('http://127.0.0.1:8000/api/user/')
		  .then(response => response.json())
		  .then(data => {
	  
			if (data.results.length > 0) {
				
			  const users = data.results.sort((a, b) => b.id - a.id);
			  
			  const highestIdUser = users[0];
	  
			  setFormData({
				...formData,
				email: highestIdUser.email,
				password: '',
			  });
			}
		  })
		  .catch(error => {
			console.error('Error fetching user data:', error);
		  });
	  }, []);
	
	if (isAuthenticated) return <Navigate to='/' />;

	return (
		<Layout title='Kuvar | Login' content='Login page'>
			<div className="form-container">
			<h1>Войдите в свой аккаунт</h1>
			<form className='mt-5' onSubmit={onSubmit}>
				<div className='form-group'>
					<label className='form-label' htmlFor='email'>
						Email
					</label>
					<input
						className='form-control'
						type='email'
						name='email'
						onChange={onChange}
						value={email}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='password'>
						Пароль
					</label>
					<input
						className='form-control'
						type='password'
						name='password'
						onChange={onChange}
						value={password}
						required
					/>
				</div>
				{loading ? (
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</div>
				) : (
					<button className='create-ad-button1'>Авторизация</button>
				)}
			</form>
			</div>
		</Layout>
	);
};

export default LoginPage;
