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

        $scope.addToDescriptionListOnEnter = function(keyEvent) {
            if (keyEvent.which === 13) {
                $scope.addToDescriptionList();
            }
        };

        $scope.removeDescription = function(descriptionItem) {
            $scope.materialDescriptionArray.splice($scope.materialDescriptionArray.indexOf(descriptionItem), 1);
        };

        //Handles the generation of list of user inputed descriptions 
        $scope.addToDescriptionList = function() {
            var material = {};
            var name;
            var value;

            if (this.descriptionName !== undefined && this.descriptionValue !== undefined) {
                name = this.descriptionName.trim();
                value = this.descriptionValue.trim();

                if (name.length !== 0 && this.descriptionValue.length !== 0) {
                    material = {
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        value: value
                    };
                    $scope.materialDescriptionArray.push(material);
                    this.descriptionName = '';
                    this.descriptionValue = '';
                    $scope.descriptionError = null;
                    document.getElementById('descriptionName').focus();
                } else {
                    if (name.length === 0 && value.length === 0) {
                        $scope.descriptionError = 'Enter a descriptor and value';
                        document.getElementById('descriptionName').focus();
                    } else if (name.length === 0) {
                        $scope.descriptionError = 'Enter a descriptor';
                        document.getElementById('descriptionName').focus();
                    } else {
                        $scope.descriptionError = 'Enter a value';
                        document.getElementById('descriptionValue').focus();
                    }
                }
            } else {
                if (this.descriptionName === undefined && this.descriptionName === undefined) {
                    $scope.descriptionError = 'Enter a descriptor and value';
                    document.getElementById('descriptionName').focus();
                } else if (this.descriptionName === undefined) {
                    $scope.descriptionError = 'Enter a descriptor';
                    document.getElementById('descriptionName').focus();
                } else {
                    $scope.descriptionError = 'Enter a value';
                    document.getElementById('descriptionValue').focus();
                }
            }
        };
    }
]);
