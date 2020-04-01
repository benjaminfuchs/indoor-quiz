""" Test dialog interaction """

import time
from roles import Player, Presenter
from testcase import TestCase


class TestDialog(TestCase):

    @staticmethod
    def test_joining_one_player():
        with Presenter() as presenter:
            Player("AFFEAFFE")
            time.sleep(2) # FIXME(bfuchs) Ugly wait, find better solution with selenium

            actual_name = presenter.get_player_name(1)
            assert actual_name == "AFFEAFFE"

    @staticmethod
    def test_joining_two_player():
        with Presenter() as presenter:
            Player("AFFEAFFE")
            Player("DEADBEEF")
            time.sleep(2) # FIXME(bfuchs) Ugly wait, find better solution with selenium

            actual_name = presenter.get_player_name(1)
            assert actual_name == "AFFEAFFE"
            actual_name = presenter.get_player_name(2)
            assert actual_name == "DEADBEEF"

    @staticmethod
    def test_joining_player_before_presenter():
        Player("AFFEAFFE")

        with Presenter() as presenter:
            actual_name = presenter.get_player_name(1)
            assert actual_name == "Waiting..."
            actual_name = presenter.get_player_name(2)
            assert actual_name == "Waiting..."
