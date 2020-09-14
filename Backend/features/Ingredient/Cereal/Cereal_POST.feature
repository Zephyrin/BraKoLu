Feature: Test Cereal Ingredient JSON API endpoint

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
        When the request body is:
        """
        {
            "name": "Amadou",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg",
            "childName": "cereal",
            "type": "cru",
            "plant": "une plant",
            "format": "extrait",
            "EBC": 15
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans le type et le format
        Given the request body is:
        """
        {
            "name": "Iria",
            "unitFactor": 1000,
            "comment": "Amérisant",
            "unit": "kg",
            "childName": "cereal",
            "type": "malté",
            "plant": "une plant",
            "format": "grains",
            "EBC": 10
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
                    "comment": [],
                    "unit": [],
                    "unitFactor": [],
                    "type": {
                        "errors": [
                            "Sélectionne un type correct."
                        ]
                    },
                    "plant": [],
                    "format": {
                        "errors": [
                            "Sélectionne un type correct."
                        ]
                    },
                    "EBC": []
                }
            }]
        }
        """
        