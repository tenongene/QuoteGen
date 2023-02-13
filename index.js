const express = require('express');
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

//to generate random index numbers from json object returned from API calls
function randomIndex(max) {
	return Math.floor(Math.random() * max);
}

const port = 7272;
const app = express();
app.listen(port, () => {
	console.log(`QuoteGen is listening on port ${port}....`);
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

			fetch(url_pic, { method: 'GET' })
				.then((response) => response.json())
				.then((json) => {
					const photo = json.photos[randomIndex(79)].src.large;
					const alt = json.photos[randomIndex(79)].src.alt;
					res.render('index', { quote, author, photo, alt });
				})
				.catch((err) => console.log(err.message));
		});
});
