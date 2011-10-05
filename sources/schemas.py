#!/bin/python2

import json
import os.path
import sys
import yaml

json.dump (
	yaml.load (
		open (os.path.join (os.path.dirname (__file__), "schemas.yaml"), "r")),
	open (os.path.join (os.path.dirname (__file__), "schemas.json"), "w"),
	sort_keys = True, indent = 4)

sys.exit (0)
