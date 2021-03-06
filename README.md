### Issues

#### Part 1

 -  With Heroku Create command (line 144) - Names already taken

 -  Issues with key not being added when pushing to heroku (line 164) - Could add in line to show how to upload key if necessary?

```sh
heroku keys:add ~/.ssh/id_rsa.pub
```

#### Part 3

 - ENV settings from previous session not saved, had to be redeclared when I started the env up again

```sh
$ export APP_SETTINGS="config.DevelopmentConfig"
$ export DATABASE_URL="postgresql://localhost/wordcount_dev"
```

#### Part 4

 - ENV settings have to be redeclared every time user navigates into directory and starts their venv again.
 (go back to set up autoenv in part 1? so these commands run every time you cd into that directory)




### Notes

 - Templates displaying on page
 - This shows the code on page, and URL hit doesn't work
 - Go back and run through code to see if there's anything missing
 - Error message coming from parser

 ```sh
 /Users/Penguin/Desktop/myStuff/real-python/flask-by-example/env/lib/python3.5/site-packages/bs4/__init__.py:166: UserWarning: No parser was explicitly specified, so I'm using the best available HTML parser for this system ("html.parser"). This usually isn't a problem, but if you run this code on another system, or in a different virtual environment, it may use a different parser and behave differently.

To get rid of this warning, change this:

 BeautifulSoup([your markup])

to this:

 BeautifulSoup([your markup], "html.parser")

  markup_type=markup_type))
 ```


### Mini Post

Create a config.py

```py
import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = 'this-really-needs-to-be-changed-i-think'

class ProductionConfig(Config):
    DEVELOPMENT = True
    DEBUG = True

class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True

class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
```

Next, add this to app.py

```py
app.config.from_object(os.environ['APP_SETTINGS'])
```

Run following from terminal

```py
export APP_SETTINGS="config.DevelopmentConfig"
```

and now set heroku vars

```sh
$ heroku config:set APP_SETTINGS=config.StagingConfig --remote stage
$ heroku config:set APP_SETTINGS=config.ProductionConfig --remote pro
```


### Env vars

To set up our application with environment variables, we're going to use [autoenv](https://github.com/kennethreitz/autoenv). This program allows us to set commands that will run every time we cd into our directory. In order to use it, we will need to install it globally. First, kill your environment in the terminal, install autoenv and add a *.env* file:

```sh
$ deactivate
$ pip install autoenv
$ touch .env
```

Next, in your .env file, add the following:

```
source env/bin/activate
export APP_SETTINGS="config.DevelopmentConfig"
```

Now, if you move up a directory and then cd back into it, your virtual environment will automatically be started and your variable APP_SETTINGS is declared.





