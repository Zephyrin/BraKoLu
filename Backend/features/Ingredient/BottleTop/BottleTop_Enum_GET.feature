Feature: Test BottleTop Enum Ingredient JSON API endpoint

    Scenario: Je peux récupérer la liste des SIZE
        Then I request "/api/ingredients/bottle/enum/size" using HTTP GET
        Then the response code is 200
        And the response body contains JSON:
        """
        ["26", "29"]
        """       