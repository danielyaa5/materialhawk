'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rfq = mongoose.model('Rfq'),
	_ = require('lodash');

/**
 * Create a Rfq
 */
exports.create = function(req, res) {
	var rfq = new Rfq(req.body);
	rfq.user = req.user;

	rfq.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rfq);
		}
	});
};

/**
 * Show the current Rfq
 */
exports.read = function(req, res) {
	res.jsonp(req.rfq);
};

/**
 * Update a Rfq
 */
exports.update = function(req, res) {
	var rfq = req.rfq ;

	rfq = _.extend(rfq , req.body);

	rfq.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rfq);
		}
	});
};

/**
 * Delete an Rfq
 */
exports.delete = function(req, res) {
	var rfq = req.rfq ;

	rfq.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rfq);
		}
	});
};

/**
 * List of Rfqs
 */
exports.list = function(req, res) { 
	Rfq.find().sort('-created').populate('user', 'displayName').exec(function(err, rfqs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rfqs);
		}
	});
};

/**
 * Rfq middleware
 */
exports.rfqByID = function(req, res, next, id) { 
	Rfq.findById(id).populate('user', 'displayName').exec(function(err, rfq) {
		if (err) return next(err);
		if (! rfq) return next(new Error('Failed to load Rfq ' + id));
		req.rfq = rfq ;
		next();
	});
};

/**
 * Rfq authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rfq.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
