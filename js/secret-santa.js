angular.module("SecretSanta", []).controller("SecretSantaController",
    function SecretSantaController($scope, $http) {

        $scope.persons = [
            {id: 'person1'},
            {id: 'person2'},
            {id: 'person3'},
            {id: 'person4'}
        ];

        $scope.results = [];
        $scope.formErrors = false;
        $scope.emailMessage = "";
        $scope.success = false;

        $scope.addNewPersons = function() {
            var newItemNo = $scope.persons.length + 1;
            $scope.persons.push({ 'id': 'persons' + newItemNo });
        };

        $scope.removePersons = function() {
            if ($scope.persons.length > 2) {
                var lastItem = $scope.persons.length-1;
                $scope.persons.splice(lastItem);
            }
        };

        $scope.resetForm = function() {
            $scope.persons = [
                {id: 'person1'},
                {id: 'person2'},
                {id: 'person3'},
                {id: 'person4'}
            ];

            $scope.results = [];
            $scope.formErrors = false;
            $scope.emailMessage = "";
            $scope.success = false;
        };

        $scope.getRandomArray = function(maxNumber) {
            var randomArray = [];
            for (i=0; i < maxNumber; i++) {
                do {
                    var randomValue = Math.floor((Math.random() * maxNumber));
                } while((randomValue == i) || (randomArray.indexOf(randomValue) > -1));
                randomArray[i] = randomValue;
            }
            return randomArray;
        }

        $scope.sendMail = function(data) {
            var mailJSON = {
                "key": "",
                "message": {
                    "html": data.mailBody,
                    "text": data.mailBody,
                    "subject": data.subject,
                    "from_email": "noreply@privatesanta.com",
                    "from_name": "Secret Santa",
                    "to": [
                        {
                          "email": data.toEmail,
                          "name": data.name,
                          "type": "to"
                        }
                    ],
                    "important": false,
                    "track_opens": null,
                    "track_clicks": null,
                    "auto_text": null,
                    "auto_html": null,
                    "inline_css": null,
                    "url_strip_qs": null,
                    "preserve_recipients": null,
                    "view_content_link": null,
                    "tracking_domain": null,
                    "signing_domain": null,
                    "return_path_domain": null
                },
                "async": false,
                "ip_pool": "Main Pool"
            };
            var apiURL = "https://mandrillapp.com/api/1.0/messages/send.json";
            $http.post(apiURL, mailJSON).success(function(data, status, headers, config) {
                console.log('Successful email send.');
            }).error(function(data, status, headers, config) {
                console.log('Error Sending Email.');
                console.log('Status: ' + status);
            });
        };

        $scope.calculateRandomUsers = function() {
            $scope.formErrors = false;
            if ($scope.submitResults.$invalid == true) {
                $scope.formErrors = true;

                // Scroll where are the errors
                $('html,body').animate({
                    scrollTop: $("#step-2").offset().top},
                    'slow'
                );

                return;
            }
            var auxPersonsArray = $scope.persons.slice();
            var maxValue = $scope.persons.length;
            var result_name;
            var email;
            var couple;

            var auxRandomArray = $scope.getRandomArray(auxPersonsArray.length);

            for (i=0; i < auxPersonsArray.length; i++) {
                result_name = auxPersonsArray[i].name;
                randomIndex = auxRandomArray[i];
                email = auxPersonsArray[randomIndex].email;

                couple = [result_name, email];
                $scope.results.push(couple);
            }
            //Send an email with the result to each person
            for (i = 0; i < $scope.results.length; i++) {
                nameResult = $scope.results[i][0];
                emailResult = $scope.results[i][1];

                var mailBody = "Congratulations! Your secret friend is: " + nameResult;
                if ($scope.emailMessage != "") {
                    mailBody = mailBody.concat(". You received this message: " + $scope.emailMessage);
                }

                dataResult = {
                    "toEmail": emailResult,
                    "mailBody": mailBody,
                    "subject": "Secret Santa Results"
                };

                $scope.sendMail(dataResult);
            }

            $scope.resetForm();
            $scope.success = true;
            window.scrollTo(0, 0);
            $('#successModal').modal('show');
        };
    }
);
