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

    # The elastic timeout is multiplied to the implicit wait time which is
    # calculated based on the time we wait for the start dialog.
    # Increase it if you run into timeouts.
    ELASTIC_TIMEOUT = 1

    DEFAULT_CHROME_BIN = '/usr/bin/chromium-browser'
    MAX_TIMEOUT = 60

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
        self._driver.quit()

    def _create_driver(self):
        if os.environ.get('SELENIUM_CHROME_BIN'):
            driver = self._create_chrome_driver(os.environ['SELENIUM_CHROME_BIN'])
        elif os.environ.get('SELENIUM_REMOTE_FIREFOX'):
            driver = self._create_remote_firefox_driver(os.environ['SELENIUM_REMOTE_FIREFOX'])
        elif os.environ.get('SELENIUM_FIREFOX_BIN'):
            driver = self._create_firefox_driver(os.environ['SELENIUM_FIREFOX_BIN'])
        else:
            driver = self._create_chrome_driver(self.DEFAULT_CHROME_BIN)
        driver.get(self._get_server_url())
        driver.implicitly_wait(self._get_implicit_wait(driver))
        return driver

    @staticmethod
    def _get_server_url():
        if os.environ.get('TEST_SERVER_IP'):
            return 'http://' + os.environ['SERVER_IP'] + ':8900/'
        return 'http://localhost:8900/'

    def _get_implicit_wait(self, driver):
        """ Calculate the implicit wait based on time waiting for start dialog """

        start_time = time.time()
        WebDriverWait(driver,
                      self.MAX_TIMEOUT).until(EC.element_to_be_clickable(self._join_button))
        return (time.time() - start_time) * self.ELASTIC_TIMEOUT

    @staticmethod
    def _create_remote_firefox_driver(url):
        options = webdriver.FirefoxOptions()
        options.add_argument('--headless')
        options.set_capability('platformName', 'LINUX')
        return webdriver.Remote(
            command_executor=url,
            options=options
        )

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
