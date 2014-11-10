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

	var findByUid = function(uid,callback){
		User.findOne({uid: uid},function (err,doc) {
			callback(doc);
		});
	};

	var regUid = function(P_uid, P_password, P_avatar, P_location,P_sex,callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(P_password);
	
		console.log('Try to regUid: ' + P_uid);
	
		var user = new User({
			uid:		P_uid,
			password:	shaSum.digest('hex'),
			avatar:	P_avatar,
			location:	P_location,
			sex:		P_sex
		});
	
		user.save(function(err){
			if(!err){
			return callback(true);
			};
		});

		console.log('Save command was sent');
	};

	var validPassword = function(P_uid, P_password, callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(P_password);
		User.findOne( { uid: P_uid, password: shaSum.digest('hex') }, function(err, doc){
	  		callback(doc);
		});
	};
  
	var isExist = function(P_uid, callback){
		User.findOne( { uid: P_uid }, function(err, doc){
			callback(doc);
		});
	};

	var addContacts = function(P_uid,P_person_uid,P_person_avatar,callback){
		User.findOne( { uid: P_uid }, function(err,doc){
			doc.contacts.push({
				uid: P_person_uid,
				avatar: P_person_avatar
			});

			User.update( { _id: doc._id },{ $set: {contacts: doc.contacts}},function(err){
				console.log('update contacts..............!!!!');
			});

			User.findOne( { uid: P_person_uid }, function(err,person_doc){
				person_doc.contacts.push({
					uid: P_uid,
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