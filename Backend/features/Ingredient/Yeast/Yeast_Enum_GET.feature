Feature: Test Yeast Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des TYPE
        Then I request "/api/ingredients/yeast/enum/type" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["dry", "liquid"]
        """
        