### Issues

1. With Heroku Create command (line 144) - Names already taken

1. Issues with key not being added when pushing to heroku (line 164) - Could add in line to show how to upload key if necessary?

```sh
heroku keys:add ~/.ssh/id_rsa.pub
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



