// searchController.js
(function () {

    "use strict";

    angular.module("app-search")
        .controller("searchController", searchController);

    function searchController( $http ) {
        var contr = this;
        contr.Type = "Theft";
        contr.Zip = "75075";

        contr.SubmitType = [];
        contr.SubmitZip = [];

        contr.StartDate = new Date("07/07/2017");
        contr.EndDate = new Date("07/07/2017");

        contr.StartHour = 0;
        contr.EndHour = 23;
        contr.Span = 23;

        contr.errorMessage = "";
        


        contr.queryRes = function ( ) {
            contr.errorMessage = "";
            contr.result = [];

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

                }, function () {
                        contr.errormessage = "failed to load data from server.";
                }).finally(function () {

                });

        };


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
    }

})();