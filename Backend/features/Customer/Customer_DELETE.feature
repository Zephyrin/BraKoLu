Feature: Test client JSON API DELETE

    Scenario: Je peux créer un client puis le supprimer.
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
        When I request "/api/client/" with "id" using HTTP DELETE
        Then the response code is 204
        When I request "/api/clients" using HTTP GET
        Then the response code is 200
        Then the response body is a JSON array of length 0

    Scenario: Je ne peux pas supprimer un client qui n'existe pas.
        Given I request "/api/client/10012" using HTTP DELETE
        Then the response code is 404