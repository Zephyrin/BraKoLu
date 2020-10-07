Feature: Test BottleTop Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Pale Ale",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "caps",
            "childName": "caps",
            "size": "26",
            "color": "rouge",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        When the request body is:
        """
        {
            "name": "Blonde",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "caps",
            "childName": "caps",
            "size": "26",
            "color": "jaune",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans la taille
        Given the request body is:
        """
        {
            "name": "Blonde",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "caps",
            "childName": "caps",
            "size": "666",
            "color": "jaune",
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
                    "size": {
                        "errors": [
                            "Sélectionne un type correct."
                        ]
                    },
                    "color": [],
                }
            }]
        }
        """       