'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rfq = mongoose.model('Rfq'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rfq;

/**
 * Rfq routes tests
 */
describe('Rfq CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Rfq
		user.save(function() {
			rfq = {
				name: 'Rfq Name'
			};

			done();
		});
	});

	it('should be able to save Rfq instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rfq
				agent.post('/rfqs')
					.send(rfq)
					.expect(200)
					.end(function(rfqSaveErr, rfqSaveRes) {
						// Handle Rfq save error
						if (rfqSaveErr) done(rfqSaveErr);

						// Get a list of Rfqs
						agent.get('/rfqs')
							.end(function(rfqsGetErr, rfqsGetRes) {
								// Handle Rfq save error
								if (rfqsGetErr) done(rfqsGetErr);

								// Get Rfqs list
								var rfqs = rfqsGetRes.body;

								// Set assertions
								(rfqs[0].user._id).should.equal(userId);
								(rfqs[0].name).should.match('Rfq Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rfq instance if not logged in', function(done) {
		agent.post('/rfqs')
			.send(rfq)
			.expect(401)
			.end(function(rfqSaveErr, rfqSaveRes) {
				// Call the assertion callback
				done(rfqSaveErr);
			});
	});

	it('should not be able to save Rfq instance if no name is provided', function(done) {
		// Invalidate name field
		rfq.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rfq
				agent.post('/rfqs')
					.send(rfq)
					.expect(400)
					.end(function(rfqSaveErr, rfqSaveRes) {
						// Set message assertion
						(rfqSaveRes.body.message).should.match('Please fill Rfq name');
						
						// Handle Rfq save error
						done(rfqSaveErr);
					});
			});
	});

	it('should be able to update Rfq instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rfq
				agent.post('/rfqs')
					.send(rfq)
					.expect(200)
					.end(function(rfqSaveErr, rfqSaveRes) {
						// Handle Rfq save error
						if (rfqSaveErr) done(rfqSaveErr);

						// Update Rfq name
						rfq.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rfq
						agent.put('/rfqs/' + rfqSaveRes.body._id)
							.send(rfq)
							.expect(200)
							.end(function(rfqUpdateErr, rfqUpdateRes) {
								// Handle Rfq update error
								if (rfqUpdateErr) done(rfqUpdateErr);

								// Set assertions
								(rfqUpdateRes.body._id).should.equal(rfqSaveRes.body._id);
								(rfqUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rfqs if not signed in', function(done) {
		// Create new Rfq model instance
		var rfqObj = new Rfq(rfq);

		// Save the Rfq
		rfqObj.save(function() {
			// Request Rfqs
			request(app).get('/rfqs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rfq if not signed in', function(done) {
		// Create new Rfq model instance
		var rfqObj = new Rfq(rfq);

		// Save the Rfq
		rfqObj.save(function() {
			request(app).get('/rfqs/' + rfqObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rfq.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rfq instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rfq
				agent.post('/rfqs')
					.send(rfq)
					.expect(200)
					.end(function(rfqSaveErr, rfqSaveRes) {
						// Handle Rfq save error
						if (rfqSaveErr) done(rfqSaveErr);

						// Delete existing Rfq
						agent.delete('/rfqs/' + rfqSaveRes.body._id)
							.send(rfq)
							.expect(200)
							.end(function(rfqDeleteErr, rfqDeleteRes) {
								// Handle Rfq error error
								if (rfqDeleteErr) done(rfqDeleteErr);

								// Set assertions
								(rfqDeleteRes.body._id).should.equal(rfqSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rfq instance if not signed in', function(done) {
		// Set Rfq user 
		rfq.user = user;

		// Create new Rfq model instance
		var rfqObj = new Rfq(rfq);

		// Save the Rfq
		rfqObj.save(function() {
			// Try deleting Rfq
			request(app).delete('/rfqs/' + rfqObj._id)
			.expect(401)
			.end(function(rfqDeleteErr, rfqDeleteRes) {
				// Set message assertion
				(rfqDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rfq error error
				done(rfqDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rfq.remove().exec();
		done();
	});
});