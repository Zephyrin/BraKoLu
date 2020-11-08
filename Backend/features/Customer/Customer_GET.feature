Feature: Test client JSON API endpoint GET
    
    Scenario: Je peux récuperer un client 
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12,
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
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12,
        }
        """
        And the response body has 8 fields
        Then I request "/api/clients" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        [{
            "id": "@regExp(/[0-9]+/)",
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12,
        }]
        """
        And the response body is a JSON array of length 1