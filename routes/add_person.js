/*
	{
		"action": "/add_person",
		"param": {
			"token": "String",
			"person_uid": "String",
			"person_avatar": "String"
		},
		"return": {
			"status": "Number"
			"person": {
				"uid": "person uid",
				"avatar": "person avatar",
				"location": "person location",
				"sex": "person sex(Number)"
			}
		}
	}
*/
module.exports = function(app, models){

	var jwt = require('jwt-simple');
	var moment = require('moment');

	app.post('/add_person', function(req, res,next){
		console.log('url---->/add_person');

		var token = req.body.token;
		var person_uid = req.body.person_uid;
		var person_avatar = req.body.person_avatar;

		if (token) {

			try{
				var decoded = jwt.decode(token,app.get('jwtTokenSecret'));
				console.log(decoded);

				if (decoded.exp > Date.now()) {
					//Add code after here to process
					models.User.addContacts(decoded.iss,person_uid,person_avatar,function(person){
						console.log('in add_person.js, person:---->' + person);
						return res.json({
							status: 0,
							person: {
								uid: person.uid,
								avatar: person.avatar,
								location: person.location,
								sex: person.sex
							}
						});
					});

				}else{
					return res.json({
						status: 2,
						person: {}
					});
				}

			}catch(err){
				console.log('error:=---->' + err);
				return res.json({
					status: 1,
					person: {}
				});
			}

		}else{
			console.log('token == null');
			return res.json({
				status: 1,
				person: {}
			});
		}
	});
}