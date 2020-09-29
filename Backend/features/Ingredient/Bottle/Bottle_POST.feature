Feature: Test Bottle Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "Classic",
            "unitFactor": 1,
            "comment": "comment",
            "unit": "bouteille",
            "childName": "bottle",
            "type": "long_neck",
            "color": "marron",
            "volume": 75
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        When the request body is:
        """
        {
            "name": "Clairette",
            "unitFactor": 1,
            "comment": "moche",
            "unit": "bouteille",
            "childName": "bottle",
            "type": "champenoise"
            "color": "vert",
            "volume": 75
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans le type et le volume
        Given the request body is:
        """
        {
            "name": "Clairette",
            "unitFactor": 1,
            "comment": "moche",
            "unit": "bouteille",
            "childName": "bottle",
            "type": "champenice"
            "color": "vert",
            "volume": 666
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
                    "color": [],
                    "volume": {
                        "errors": [
                            "Sélectionne un volume correct."
                        ]
                    }
                }
            }]
        }
        """       