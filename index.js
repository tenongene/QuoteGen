const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
require('dotenv').config();
const pexels = require('pexels');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//to generate random index numbers from json object returned from API calls
//H5WWuymHTefZOVCzmNBBIF9tCz7uSPYx7z0Rvpm2hgYwKp2u325kyOep
function randomIndex(max) {
	return Math.floor(Math.random() * max);
}

const app = express();
app.listen(process.env.PORT, () => {
	console.log(`QuoteGen is listening on port ${process.env.PORT}....`);
});
app.set('view engine', 'ejs');
app.use(express.static('assets'));
app.use(bodyParser.json());

//API Urls
const url_pic = `https://api.pexels.com/v1/search?query=nature&per_page=80&page=${randomIndex(100)}`;
const url = 'https://zenquotes.io/api/random';

//Get route with sequential ajax calls for quote and image
app.get('/', (req, res, next) => {
	fetch(url, { method: 'GET' })
		.then((response) => response.json())
		.then((json) => {
			const quote = json[0].q;
			const author = json[0].a;
			console.log(quote);
			console.log(author);

			const client = pexels.createClient(process.env.API_KEY);
			const query = 'Nature';
			client.photos
				.search({ query, per_page: `${randomIndex(100)}` })
				.then((photos) => {
					const picture = photos.photos[`${randomIndex(99)}`];
					const alt = picture.alt;
					console.log(picture, alt);
					res.render('index', { quote, author, picture: picture.src.large, alt });
				})
				.catch((err) => console.log(err.message));
		})
		.catch((err) => console.log(err.message));
});
