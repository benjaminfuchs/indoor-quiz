""" Driver class for interaction with the quiz web interface """

import time
import os
from contextlib import ContextDecorator
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from lib.helper import TextToChange


class QuizPage(ContextDecorator):
    """ Page Object encapsulates the Quiz Page """

    # The elastic timeout is multiplied to a timeout calculated based on the
    # maschines performance. Increase it if you run into timeout.
    ELASTIC_TIMEOUT = 1

    DEFAULT_CHROME_BIN = '/usr/bin/chromium-browser'
    MAX_TIMEOUT = 60
    TEST_URL = 'http://localhost:8900/'

    def __init__(self):
        self._quizmaster_button = (By.ID, 'quizmasterButton')
        self._presenter_button = (By.ID, 'presenterButton')
        self._join_button = (By.ID, 'joinButton')
        self._player_name_form = (By.ID, 'playerName')
        self._player_one_textbox = (By.ID, 'namePlayer1')
        self._player_two_textbox = (By.ID, 'namePlayer2')
        self._driver = self._create_driver()

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self._driver.close()

    def _create_driver(self):
        start_time = time.time()

        if os.environ.get('SELENIUM_CHROME_BIN'):
            driver = self._create_chrome_driver(os.environ['SELENIUM_CHROME_BIN'])
        elif os.environ.get('SELENIUM_FIREFOX_BIN'):
            driver = self._create_firefox_driver(os.environ['SELENIUM_FIREFOX_BIN'])
        else:
            driver = self._create_chrome_driver(self.DEFAULT_CHROME_BIN)
        driver.get(self.TEST_URL)

        WebDriverWait(driver,
                      self.MAX_TIMEOUT).until(EC.element_to_be_clickable(self._join_button))
        driver.implicitly_wait((time.time() - start_time) * self.ELASTIC_TIMEOUT)
        return driver

    @staticmethod
    def _create_chrome_driver(binary):
        options = webdriver.ChromeOptions()
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--enable-automation')
        if not os.environ.get('SELENIUM_DEBUG'):
             options.add_argument('--headless')
        options.binary_location = os.path.abspath(binary)
        return webdriver.Chrome(options=options)

    @staticmethod
    def _create_firefox_driver(binary):
        options = webdriver.FirefoxOptions()
        if not os.environ.get('SELENIUM_DEBUG'):
             options.add_argument('--headless')
        options.binary_location = os.path.abspath(binary)
        return webdriver.Firefox(options=options)

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

        WebDriverWait(self._driver, 10).until(TextToChange(locator, 'Waiting...'))
        return self._driver.find_element(*locator).text
