Feature: Test Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg",
            "childName": "other",
            "type": "un type"
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
            "unit": "kg",
            "childName": "other",
            "type": "un type"
        }
        """
        And the response body has 7 fields
        Then the request body is:
        """
        {
            "name": "Amarillo",
            "unitFactor": 1000,
            "childName": "cereal",
            "plant": "Une plante",
            "type": "toto",
            "format": "grain",
            "EBC": 10
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
            "unitFactor": 1000,
            "childName": "cereal",
            "plant": "Une plante",
            "type": "toto",
            "format": "grain",
            "EBC": 10
        }
        """
        And the response body has 8 fields
        Then the request body is:
        """
        {
            "name": "Apollo",
            "unitFactor": 1000,
            "comment": "Orange et un poil résineux",
            "type": "un type",
            "childName": "other"
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
            "comment": "Orange et un poil résineux",
            "type": "un type",
            "childName": "other"
        }
        """
        And the response body has 6 fields
        When I request "/api/ingredients" using HTTP GET
        Then the response body is a JSON array of length 3
        """
        [{
            "id": "@regExp(/[0-9]+/)",
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg",
            "type": "un type",
            "childName": "other"
        }, {
            "id": "@regExp(/[0-9]+/)",
            "name": "Amirallo",
            "unitFactor": 1000,
            "childName": "cereal",
            "plant": "Une plante",
            "type": "toto",
            "format": "grain",
            "EBC": 10
        }, {
            "id": "@regExp(/[0-9]+/)",
            "name": "Apollo",
            "unitFactor": 1000,
            "comment": "Orange et un poil résineux",
            "type": "un type",
            "childName": "other"
        }]
        """
