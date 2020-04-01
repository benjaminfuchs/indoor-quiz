""" Presenter class for testing the quiz """

from quizdriver import QuizDriver

class Presenter(QuizDriver):

    def __init__(self):
        super(Presenter, self).__init__()
        self.join_as_presenter()


class Quizmaster(QuizDriver):

    def __init__(self):
        super(Quizmaster, self).__init__()
        self.join_as_quizmaster()


class Player(QuizDriver):

    def __init__(self, name):
        super(Player, self).__init__()
        self.join_as_player(name)
