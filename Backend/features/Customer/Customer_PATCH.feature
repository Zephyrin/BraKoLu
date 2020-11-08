Feature: Test Client JSON API endpoint PATCH

    Scenario: Je peux créer puis mettre à jour un client
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        When I request "/api/client/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Pimprenelle"
        }
        """
        Then the request body is:
        """
        {
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client/" with "id" using HTTP PATCH
        Then the response code is 204
        When I request "/api/client/" with "id" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        {
            "id": "@regExp(/[0-9]+/)",
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        And the response body has 8 fields

    Scenario: Je ne peux pas mettre un jour un client avec un JSON vide
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        """
        When I request "/api/client/" with "id" using HTTP PATCH
        Then the response code is 422
        And the response body contains JSON:
        """
        {
            "status": "Erreur",
            "message": "Erreur de validation",
            "errors": "Le JSON reçu est vide comme ton cerveau"
        }
        """

    Scenario: Je ne peux pas mettre un jour un client avec un mauvais JSON
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12,
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        {
            "blabla": "name"
        }
        """
        When I request "/api/client/" with "id" using HTTP PATCH
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
                    "deposit": [],
                    "kegDeposit": []
                }
            }]
        }
        """

    Scenario: Je ne peux pas mettre à jour un client avec un nom qui existe déjà
        Given the request body is:
        """
        {
            "name": "Pimprenelle",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        Then the request body is:
        """
        {
            "name": "Tatayoyo",
            "deposit": 1,
            "kegDeposit": 12
        }
        """
        When I request "/api/client" using HTTP POST
        Then the response code is 201
        And I save the "id"
        Then the request body is:
        """
        {
            "name": "Pimprenelle"
        }
        """
        When I request "/api/client/" with "id" using HTTP PATCH
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
                    "deposit": [],
                    "kegDeposit": []
                }
            }]
        }
        """