import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';
import styles from '../containers/homepage.css';

const Navbar = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useSelector(state => state.user);

	const authLinks = (
		<>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/dashboard'>
					Аккаунт
				</NavLink>
			</li>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/announcement'>
				<button
					className='create-ad-button'>
					+ Подать объявление
					</button>
				</NavLink>
			</li>
			<li className='nav-item'>
				<a className='nav-link' href='/login' onClick={() => dispatch(logout())}>
					Выйти из аккаунта
				</a>
			</li>
		</>
	);

	const guestLinks = (
		<>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/login'>
					Авторизация
				</NavLink>
			</li>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/register'>
					Регистрация
				</NavLink>
			</li>
		</>
	);

	return (
		<nav className='navbar navbar-expand-lg bg-light'>
			<div className='container-fluid'>
				<Link className='navbar-brand' to='/'>
					Kuvar
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/'>
								Главная
							</NavLink>
						</li>
						{isAuthenticated ? authLinks : guestLinks}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
