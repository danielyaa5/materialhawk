'use strict';

// Rfqs controller
angular.module('rfqs').controller('RfqsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Rfqs',
    function($scope, $http, $stateParams, $location, Authentication, Rfqs) {
        $scope.authentication = Authentication;
        $scope.materialObjects = [];
        $scope.amlTags = [];

        $http.get('modules/rfqs/resources/metals.json').success(function(data) {
            $scope.data = data;
        });

        $scope.removeAllMaterials = function() {
            $scope.materialObjects = [];
        }

        $scope.removeMaterial = function(material) {
            $scope.materialObjects.splice($scope.materialObjects.indexOf(material), 1);
        };

        $scope.addMaterial = function() {
            $scope.materialObjects.push({
                metal: $scope.selectedMetal,
                grade: $scope.selectedGrade
            });
        };

      
        // Create new Rfq
        $scope.create = function() {
            // Create new Rfq object
            var rfq = new Rfqs({
                nickname: this.nickname,
                completeBy: this.completeBy,
                quoteType: this.quoteType,
                notes: this.notes,
                privacy: this.privacy,
                amlTags: this.amlTags
            });

            // Redirect after save
            rfq.$save(function(response) {
                $location.path('rfqs/' + response._id);

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
                    $scope.amlTags = rfq.amlTags;
                });
            } else {
                $scope.rfq = Rfqs.get({
                    rfqId: $stateParams.rfqId
                });
            }
        };

    }
]);
