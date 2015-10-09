/*jshint newcap: false */

'use strict';

Polymer({
	is: 'attribute-rule',
	properties: {
		attributeName: {
			type: String,
			value: "value"
		},
		attributeUnit: {
			type: String,
			value: ""
		},
		payloadAttribute: {
			type: Number,
			value: 0,
			observer: '_observeVibration'
		},
		attributeLimit: {
			type: Number,
			value: 10
		},
		payload: {
			type: Object,
			value: function() {
				return {};
			},
			observer: '_observePayload'
		},
		metadata: {
			type: Array,
			value: function() {
				return [];
			},
			observer: '_observeMetadata'
		},
		triggerWarning: {
			type: Boolean,
			value: false,
			notify: true
		}
	},
	_observeMetadata: function(newValue) {
		if (newValue) {
			this.attributeName = this.metadata.shortName ? this.metadata.shortName : this.metadata.name;
			this.attributeUnit = this.metadata.unit;
		}
	},
	_observePayload: function(newValue) {
		if (newValue && this.metadata) {
			this.payloadAttribute = newValue[this.metadata.field];
		}
	},
	_observeVibration: function(newValue) {
		if (newValue) {
			this.triggerWarning = this.payloadAttribute > this.attributeLimit;
		}
	},
	_handleTapMinus: function() {
		this.attributeLimit-=1;
		if (this.attributeLimit < 0){
			this.attributeLimit = 0;
		}
		// Fire an event to notify external code that the attribute limit has changed.
		this.fire('attribute-limit-updated', {attributeLimit: this.attributeLimit});
	},
	_handleTapSum: function() {
		if (!this.attributeLimit){
			this.attributeLimit = 0;
		}
		this.attributeLimit = parseInt(this.attributeLimit) + 1;
		// Fire an event to notify external code that the attribute limit has changed.
		this.fire('attribute-limit-updated', {attributeLimit: this.attributeLimit});
	}
});
