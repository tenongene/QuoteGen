const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

app.get('/', (req, res) => {
	const url = 'https://zenquotes.io/api/random';
	const url_pic = `https://api.pexels.com/v1/search?query=nature&per_page=80&page=${randomIndex(100)}`;
	fetch(url, { method: 'GET' })
		.then((response) => response.json())
		.then((json) => {
			res.render('index', { quote: json[0].q, author: json[0].a });
			console.log(json[0].q, json[0].a);
		})
		.catch((err) => console.error('error:' + err));

	fetch(url_pic, { method: 'GET' })
		.then((response) => response.json())
		.then((json) => {
			res.render('index', { photo: json.photos[randomIndex(79)].src.large2x });
		})
		.catch((err) => console.error('error:' + err));
});
