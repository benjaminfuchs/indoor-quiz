""" Test dialog interaction """

from roles import Player, Presenter
from testcase import TestCase

class TestDialog(TestCase):

    @staticmethod
    def test_joining_one_player():
        with Presenter() as presenter, Player("AFFEAFFE"):
            actual_name = presenter.get_player_name(1)
            assert actual_name == "AFFEAFFE"

    @staticmethod
    def test_joining_two_player():
        with Presenter() as presenter, Player("AFFEAFFE"), Player("DEADBEEF"):
            actual_name = presenter.get_player_name(1)
            assert actual_name == "AFFEAFFE"
            actual_name = presenter.get_player_name(2)
            assert actual_name == "DEADBEEF"
