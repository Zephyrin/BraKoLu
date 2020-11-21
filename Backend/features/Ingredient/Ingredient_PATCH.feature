Feature: Test Ingredient JSON API endpoint PATCH

    Scenario: Je peux créer puis mettre à jour un ingrédient
        Given the request body is:
        """
        {
            "name": "Admiral",
            "unitFactor": 1000,
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
            "name": "Admiral"
        }
        """
        Then the request body is:
        """
        {
            "comment": "Un houblon amère",
            "unit": "kg"
        }
        """
        When I request "/api/ingredient/" with "id" using HTTP PATCH
        Then the response code is 204
        When I request "/api/ingredient/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Admiral",
            "unitFactor": 1000,
            "comment": "Un houblon amère",
            "unit": "kg",
            "type": "un type",
            "childName": "other",
            "ingredientStocks": []
        }
        """
        And the response body has 8 fields

    Scenario: Je ne peux pas mettre un jour un ingrédient avec un JSON vide
        Given the request body is:
        """
        {
            "name": "Amarillo",
            "unitFactor": 1000,
            "type": "un type",
            "childName": "other"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        """
        When I request "/api/ingredient/" with "id" using HTTP PATCH
        Then the response code is 422
        And the response body contains JSON:
        """
        {
            "status": "Erreur",
            "message": "Erreur de validation",
            "errors": "Le JSON reçu est vide comme ton cerveau"
        }
        """

    Scenario: Je ne peux pas mettre un jour un ingrédient avec un mauvais JSON
        Given the request body is:
        """
        {
            "name": "Apollo",
            "unitFactor": 1000,
            "childName": "other",
            "type": "un type"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        {
            "blabla": "name"
        }
        """
        When I request "/api/ingredient/" with "id" using HTTP PATCH
        Then the response code is 422
        And the response body contains JSON:
        """
        {
            "status": "Erreur",
            "message": "Erreur de validation",
            "errors": [{
                "errors": [ "Ce formulaire ne doit pas contenir des champs supplémentaires."],
                "children": {
                    "id": [],
                    "name": [],
                    "comment": [],
                    "unit": [],
                    "unitFactor": []
                }
            }]
        }
        """

    Scenario: Je ne peux pas mettre à jour un ingrédient avec un nom qui existe déjà
        Given the request body is:
        """
        {
            "name": "Aramis",
            "unitFactor": 1000,
            "childName": "other",
            "type": "un type"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        Then the request body is:
        """
        {
            "name": "Aurora",
            "unitFactor": 1000,
            "childName": "other",
            "type": "un type"
        }
        """
        When I request "/api/ingredient" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        {
            "name": "Aramis"
        }
        """
        When I request "/api/ingredient/" with "id" using HTTP PATCH
        Then the response code is 422
        And the response body contains JSON:
        """
        {
            "status": "Erreur",
            "message": "Erreur de validation",
            "errors": [{
                "children": {
                    "id": [],
                    "name": {
                        "errors": [
                            "Cette valeur est déjà utilisée."
                        ]
                    },
                    "comment": [],
                    "unit": [],
                    "unitFactor": [],
                    "type": []
                }
            }]
        }
        """