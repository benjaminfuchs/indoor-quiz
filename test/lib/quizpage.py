""" Driver class for interaction with the quiz web interface """

import os
from contextlib import ContextDecorator
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from lib.helper import TextToChange

class QuizPage(ContextDecorator):
    """ Page Object encapsulates the Quiz Page """

    DEFAULT_CHROME_BIN = "/usr/bin/chromium-browser"
    ELASTIC_TIME = 1
    TEST_URL = "http://localhost:8900/"

    def __init__(self):
        self._driver = self._create_driver()
        self._quizmaster_button = (By.ID, 'quizmasterButton')
        self._presenter_button = (By.ID, 'presenterButton')
        self._join_button = (By.ID, 'joinButton')
        self._player_name_form = (By.ID, 'playerName')
        self._player_one_textbox = (By.ID, 'namePlayer1')
        self._player_two_textbox = (By.ID, 'namePlayer2')

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self._driver.close()

    def _create_driver(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--headless')
        options.add_argument('--enable-automation')
        if os.environ.get('SELENIUM_CHROME_BIN'):
            options.binary_location = os.environ['SELENIUM_CHROME_BIN']
        else:
            options.binary_location = self.DEFAULT_CHROME_BIN

        driver = webdriver.Chrome(options=options)
        driver.implicitly_wait(self.ELASTIC_TIME)
        driver.get(self.TEST_URL)
        return driver

    def join_as_quizmaster(self):
        self._driver.find_element(*self._quizmaster_button).click()

    def join_as_presenter(self):
        self._driver.find_element(*self._presenter_button).click()

    def join_as_player(self, name):
        self._driver.find_element(*self._player_name_form).clear()
        self._driver.find_element(*self._player_name_form).send_keys(name)
        self._driver.find_element(*self._join_button).click()

    def get_player_name(self, num):
        if num == 1:
            locator = self._player_one_textbox
        elif num == 2:
            locator = self._player_two_textbox
        else:
            raise ValueError('No player number "%s" found' % str(num))

        WebDriverWait(self._driver, 10).until(
            TextToChange(locator, 'Waiting...')
        )
        return self._driver.find_element(*locator).text
