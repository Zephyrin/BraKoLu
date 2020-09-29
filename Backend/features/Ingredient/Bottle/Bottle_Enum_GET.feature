Feature: Test Bottle Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des FORMATS puis la liste des TYPES
        Then I request "/api/ingredients/bottle/enum/types" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["long_neck", "champenoise"]
        """
        
    Scenario: Je peux récupérer la liste des VOLUMES puis la liste des VOLUMES
        Then I request "/api/ingredients/bottle/enum/volumes" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["75", "33"]
        """
        