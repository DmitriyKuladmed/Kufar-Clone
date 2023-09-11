import axios from 'axios';

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post('/api/token/refresh/', {
      refreshToken,
    });

    const newAccessToken = response.data.access;

    return newAccessToken;
  } catch (error) {

    throw error;
  }
};

export default refreshAccessToken;