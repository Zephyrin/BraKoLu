Feature: Test Cereal Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des FORMATS puis la liste des TYPES
        Given I request "/api/ingredients/cereal/enum/formats" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["Grain", "Flocon", "Extrait"]
        """
        Then I request "/api/ingredients/cereal/enum/types" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["Malt"", "Cru"]
        """