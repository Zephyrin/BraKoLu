Feature: Test Hop Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Saaz",
            "unitFactor": 1,
            "comment": "Aromatique",
            "unit": "gr",
            "childName": "hop",
            "type": "cônes",
            "harvestYear": "2020-01-01",
            "acidAlpha": 5
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        When the request body is:
        """
        {
            "name": "Citra",
            "unitFactor": 1,
            "comment": "Amérisant",
            "unit": "gr",
            "childName": "hop",
            "type": "pellets_t90",
            "harvestYear": "2020-01-01",
            "acidAlpha": 12
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans le type et le format
        Given the request body is:
        """
        {
            "name": "Saaz2",
            "unitFactor": 1,
            "comment": "Amérisant",
            "unit": "gr",
            "childName": "hop",
            "type": "pellets_t666",
            "harvestYear": "2020-01-01",
            "acidAlpha": 5
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
                    "type": {
                        "errors": [
                            "Sélectionne un type correct."
                        ]
                    },
                    "harvestYear": [],
                    "acidAlpha": []
                }
            }]
        }
        """
        