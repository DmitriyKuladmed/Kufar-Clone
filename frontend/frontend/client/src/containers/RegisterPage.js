import { useState } from 'react';
import Layout from 'components/Layout';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from 'features/user';

const RegisterPage = () => {
	const dispatch = useDispatch();
	const { registered, loading } = useSelector(state => state.user);

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		password: '',
	});

	const { first_name, last_name, email, phone, password } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();
		console.log(first_name, last_name, email, phone, password);
		
		dispatch(register({ first_name, last_name, email, phone, password }));
	};

	if (registered) return <Navigate to='/login' />;

	return (
		<Layout title='Kuvar | Register' content='Register page'>
			<h1>Зарегистрируйте свою учетную запись</h1>
			<form className='mt-5' onSubmit={onSubmit}>
				<div className='form-group'>
					<label className='form-label' htmlFor='first_name'>
						Имя
					</label>
					<input
						className='form-control'
						type='text'
						name='first_name'
						onChange={onChange}
						value={first_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='last_name'>
						Фамилия
					</label>
					<input
						className='form-control'
						type='text'
						name='last_name'
						onChange={onChange}
						value={last_name}
						required
					/>
				</div>
				<div className='form-group mt-3'>
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
				<div className='form-group'>
					<label className='form-label' htmlFor='phone'>
						Номер телефона:
					</label>
					<input
						className='form-control'
						type='text'
						name='phone'
						onChange={onChange}
						value={phone}
						required
					/>
				</div>
				<div className='form-group mt-3'>
					<label className='form-label' htmlFor='password'>
						Password
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
					<button className='btn btn-primary mt-4'>Зарегестрироваться</button>
				)}
			</form>
		</Layout>
	);
};

export default RegisterPage;
