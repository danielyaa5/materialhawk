'use strict';

//Rfqs service used to communicate Rfqs REST endpoints
angular.module('rfqs').factory('Rfqs', ['$resource',
	function($resource) {
		return $resource('rfqs/:rfqId', { rfqId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);