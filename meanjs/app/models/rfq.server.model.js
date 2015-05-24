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
    nickname: {
        type: String,
        default: '',
        required: 'Please provide a nickname',
        trim: true
    },
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
    },
    privacy: {
    	type: String,
    	default: '',
    	required: 'Choose a privacy setting'
    },
    amlTags: {
        type: Array,
        default: '',
    }
});

mongoose.model('Rfq', RfqSchema);
