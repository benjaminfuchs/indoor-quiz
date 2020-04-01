""" Test dialog interaction """

from roles import Player, Presenter, Quizmaster


def test_joining_one_player():
    with Presenter() as presenter:
        Player("AFFEAFFE")

        presenter.assert_player_name(1, "AFFEAFFE")
        presenter.assert_player_name(2, "Waiting...")


def test_joining_two_player():
    with Presenter() as presenter:
        Player("AFFEAFFE")
        Player("DEADBEEF")

        presenter.assert_player_name(1, "AFFEAFFE")
        presenter.assert_player_name(2, "DEADBEEF")


def test_joining_player_before_presenter():
    Player("AFFEAFFE")

    with Presenter() as presenter:
        presenter.assert_player_name(1, "Waiting...")
        presenter.assert_player_name(2, "Waiting...")
