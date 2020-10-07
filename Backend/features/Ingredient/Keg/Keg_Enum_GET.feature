Feature: Test Keg Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des VOLUME
        Then I request "/api/ingredients/keg/enum/volume" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["20", "30"]
        """

        Scenario: Je peux récupérer la liste des HEAD
        Then I request "/api/ingredients/keg/enum/head" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["A", "S"]
        """