Feature: Test Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/ingredient/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg"
        }
        """
        And the response body has 5 fields
        Then the request body is:
        """
        {
            "name": "Amarillo",
            "unitFactor": 1000
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/ingredient/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Amarillo",
            "unitFactor": 1000
        }
        """
        And the response body has 3 fields
        Then the request body is:
        """
        {
            "name": "Apollo",
            "unitFactor": 1000,
            "comment": "Orange et un poil résineux"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/ingredient/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Apollo",
            "unitFactor": 1000,
            "comment": "Orange et un poil résineux"
        }
        """
        And the response body has 4 fields
        When I request "/api/ingredients" using HTTP GET
        Then the response body is a JSON array of length 3
        """
        [{
            "id": "@regExp(/[0-9]+/)",
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg"
        }, {
            "id": "@regExp(/[0-9]+/)",
            "name": "Amirallo",
            "unitFactor": 1000
        }, {
            "id": "@regExp(/[0-9]+/)",
            "name": "Apollo",
            "unitFactor": 1000,
            "comment": "Orange et un poil résineux"
        }]
        """
