'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rfqs = require('../../app/controllers/rfqs.server.controller');
	var upload = require('../../app/controllers/fileupload.server.controller');

	// Rfqs Routes
	app.route('/rfqs')
		.get(rfqs.list)
		.post(users.requiresLogin, rfqs.create);

	app.route('/rfqs/:rfqId')
		.get(rfqs.read)
		.put(users.requiresLogin, rfqs.hasAuthorization, rfqs.update)
		.delete(users.requiresLogin, rfqs.hasAuthorization, rfqs.delete);

	app.route('/rfqs/upload')
		.post(upload.fileUpload);

	// Finish by binding the Rfq middleware
	app.param('rfqId', rfqs.rfqByID);
};
