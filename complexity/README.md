## Complexity and lines of code app

This provides an endpoint which takes a github repository and populates a database with the number of lines of code and the cyclomatic complexity of the functions.
This is calculated using the lizard python library.

To run:
```bash
source venev/bin/activate
celery -A complexity_app.celery worker --loglevel=DEBUG
export FLASK_APP=complexity_app.py
flask run
```


