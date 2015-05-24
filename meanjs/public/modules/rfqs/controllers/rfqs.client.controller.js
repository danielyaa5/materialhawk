'use strict';

// Rfqs controller
angular.module('rfqs').controller('RfqsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Rfqs',
    function($scope, $http, $stateParams, $location, Authentication, Rfqs) {
        $scope.authentication = Authentication;
        $scope.materialObjects = [];
        $scope.amlTags = [];

        //Angular UI Datepicker

        $scope.clear = function() {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        //Get JSON file for metals
        $http.get('modules/rfqs/resources/metals.json').success(function(data) {
            $scope.data = data;
        });

        // Watch for change in material selectors
        $scope.$watch('selectedMetal', function() {
            $scope.selectedSeries = '';
            $scope.selectedGrade = '';
            $scope.customGrade = false;
        });
        $scope.$watch('selectedSeries', function() {
            $scope.customGrade = false;
            $scope.selectedGrade = '';
        });

        // Material list functions
        $scope.removeAllMaterials = function() {
            $scope.materialObjects = [];
        };

        $scope.removeMaterial = function(material) {
            $scope.materialObjects.splice($scope.materialObjects.indexOf(material), 1);
        };

        $scope.addMaterial = function() {
            var selectedMetal = $scope.selectedMetal;
            var selectedSeries = $scope.selectedSeries;
            var selectedGrade = $scope.selectedGrade;


            if (selectedMetal && selectedGrade) {
                var newMaterial = {
                    metal: $scope.selectedMetal,
                    grade: $scope.selectedGrade
                };
                var duplicate = false;

                //check if material is already in list
                for (var i = $scope.materialObjects.length - 1; i >= 0; i--) {
                    if ($scope.materialObjects[i].metal === newMaterial.metal && $scope.materialObjects[i].grade === newMaterial.grade) {
                        duplicate = true;
                        $scope.addMaterialError = 'This material is already in your list';
                    }
                }

                //if material doesnt exist in list, add material
                if (!duplicate) {
                    //if custom grade option is on, reset selectedGrade and selectedSeries
                    if ($scope.customGrade) {
                        $scope.selectedSeries = '';
                        $scope.selectedGrade = '';
                        //return from custom grade option
                        $scope.customGrade = false;
                    }
                    $scope.materialObjects.push(newMaterial);
                    //reset error message
                    $scope.addMaterialError = '';
                }
            } else if (!selectedMetal) {
                $scope.addMaterialError = 'Please select a metal';
            } else if (!selectedSeries) {
                $scope.addMaterialError = 'Please select a grade series';
            } else {
                $scope.addMaterialError = 'Please select a grade';
            }
        };


        // Create new Rfq
        $scope.create = function() {
            // Create new Rfq object
            var rfq = new Rfqs({
                nickname: this.nickname,
                completeBy: this.dt,
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
