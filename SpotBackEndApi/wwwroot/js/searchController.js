// searchController.js
(function () {

    "use strict";

    angular.module("app-search")
        .service('Map', function ($q) {

            this.init = function () {

                var uluru = { lat: 33.0597488, lng: -96.7552049 };

                var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                var options = {
                    center: uluru,
                    zoom: 12,
                } 

                this.map = new google.maps.Map(
                    document.getElementById("map"), options
                );

                var gmap = this.map;
                //var markers = new google.maps.Marker({
                //    position: uluru,
                //    map: this.map
                //});

                // Save this for future use.
                //var markers = locations.map(function (location, i) {
                //    return new google.maps.Marker({
                //        position: location,
                //        map: gmap,
                //        label: labels[i % labels.length]
                //    });
                //}); 


                var geocoder = new google.maps.Geocoder();

                //var infowindow = new google.maps.InfoWindow({
                //    content: ' haha ',
                //    position: uluru
                //});
                //infowindow.open(gmap);


                this.map.addListener('click', function (e) {

                    geocoder.geocode({
                        'latLng': e.latLng
                    }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                  //              contr.PointedAddress = results[0].formatted_address;
                                var infowindow = new google.maps.InfoWindow({
                                    content: results[0].formatted_address,
                                    position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
                                });
                                infowindow.open(gmap);

                            }
                        }
                    });
                });
            }

            this.search = function (str) {
                var d = $q.defer();
                this.places.textSearch({ query: str }, function (results, status) {
                    if (status == 'OK') {
                        d.resolve(results[0]);
                    }
                    else d.reject(status);
                });
                return d.promise;
            }


            this.addMarkers = function (marks) {
                if (marks.length > 0) {

                    for (var i = 0; i < marks.length; i++) {
                        marks[i].setMap(this.map);
                    }
                }
            }

            this.removeMarkers = function (marks) {
                if (marks.length > 0) {

                    for (var i = 0; i < marks.length; i++) {
                        marks[i].setMap(null);
                    }
                }
            }
    });



    angular.module("app-search")
        .controller("searchController", searchController);

    function searchController($http, Map) {
        var contr = this;
        contr.Type = "Theft";
        contr.Zip = "75075";
        contr.PointedAddress = null;

        contr.SubmitType = [];
        contr.SubmitZip = [];
        contr.result = [];
        contr.markers = [];


        contr.StartDate = new Date("07/07/2017");
        contr.EndDate = new Date("07/07/2017");

        contr.StartHour = 0;
        contr.EndHour = 23;
        contr.Span = 23;

        contr.errorMessage = "";
        

        /*
        $scope.maps = [
            { center: { lat: 43.6, lng: 4}, zoom: 10 }
        ];
        
        var myLatlng = new google.maps.LatLng(41.28, 2.18);
        var myOptions = {
            zoom: 13,
            center: myLatlng
        }
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        var geocoder = new google.maps.Geocoder();

        google.maps.event.addListener(map, 'click', function (event){
            geocoder.geocode({
                'latLng': event.latLng
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        contr.PointedZip = results[0];
                    }
                }

            });
        });  */

        

        contr.queryRes = function ( ) {
            contr.errorMessage = "";
            contr.result = [];

            // To do : clean previous marker
            Map.removeMarkers(contr.markers);
            contr.markers = [];

            var config = {
                params: {
                    Type: contr.SubmitType,
                    Zip: contr.SubmitZip,
                    StartDate: contr.StartDate,
                    EndDate: contr.EndDate,
                    StartHour: contr.StartHour,
                    EndHour: contr.EndHour
                }
            }

            $http.get('http://localhost:49848/api/', config )
                .then(function (response) {

                    contr.result = response.data;

                    // To do : generate new marker from result
                    contr.markers = contr.result.map(function (oneResult) {
                        var LatLng = {
                            lat: oneResult.latitude,
                            lng: oneResult.longitude
                        }
                        return new google.maps.Marker({ position: LatLng });
                    });

                    // To do : add marks into current map
                    Map.addMarkers( contr.markers );

                }, function () {
                        contr.errormessage = "failed to load data from server.";
                }).finally(function () {

                });
  
        };

        //contr.updateMap = function (Map) {
        //    Map.setOptions({
        //        center: { lat: -43.999792, lng: 170.463352 },
        //        zoom: 15
        //    });

        //    Map.addMarkers(contr.result);
        //}


        contr.removeType = function ($index) {
            contr.SubmitType.splice($index, 1);
        }

        contr.addType = function () {
            contr.SubmitType.push(contr.Type);
            contr.Type = null;
        }

        contr.removeZip = function ($index) {
            contr.SubmitZip.splice($index, 1);
        }

        contr.addZip = function () {
            contr.SubmitZip.push(contr.Zip);
            contr.Zip = null;
        }

        contr.hourAdj1 = function () {
            contr.EndHour = Math.min( contr.StartHour + contr.Span, 23);
        }
        contr.hourAdj2 = function () {
            if (contr.StartHour > contr.EndHour) {
                contr.StartHour = contr.EndHour;
            }
        }


        Map.init();
    }


    /*
    angular.module("app-search")
        .directive('gmaps', function facotry($timeout) {

            return {
                restrict: 'EA',
                template: '<div class="gmaps"></div>',
                replace: true,
                scope: {
                    center: '=center',
                    zoom: '=zoom'
                },
                link: function postLink(scope, iElement, iAttrs) {

                    var mapOptions = {
                        zoom: scope.zoom,
                        center: new google.maps.LatLng(scope.center.lat, scope.center.lng),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(iElement[0], mapOptions);

                    scope.$watch('center', function () {
                        map.setCenter(new google.maps.LatLng(
                            parseFloat(scope.center.lat),
                            parseFloat(scope.center.lng)
                        ));
                    }, true);

                    scope.$watch('zoom', function () {
                        map.setZoom(parseInt(scope.zoom));
                    });

                    google.maps.event.addListener(map, 'center_changed', function () {
                        $timeout(function () {
                            var center = map.getCenter();
                            scope.center.lat = center.lat();
                            scope.center.lng = center.lng();
                        });
                    });

                    google.maps.event.addListener(map, 'zoom_changed', function () {
                        $timeout(function () {
                            scope.zoom = map.getZoom();
                        });
                    });

                }
            }

        });   */
            
    
})();