Feature: Test ingredient JSON API DELETE

    Scenario: Je peux créer un ingrédient puis le supprimer.
        Given the request body is:
        """
        {
            "name": "Swaen",
            "unitFactor": 1
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/ingredient/" with "id" using HTTP DELETE
        Then the response code is 204
        When I request "/api/ingredients" using HTTP GET
        Then the response code is 200
        Then the response body is a JSON array of length 0

    Scenario: Je ne peux pas supprimer un ingrédient qui n'existe pas.
        Given I request "/api/ingredient/10012" using HTTP DELETE
        Then the response code is 404
