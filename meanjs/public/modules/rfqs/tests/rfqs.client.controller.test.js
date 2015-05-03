'use strict';

(function() {
	// Rfqs Controller Spec
	describe('Rfqs Controller Tests', function() {
		// Initialize global variables
		var RfqsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Rfqs controller.
			RfqsController = $controller('RfqsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rfq object fetched from XHR', inject(function(Rfqs) {
			// Create sample Rfq using the Rfqs service
			var sampleRfq = new Rfqs({
				name: 'New Rfq'
			});

			// Create a sample Rfqs array that includes the new Rfq
			var sampleRfqs = [sampleRfq];

			// Set GET response
			$httpBackend.expectGET('rfqs').respond(sampleRfqs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rfqs).toEqualData(sampleRfqs);
		}));

		it('$scope.findOne() should create an array with one Rfq object fetched from XHR using a rfqId URL parameter', inject(function(Rfqs) {
			// Define a sample Rfq object
			var sampleRfq = new Rfqs({
				name: 'New Rfq'
			});

			// Set the URL parameter
			$stateParams.rfqId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rfqs\/([0-9a-fA-F]{24})$/).respond(sampleRfq);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rfq).toEqualData(sampleRfq);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rfqs) {
			// Create a sample Rfq object
			var sampleRfqPostData = new Rfqs({
				name: 'New Rfq'
			});

			// Create a sample Rfq response
			var sampleRfqResponse = new Rfqs({
				_id: '525cf20451979dea2c000001',
				name: 'New Rfq'
			});

			// Fixture mock form input values
			scope.name = 'New Rfq';

			// Set POST response
			$httpBackend.expectPOST('rfqs', sampleRfqPostData).respond(sampleRfqResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rfq was created
			expect($location.path()).toBe('/rfqs/' + sampleRfqResponse._id);
		}));

		it('$scope.update() should update a valid Rfq', inject(function(Rfqs) {
			// Define a sample Rfq put data
			var sampleRfqPutData = new Rfqs({
				_id: '525cf20451979dea2c000001',
				name: 'New Rfq'
			});

			// Mock Rfq in scope
			scope.rfq = sampleRfqPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rfqs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rfqs/' + sampleRfqPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rfqId and remove the Rfq from the scope', inject(function(Rfqs) {
			// Create new Rfq object
			var sampleRfq = new Rfqs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rfqs array and include the Rfq
			scope.rfqs = [sampleRfq];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rfqs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRfq);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rfqs.length).toBe(0);
		}));
	});
}());