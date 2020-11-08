Feature: Test Client JSON API endpoint

    Scenario: Je peux créer plusieurs clients
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/client/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        And the response body has 3 fields
        Then the request body is:
        """
        {
            "name": "Tatayoyo",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/client/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Tatayoyo",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        And the response body has 4 fields
        Then the request body is:
        """
        {
            "name": "Bambi",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/client/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Bambi",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        And the response body has 4 fields
        When I request "/api/clients" using HTTP GET
        Then the response body is a JSON array of length 3
        """
        [{
            "id": "@regExp(/[0-9]+/)",
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }, {
             "id": "@regExp(/[0-9]+/)",
            "name": "Tatayoyo",
            "deposit": 1,
            "kegDeposit": 12
        }, {
            "id": "@regExp(/[0-9]+/)",
            "name": "Bambi",
            "deposit": 1,
            "kegDeposit": 12
        }]
        """