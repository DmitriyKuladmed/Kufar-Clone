import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 


const DashboardPage = () => {
	const { isAuthenticated, user, loading } = useSelector(state => state.user);
	const [userAnnouncements, setUserAnnouncements] = useState([]);
	
	useEffect(() => {
        if (isAuthenticated) {
			const emailQueryParam = user.email ? `?email=${user.email}` : '';
            axios.get('http://127.0.0.1:8000/user_announcements/' + emailQueryParam)
                .then(response => {
                    setUserAnnouncements(response.data['results']);
                })
                .catch(error => {
                    console.error('Error fetching user announcements:', error);
                });
        }
    }, [isAuthenticated]);

	const handleDeleteAnnouncement = (announcementId) => {
		axios.delete(`http://127.0.0.1:8000/api/announcement/${announcementId}`)
		  .then(response => {
			setUserAnnouncements(prevAnnouncements => prevAnnouncements.filter(a => a.id !== announcementId));
		  })
		  .catch(error => {
			console.error('Error deleting announcement:', error);
		  });
	  };

	if (loading){
		return <h1>Loading..</h1>
	} else if (isAuthenticated) {
		return (
			<Layout title='Kuvar | Аккаунт' content='Dashboard page'>
				{loading || user === null ? (
					<div className='spinner-border text-primary' role='status'>
						<span className='visually-hidden'>Загрузка...</span>
					</div>
				) : (
					<>
						<h2 style={{ textAlign: 'center' }} className='mb-4'>Данные Вашего аккаунта</h2>
						<div style={{textAlign:'center'}}>
							<h6>Имя: <u>{user.first_name}</u></h6>
							<h6>Фамилия: <u>{user.last_name}</u></h6>
							<h6>Email: <u>{user.email}</u></h6>
							<h6>Номер телефона: <u>{user.phone}</u></h6>
							<hr />
						</div>
						<h2>Мои объявления</h2>
						<div className="announcement-list">
							{userAnnouncements.map(announcement => (
                                <div style={{ textAlign: 'center' }} key={announcement.id} className="announcement-container">
								<img src={announcement.photo} style={{ height: '150px', width: '230px', display: 'block', margin: '0 auto' }} />
								<b>{announcement.title}.</b><br />
								<u>Цена: {announcement.price} бел. руб.</u>
								<p>Дата публикации: {announcement.publication_date}</p>
								<div className="button-row">
									<Link to={`/${announcement.id}`} key={announcement.id}>
									<button className="details-button">Детальнее</button>
									</Link> &nbsp;
									<Link to={`/edit/${announcement.id}`} key={`edit-${announcement.id}`}>
										<button style={{ backgroundColor: 'yellow', color: 'black' }} className="edit-button">
											🖊️
										</button>
										
									</Link>&nbsp;&nbsp;
									<button onClick={() => 
										handleDeleteAnnouncement(announcement.id)} style={{ backgroundColor: 'red', color: 'black' }} className="delete-button">
									Удалить
									</button>
								</div>
							  </div>
                            ))}
						</div>
						<br />
					</>
				)}
			</Layout>
		);
	} else {
		return <Navigate to='/login' />;
	}
	

};

export default DashboardPage;
