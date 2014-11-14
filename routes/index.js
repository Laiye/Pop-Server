module.exports = function(app, models){

	app.get('/', function(req, res,next){
		res.render('index',{ title: 'Pop-Server' });
	});
};
