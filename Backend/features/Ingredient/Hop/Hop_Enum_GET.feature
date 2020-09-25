Feature: Test Hop Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des FORMATS puis la liste des TYPES
        Then I request "/api/ingredients/hop/enum/types" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["pellets_t90", "pellets_t45", "cônes"]
        """
        