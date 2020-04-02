""" Testcase class for generic setup and teardown """

from contextlib import ContextDecorator
from subprocess import Popen
import os
import git
import pytest

class NodeProcess(ContextDecorator):
    def __init__(self, cmd):
        self._process = Popen(cmd)

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self._process.terminate()
        self._process.wait()
        assert self._process.returncode == 0

class TestCase:

    @staticmethod
    def get_git_root():
        git_repo = git.Repo(os.path.dirname(__file__),
                            search_parent_directories=True)
        git_root = git_repo.git.rev_parse("--show-toplevel")
        return git_root

    @classmethod
    @pytest.fixture(autouse=True)
    def server(cls):
        git_root = cls.get_git_root()
        with NodeProcess(['node', os.path.join(git_root, 'server.js')]) as process:
            yield process
