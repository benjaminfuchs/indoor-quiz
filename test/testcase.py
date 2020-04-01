""" Testcase class for generic setup and teardown """

from multiprocessing import Process
import os
from Naked.toolshed.shell import execute_js
import git
import pytest

class TestCase:

    @staticmethod
    def _get_git_root():
        git_repo = git.Repo(os.path.dirname(__file__),
                            search_parent_directories=True)
        git_root = git_repo.git.rev_parse("--show-toplevel")
        return git_root

    @classmethod
    @pytest.fixture(autouse=True)
    def server(cls):
        git_root = cls._get_git_root()
        node_process = Process(target=execute_js,
                               args=[os.path.join(git_root, 'server.js')])
        node_process.start()
        yield
        node_process.terminate()
        node_process.join()
