""" Testcase class for generic setup and teardown """

from multiprocessing import Process
import pytest
from Naked.toolshed.shell import execute_js

class TestCase:

    @pytest.fixture(autouse=True)
    def server(cls):
        node_process = Process(target=execute_js, args='../server.js')
        node_process.start()
        yield
        node_process.terminate()
        node_process.join()
