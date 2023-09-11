import { createAsyncThunk } from '@reduxjs/toolkit';
import { Navigate } from 'react-router-dom';

export const registerNewAnnouncement = createAsyncThunk(
	'announcement/',
	async ({ title, first_name, last_name, email, city, description, price, category, photo }, thunkAPI) => {
		const formData = new FormData();
		
            formData.append('title', title);
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
			formData.append('email', email)
            formData.append('city', city);
			formData.append('description', description)
            formData.append('price', price);
            formData.append('category', category);
            formData.append('photo', photo);
		
			
		try {
			const res = await fetch('http://127.0.0.1:8000/add-image/', {
				method: 'POST',
				headers: {
        			
				},
				body: formData,
			});

			const data = await res.json();

			if (res.status === 200) {
				return <Navigate to="/dashboard" />;
			} else {

				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);


export const getAnnouncements = createAsyncThunk('announcements', async (_, thunkAPI) => {
	try {
		const res = await fetch('/api/announcement/', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			credentials: 'include',
		});
		
		const data = await res.json();

		if (res.status === 200) {

			return data;
		} else {
			return thunkAPI.rejectWithValue(data);
		}
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response.data);
	}
});


export const announcementDetail = createAsyncThunk('announcement/:adId', async (req, res) => {
	const adId = req.params.adId;
	
	try {
		const res = await fetch('/api/announcement/' + adId, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});
		
		const data = await res.json();

		if (res.status === 200) {

			return data;
		} else {
			return res.rejectWithValue(data);
		}
	} catch (err) {
		return res.rejectWithValue(err.response.data);
	}
});