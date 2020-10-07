Feature: Test Yeast Ingredient JSON API endpoint

    Scenario: Je peux créer plusieurs ingrédients
        Given the request body is:
        """
        {
            "name": "S33",
            "unitFactor": 1,
            "comment": "Neutre",
            "unit": "gr",
            "childName": "yeast",
            "type": "dry",
            "productionYear": "2020-01-01",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        When the request body is:
        """
        {
            "name": "Y430",
            "unitFactor": 1,
            "comment": "Triple",
            "unit": "gr",
            "childName": "yeast",
            "type": "liquid",
            "productionYear": "2020-01-01",
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201

    Scenario: Je ne peux pas créer un ingrédients avec de mauvaises valeur dans le type et le format
        Given the request body is:
        """
        {
            "name": "Y430",
            "unitFactor": 1,
            "comment": "Triple",
            "unit": "gr",
            "childName": "yeast",
            "type": "likouide",
            "productionYear": "2020-01-01",
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
                    "productionYear": [],
                }
            }]
        }
        """