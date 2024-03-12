import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API_URL } from 'config';
const cookie = require('cookie');

export const register = createAsyncThunk(
	'users/register',
	async ({ first_name, last_name, email, phone, password }, thunkAPI) => {
		const body = JSON.stringify({
			first_name,
			last_name,
			email,
			phone,
			password,
		});
		

		try {
			const res = await fetch('/api/users/register', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					credentials: 'same-origin',
				},
				body,
			});

			const data = await res.json();

			if (res.status === 201) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

const getUser = createAsyncThunk('users/me', async (_, thunkAPI) => {
	
	try {
		const res = await fetch('/api/users/me', {
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


export const login = createAsyncThunk(
	'users/login',
	async ({ email, password }, thunkAPI) => {
		const body = JSON.stringify({
			email,
			password,
		});
		

		try {
			
			const res = await fetch('/api/users/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
			});
			const data = await res.json();
			
			
			if (res.status === 200) {
				const { dispatch } = thunkAPI;

				if (data.access && data.refresh) {
					localStorage.setItem('accessToken', data.access);
					localStorage.setItem('refreshToken', data.refresh);
					localStorage.setItem('userData', JSON.stringify(data));
				  }

				dispatch(getUser());
				
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

export const checkAuth = createAsyncThunk(
	'users/verify',
	async (_, thunkAPI) => {

		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');
		
		const body = JSON.stringify({
			"token": accessToken,
		});
			const res = await fetch(`${API_URL}/api/users/verify/`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					credentials: 'include',
				},
				body,
	});
		const data = await res.json();
		if (res.status === 200) {
			const { dispatch } = thunkAPI;

			dispatch(getUser());
			
			return data;
		} else {
			logout();;
		}
	}
  );

export const logout = createAsyncThunk('users/logout', async (_, thunkAPI) => {
	try {
		const res = await fetch('/api/users/logout', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				credentials: 'include',
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



const initialState = {
	isAuthenticated: false,
	user: {},
	loading: false,
	registered: false,
};


const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetRegistered: state => {
			state.registered = false;
		},
	},
	
	extraReducers: builder => {
		builder
			.addCase(register.pending, state => {
				state.loading = true;
			})
			.addCase(register.fulfilled, state => {
				state.loading = false;
				state.registered = true;
			})
			.addCase(register.rejected, state => {
				state.loading = false;
			})
			.addCase(login.pending, state => {
				state.loading = true;
			})
			.addCase(login.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, state => {
				state.loading = false;
			})
			.addCase(getUser.pending, state => {
				state.loading = true;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(getUser.rejected, state => {
				state.loading = false;
			})
			.addCase(checkAuth.pending, state => {
				state.loading = true;
			})
			.addCase(checkAuth.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = true;
			})
			.addCase(checkAuth.rejected, state => {
				state.loading = false;
			})
			.addCase(logout.pending, state => {
				state.loading = true;
			})
			.addCase(logout.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
			})
			.addCase(logout.rejected, state => {
				state.loading = false;
			});
	},
});

export const { resetRegistered } = userSlice.actions;
export default userSlice.reducer;

