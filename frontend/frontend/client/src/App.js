import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { checkAuth, refreshAccessToken } from 'features/user';


import HomePage from 'containers/HomePage';
import DashboardPage from 'containers/DashboardPage';
import LoginPage from 'containers/LoginPage';
import RegisterPage from 'containers/RegisterPage';
import AnnouncementPage from 'containers/AddAnnouncement';
import EditAnnouncement from './containers/EditAnnouncement';
import Chat from './containers/Chat'
import { createAsyncThunk } from '@reduxjs/toolkit';
import DetailPage from './containers/DetailPage';

const App = () => {

	useEffect(() => {
		let interval = setInterval(() => {
			checkAuth();
		}, 2000)
		return ()=> clearInterval(interval)
		
	  }, []);

	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/dashboard' element={<DashboardPage />} />
				<Route path='/announcement' element={<AnnouncementPage />} />
				<Route path='/chat/:Id' element={<Chat />} />
				<Route path="/:adId" element={<DetailPage />} />
				<Route path="/edit/:Id" element={<EditAnnouncement />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
			</Routes>
		</Router>
	);
};

export default App;
