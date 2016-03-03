### Part One - Setting up local dev env

1. New command to setup and activate virtual environment could be

```sh
$ pyvenv-3.5 env
$ source env/bin/activate
```

- I'm having issues running this, gives me error below

```sh
$ mkvirtualenv --python=/usr/local/bin/python3 wordcounts
zsh: command not found: mkvirtualenv
```

reinstalled and upgraded virtualenvwrapper

```sh
$ pip install virtualenvwrapper --upgrade
```

Still getting an error of sorts

```sh
$ mkvirtualenv --python=/usr/local/bin/python3 wordcounts
Running virtualenv with interpreter /usr/local/bin/python3
Using base prefix '/Library/Frameworks/Python.framework/Versions/3.5'
New python executable in /Users/Penguin/.virtualenvs/wordcounts/bin/python3
Not overwriting existing python script /Users/Penguin/.virtualenvs/wordcounts/bin/python (you must use /Users/Penguin/.virtualenvs/wordcounts/bin/python3)
Installing setuptools, pip, wheel...done.

/System/Library/Frameworks/Python.framework/Versions/2.7/Resources/Python.app/Contents/MacOS/Python: No module named virtualenvwrapper
```

```sh
$ python
Python 2.7.11 (v2.7.11:6d1b6a68f775, Dec  5 2015, 12:54:16)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Think I've sorted it, what's missing from the tutorial, or at least what got me to get mine working was running the following, although I still get the errors shown.

```sh
$ workon wordcounts

/System/Library/Frameworks/Python.framework/Versions/2.7/Resources/Python.app/Contents/MacOS/Python: No module named virtualenvwrapper
/System/Library/Frameworks/Python.framework/Versions/2.7/Resources/Python.app/Contents/MacOS/Python: No module named virtualenvwrapper
```

Now, when I run python I get :

```sh
$ python
Python 3.5.1 (v3.5.1:37a07cee5969, Dec  5 2015, 21:12:44)
[GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Issues with using VIM to edit workon command, possibly move this to underneath the rest of the project so people don't feel that they have to do it, I struggled with it.

```
Be sure to update the .gitignore file from the repo.
```

Maybe update this line to something to be clearer?

```
Copy the gitignore file from the repo
```




