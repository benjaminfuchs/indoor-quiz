""" Driver class for interaction with the quiz web interface """

import os
from contextlib import ContextDecorator
from selenium import webdriver

TEST_URL = "http://localhost:8900/"
ELASTIC_TIME = 10

class QuizDriver(ContextDecorator):

    def __init__(self):
        self._url = TEST_URL
        self._options = webdriver.ChromeOptions()
        self._options.add_argument('--ignore-certificate-errors')
        self._options.add_argument('--headless')
        self._options.add_argument('--enable-automation')

        if os.environ.get('SELENIUM_CHROME_BIN'):
            self._options.binary_location = os.environ['SELENIUM_CHROME_BIN']
        else:
            self._options.binary_location = "/usr/bin/chromium-browser"

        self._driver = webdriver.Chrome(options=self._options)
        self._driver.implicitly_wait(ELASTIC_TIME)
        self._driver.get('http://localhost:8900/')

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self._driver.close()

    def join_as_quizmaster(self):
        quizmaster_button = self._driver.find_element_by_id('quizmasterButton')
        quizmaster_button.click()

    def join_as_presenter(self):
        presenter_button = self._driver.find_element_by_id('presenterButton')
        presenter_button.click()

    def join_as_player(self, name):
        player_name_form = self._driver.find_element_by_id('playerName')
        join_button = self._driver.find_element_by_id('joinButton')
        player_name_form.clear()
        player_name_form.send_keys(name)
        join_button.click()

    def get_player_name(self, num):
        name_player_textbox = self._driver.find_element_by_id(
            'namePlayer' + str(num))
        return name_player_textbox.text
