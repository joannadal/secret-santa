angular.module("SecretSanta", []).controller("SecretSantaController",
    function SecretSantaController($scope, $http) {

        $scope.persons = [
            {id: 'person1'},
            {id: 'person2'},
            {id: 'person3'},
            {id: 'person4'}
        ];

        $scope.results = [];
        $scope.success = false;

        $scope.addNewPersons = function() {
            var newItemNo = $scope.persons.length + 1;
            $scope.persons.push({ 'id': 'persons' + newItemNo });
            $scope.persons.push({ 'id': 'persons' + newItemNo+1 });
        };

        $scope.removePersons = function() {
            if ($scope.persons.length > 2) {
                var lastItem = $scope.persons.length-1;
                $scope.persons.splice(lastItem);
                $scope.persons.splice(lastItem-1);
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
            $scope.success = false;
        };

        $scope.sendMail = function(data) {
            var mailJSON = {
                "key": "",
                "message": {
                    "html": data.mailBody,
                    "text": data.mailBody,
                    "subject": data.subject,
                    "from_email": "noreply@secretsanta.com",
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
            if ($scope.persons.length % 2 !== 0) {
                alert("You have to use an even number of persons");
                return;
            }
            var auxPersonsArray = $scope.persons.slice();
            var maxValue = $scope.persons.length;
            var person1;
            var person2;
            var couple;
            while (auxPersonsArray.length > 2) {
                // Get Person1
                var randomValue = Math.floor((Math.random() * maxValue));
                person1 = auxPersonsArray[randomValue];
                auxPersonsArray.splice(randomValue, 1);

                maxValue = auxPersonsArray.length;

                // Get Person2
                randomValue = Math.floor((Math.random() * maxValue));
                person2 = auxPersonsArray[randomValue];
                auxPersonsArray.splice(randomValue, 1);

                couple = [person1, person2];
                $scope.results.push(couple);
            }
            //Group the last two persons
            if (auxPersonsArray.length === 2) {
                person1 = auxPersonsArray[0];
                auxPersonsArray.splice(0, 1);

                person2 = auxPersonsArray[0];
                auxPersonsArray.splice(0, 1);

                couple = [person1, person2];
                $scope.results.push(couple);
            }
            //Send an email with the result to each person
            for (i = 0; i < $scope.results.length; i++) {
                namePerson1 = $scope.results[i][0].name;
                emailPerson1 = $scope.results[i][0].email;
                namePerson2 = $scope.results[i][1].name;
                emailPerson2 = $scope.results[i][1].email;

                dataPerson1 = {
                    "toEmail": emailPerson1,
                    "mailBody": "Congratulations! Your secret friend is: " + namePerson2,
                    "subject": "Secret Santa Results"
                };

                dataPerson2 = {
                    "toEmail": emailPerson2,
                    "mailBody": "Congratulations! Your secret friend is: " + namePerson1,
                    "subject": "Secret Santa Results"
                };

                $scope.sendMail(dataPerson1);
                $scope.sendMail(dataPerson2);
            }

            $scope.results = [];
            $scope.success = true;
        };
    }
);
