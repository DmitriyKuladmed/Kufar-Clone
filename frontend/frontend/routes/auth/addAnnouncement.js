const express = require('express');
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

const router = express.Router();

router.post('/api/announcement', async (req, res) => {
	const { title, email, city, price, category } = req.body;

	const body = JSON.stringify({
		title,
		email,
		city,
		price,
        category
	});

	try {
		const apiRes = await fetch(`${process.env.API_URL}/api/announcement`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body,
		});

		const data = await apiRes.json();

		return res.status(apiRes.status).json(data);
	} catch (err) {
		return res.status(500).json({
			error: 'Что-то пошло не так при попытке регистрации...',
		});
	}
});

module.exports = router;
