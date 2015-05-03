'use strict';

//Setting up route
angular.module('rfqs').config(['$stateProvider',
	function($stateProvider) {
		// Rfqs state routing
		$stateProvider.
		state('listRfqs', {
			url: '/rfqs',
			templateUrl: 'modules/rfqs/views/list-rfqs.client.view.html'
		}).
		state('createRfq', {
			url: '/rfqs/create',
			templateUrl: 'modules/rfqs/views/create-rfq.client.view.html'
		}).
		state('viewRfq', {
			url: '/rfqs/:rfqId',
			templateUrl: 'modules/rfqs/views/view-rfq.client.view.html'
		}).
		state('editRfq', {
			url: '/rfqs/:rfqId/edit',
			templateUrl: 'modules/rfqs/views/edit-rfq.client.view.html'
		});
	}
]);

angular.module('rfqs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'My RFQs', 'rfqs', 'item', '/rfqs', false, null, 0);
	}
]);