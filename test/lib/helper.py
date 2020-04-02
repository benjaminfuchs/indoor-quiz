""" Helper stuff for webdriver """

from selenium.webdriver.support.expected_conditions import _find_element

# pylint: disable=too-few-public-methods
class TextToChange:
    def __init__(self, locator, text):
        self._locator = locator
        self._text = text

    def __call__(self, driver):
        actual_text = _find_element(driver, self._locator).text
        return actual_text != self._text
