module.exports = function(mongoose){
	var crypto = require('crypto');
	var UserSchema = new mongoose.Schema({
		uid:		{ type: String, unique: true },
		password:	{ type: String },
		avatar: 	{ type: String },
		photo_url:	{ type: String },
		location:	{ type: String },
		sex:		{ type: Number },
		reg_time:	{ type: Date},
		contacts:	{ type: [] }
	});

	var User = mongoose.model('User',UserSchema);

	/*
		{
			'name': 'findByUid',
			'param': {
				'uid': 'id for search'
			},
			'callback': {
				'doc': 'user object'
			}
		}
	*/
	var findByUid = function(uid,callback){
		User.findOne({uid: uid},function (err,doc) {
			callback(doc);
		});
	};

	/*
		{
			'name': 'regUid',
			'param': {
				'uid': 'id for reg',
				'password': 'password',
				'avatar': 'nickname',
				'location': 'city',
				'sex': 'sex'
			},
			'callback': {
				'isSucc': 'ture or false'
			}
		}
	*/
	var regUid = function(uid, password, avatar, location,sex,callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
	
		console.log('Try to regUid: ' + uid);
	
		var user = new User({
			uid:		uid,
			password:	shaSum.digest('hex'),
			avatar:		avatar,
			location:	location,
			sex:		sex
		});
	
		user.save(function(err){
			if(!err){

				return callback(true);

			}else{

				return callback(false);

			}
		});

		console.log('Save command was sent');
	};

	/*
		{
			'name': 'validPassword',
			'param': {
				'uid': 'id for valid',
				'password': 'password for check'
			},
			'callback': {
				'doc': 'user object'
			}
		}
	*/
	var validPassword = function(uid, password, callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		User.findOne( { uid: uid, password: shaSum.digest('hex') }, function(err, doc){
	  		callback(doc);
		});
	};
  
	/*
		{
			'name': 'isExist',
			'param': {
				'uid': 'id for judge',
			},
			'callback': {
				'doc': 'user object'
			}
		}
	*/
	var isExist = function(uid, callback){
		User.findOne( { uid: uid }, function(err, doc){
			callback(doc);
		});
	};

	/*
		{
			'name': 'addContacts',
			'param': {
				'uid': 'id for valid',
				'person_uid': 'contact uid for add',
				'person_avatar': 'contact avatar'
			},
			'callback': {
				'doc': 'user object'
			}
		}
	*/
	var addContacts = function(uid,person_uid,person_avatar,callback){
		User.findOne( { uid: uid }, function(err,doc){
			doc.contacts.push({
				uid: person_uid,
				avatar: person_avatar
			});

			User.update( { _id: doc._id },{ $set: {contacts: doc.contacts}},function(err){
				console.log('update contacts..............!!!!');
			});

			User.findOne( { uid: person_uid }, function(err,person_doc){
				person_doc.contacts.push({
					uid: uid,
					avatar: doc.avatar
				});

				User.update( { _id: person_doc._id }, {$set: {contacts: person_doc.contacts}},function(err){
					console.log('update person_doc...........~~~~');
				});
			})
			console.log(doc);
			callback(doc);
		});
	};

	return {
		addContacts: 	addContacts,
		findByUid:		findByUid,
		regUid:			regUid,
		validPassword:	validPassword,
		isExist:		isExist,
		User:			User
	}
}