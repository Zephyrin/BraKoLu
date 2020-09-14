Feature: Test IngredientStock JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg",
            "childName": "cereal",
            "type": "malt",
            "plant": "une plant",
            "format": "grain",
            "EBC": 10
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        Then the request body is:
        """
        {
            "quantity": 10,
            "price": 100,
            "state": "created",
            "ingredient": { 
                "id": 1,
                "name": "Admiral",
                "unitFactor": 1000,
                "comment": "Amérisant",
                "unit": "kg",
                "childName": "cereal",
                "type": "malt",
                "plant": "une plant",
                "format": "grain",
                "EBC": 10
            }
        }
        """
        When I request "/api/ingredient/stock" using HTTP POST
        Then the response code is 201
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "quantity": 10,
            "price": 100,
            "state": "created",
            "creationDate": "@regExp(/.*/)",
            "ingredient": {
                "id": "@regExp(/[0-9]+/)",
                "name": "Admiral",
                "unitFactor": 1000,
                "comment": "Amérisant",
                "unit": "kg",
                "childName": "cereal",
                "type": "malt",
                "plant": "une plant",
                "format": "grain",
                "EBC": 10
            }
        }
        """
        And the response body has 6 fields

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "quantity": 10,
            "price": 100,
            "state": "created",
            "ingredient": {
                "name": "Admiralus",
                "unitFactor": 1000,
                "comment": "Amérisant",
                "unit": "kg",
                "childName": "cereal",
                "type": "malt",
                "plant": "une plant",
                "format": "grain",
                "EBC": 10
            }
        }
        """
        When I request "/api/ingredient/stock" using HTTP POST
        Then the response code is 201
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "quantity": 10,
            "price": 100,
            "state": "created",
            "creationDate": "@regExp(/.*/)",
            "ingredient": {
                "id": "@regExp(/[0-9]+/)",
                "name": "Admiralus",
                "unitFactor": 1000,
                "comment": "Amérisant",
                "unit": "kg",
                "childName": "cereal",
                "type": "malt",
                "plant": "une plant",
                "format": "grain",
                "EBC": 10
            }
        }
        """
        And the response body has 6 fields

    