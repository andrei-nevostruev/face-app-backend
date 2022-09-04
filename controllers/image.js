const Clarifai = require('clarifai'); // API For DETECT OBJECT ON FOTO AND VIDEO

const app = new Clarifai.App({
 apiKey: 'MYKEY'
});

const handleApiCall = (req, res) => {
	app.models.predict(
		Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Unable work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0].entries);
		})
		.catch(err => res.status(400).json('unable to get entires'))
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}