'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Rfq Schema
 */
var RfqSchema = new Schema({
	completeBy: {
		type: String,
		default: '',
		required: 'Please fill the complete by date',
		trim: true
	},
	quoteType: {
		type: String,
		default: '',
		required: 'Please choose a quote type'
	},
	deliveryRequirements: {
		type: String,
		default: ''
	},
	notes: {
		type: String,
		default: ''
	},
	materialDescriptions: {
		type: Array,
		default: []
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Rfq', RfqSchema);