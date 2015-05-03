'use strict';

// Rfqs controller
angular.module('rfqs').controller('RfqsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rfqs',
    function($scope, $stateParams, $location, Authentication, Rfqs) {
        $scope.authentication = Authentication;
        $scope.materialDescriptionArray = [];

        // Create new Rfq
        $scope.create = function() {
            // Create new Rfq object
            var rfq = new Rfqs({
                completeBy: this.completeBy,
                quoteType: this.quoteType,
                notes: this.notes,
                materialDescriptions: $scope.materialDescriptionArray
            });

            // Redirect after save
            rfq.$save(function(response) {
                $location.path('rfqs/' + response._id);

                // Clear form fields
                $scope.completeBy = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Rfq
        $scope.remove = function(rfq) {
            if (rfq) {
                rfq.$remove();

                for (var i in $scope.rfqs) {
                    if ($scope.rfqs[i] === rfq) {
                        $scope.rfqs.splice(i, 1);
                    }
                }
            } else {
                $scope.rfq.$remove(function() {
                    $location.path('rfqs');
                });
            }
        };

        // Update existing Rfq
        $scope.update = function() {
            var rfq = $scope.rfq;

            rfq.$update(function() {
                $location.path('rfqs/' + rfq._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Rfqs
        $scope.find = function() {
            $scope.rfqs = Rfqs.query();
        };

        // Find existing Rfq
        $scope.findOne = function(page) {
            if (page === 'editRfq') {
                var rfq = Rfqs.get({
                    rfqId: $stateParams.rfqId
                }, function(rfq) {
                    $scope.rfq = rfq;
                    $scope.materialDescriptionArray = rfq.materialDescriptions;
                });
            } else {
                $scope.rfq = Rfqs.get({
                    rfqId: $stateParams.rfqId
                });
            }
        };

        // Init array of material descriptions for edit-rfq page 
        $scope.initEditRfq = function() {

        };

        $scope.addToDescriptionListOnEnter = function(keyEvent) {
            if (keyEvent.which === 13) {
                $scope.addToDescriptionList();
            }
        };

        $scope.removeFromDescriptionList = function(listItem) {
            $scope.materialDescriptionArray.splice($scope.materialDescriptionArray.indexOf(listItem), 1);
        };

        //Handles the generation of list of user inputed descriptions 
        $scope.addToDescriptionList = function() {
            var material = {};
            var descriptor;
            var value;

            if (this.materialDescriptor !== undefined && this.materialValue !== undefined) {
                descriptor = this.materialDescriptor.trim();
                value = this.materialValue.trim();

                if (descriptor.length !== 0 && this.materialValue.length !== 0) {
                    material = {
                        descriptor: descriptor.charAt(0).toUpperCase() + descriptor.slice(1),
                        value: value
                    };
                    $scope.materialDescriptionArray.push(material);
                    this.materialDescriptor = '';
                    this.materialValue = '';
                    $scope.descriptionError = null;
                    document.getElementById('materialDescriptor').focus();
                } else {
                    if (descriptor.length === 0 && value.length === 0) {
                        $scope.descriptionError = 'Enter a descriptor and value';
                    } else if (descriptor.length === 0) {
                        $scope.descriptionError = 'Enter a descriptor';
                    } else {
                        $scope.descriptionError = 'Enter a value';
                    }
                }
            } else {
                if (this.materialDescriptor === undefined && this.materialValue === undefined) {
                    $scope.descriptionError = 'Enter a descriptor and value';
                } else if (this.materialDescriptor === undefined) {
                    $scope.descriptionError = 'Enter a descriptor';
                } else {
                    $scope.descriptionError = 'Enter a value';
                }
            }
        };
    }
]);
