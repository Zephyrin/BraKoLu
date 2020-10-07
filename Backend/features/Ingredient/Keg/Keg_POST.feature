Feature: Test Keg Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Classic_A30",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "keg",
            "childName": "keg",
            "volume": 30
            "head": "A",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

        When the request body is:
        """
        {
            "name": "Classic_S20",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "keg",
            "childName": "keg",
            "volume": 20
            "head": "S",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans head et volume
        Given the request body is:
        """
        {
            "name": "Classic_Shit",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "keg",
            "childName": "keg",
            "volume": 666
            "head": "Z",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 422
        And the response body contains JSON:
        """
        {
            "status": "Erreur",
            "message": "Erreur de validation",
            "errors": [{
                "children": {
                    "id": [],
                    "name": [],
                    "unitFactor": [],
                    "comment": [],
                    "unit": [],
                    "volume": {
                        "errors": [
                            "Sélectionne un volume correct."
                        ]
                    },
                    "head": {
                        "errors": [
                            "Sélectionne un type de tête correct."
                        ]
                    }
                }
            }]
        }
        """       