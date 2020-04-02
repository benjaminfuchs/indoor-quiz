""" Presenter class for testing the quiz """

from lib.quizpage import QuizPage

class Presenter(QuizPage):

    def __init__(self):
        super(Presenter, self).__init__()
        self.join_as_presenter()


class Quizmaster(QuizPage):

    def __init__(self):
        super(Quizmaster, self).__init__()
        self.join_as_quizmaster()


class Player(QuizPage):

    def __init__(self, name):
        super(Player, self).__init__()
        self.join_as_player(name)
