**Welcome back. With angular set up along with a loading spinner and our refactored angular controller, let's move on to charting with [D3](https://d3js.org/)**


Remember, here's what we're building: A Flask app that calculates word-frequency pairs based on the text from a given URL. This is a full-stack tutorial.

1. [Part One](http://www.realpython.com/blog/python/flask-by-example-part-1-project-setup): Setup a local development environment and then deploy both a staging environment and a production environment on Heroku.
1. [Part Two](http://www.realpython.com/blog/flask-by-example-part-2-postgres-sqlalchemy-and-alembic): Setup a PostgreSQL database along with SQLAlchemy and Alembic to handle migrations.
1. [Part Three](https://realpython.com/blog/python/flask-by-example-part-3-text-processing-with-requests-beautifulsoup-nltk/): Add in the back-end logic to scrape and then process the counting of words from a webpage using the requests, BeautifulSoup, and Natural Language Toolkit (NLTK) libraries.
1. [Part Four](https://realpython.com/blog/python/flask-by-example-implementing-a-redis-task-queue/): Implement a Redis task queue to handle the text processing.
1. [Part Five](https://realpython.com/blog/python/flask-by-example-integrating-flask-and-angularjs/): Setup Angular on the front-end to continuously poll the back-end to see if the request is done.
1. [Part Six](https://realpython.com/blog/python/updating-the-staging-environment/): Push to the staging server on Heroku - setting up Redis, detailing how to run two processes (web and worker) on a single Dyno.
1. [Part Seven](https://realpython.com/blog/python/flask-by-example-updating-the-ui/): Update the front-end to make it more user-friendly.
1. **Part Eight: Add the D3 library into the mix to graph a frequency distribution and histogram. (current)**

> Need the code? Grab it from the [repo](https://github.com/realpython/flask-by-example/releases).

## Current User Interface

Let's look at the current user interface...

Start Redis in a terminal window:

```sh
$ redis-server
```

Then get your worker going in another window:

```sh
$ cd wordcounts
$ python worker.py
17:11:39 RQ worker started, version 0.4.6
17:11:39
17:11:39 *** Listening on default...
```

Finally, in a third window, fire up the app:

```sh
$ cd wordcounts
$ python manage.py runserver
```

You should see your wordounter working, now if you hit a url the results should display in a table on the page. What we want to do is use the [D3](https://d3js.org/) library to show that as something more exciting.

The first step is to include D3 in our html page.

```html
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
```

Note that it has to be included before our *main.js* file. To keep this post simple, we are including D3 in the global namespace, but do note that you should be injecting dependencies instead of putting them in the global namespace. Check out [this article](http://www.ng-newsletter.com/posts/d3-on-angular.html) on more information about dependency injections with D3.

Then, let's set up a directive. [Angular directives](https://docs.angularjs.org/guide/directive) are markers on a DOM element. They allow us to insert sections of HTML with specific events and attributes attached to it. Read the above link to get comfortable with what directives are and what they can do.

Let's build out the first part of our directive. This will come after our controller in *main.js*:

```js
  angular.module('WordcountApp', [])

    .controller('WordcountController', ['$scope', '$log', '$http', '$timeout', function($scope, $log, $http, $timeout) {
        // Code in controller
  }
])
   .directive('wordCountChart', function ($parse) {
      return {
         restrict: 'E',
         replace: true,
         template: '<div id="chart"></div>',
         link: function (scope) {

         }
      };
   });
```

This creates a directive that is restricted to being an element. By calling `replace : true`, we are replacing the html directive we will call with this template. After that we have a link function that gives us access to variables in the scope of our controller above.

Next, we need to set up a watch function. This will watch for changes in our variables, then performa function every time that data changes.

```js
scope.$watch('wordcounts', function() {
  // Code for creating our table
}, true)
```

Now we can add in the data to draw our chart. Currently, the data we are getting back from our POST function in our controller is returning an object, so we will have to iterate through that object to get the data out that we can use to draw our chart.

```js
scope.$watch('wordcounts', function() {
  var data = scope.wordcounts
  d3.select('#chart').selectAll('*').remove();
  for(var word in data) {
    var chart = d3.select('#chart')
   .append("div").attr("class", "chart")
   .selectAll('div')
   .data(word[0]).enter()
   .append("div")
   .transition().ease("elastic")
   .style("width", function(d) {
      return (data[word] * 20) + "px";
    })
   .text(function(d) {
      return word + '  :  ' + data[word] ;
    });
  }
}, true)
```

This looks a litte bit complex, but let's run through it. We are watching our wordcounts data, so every time that changes the function inside the watch will run. The data is set to `scope.wordcounts`. This is the data we get back from out POST function in our controller. We then clear the chart in case there is data left there from previous search queries, so we can append new divs instead of stacking them underneath.

We then use the d3 object we have access to to run a series of methods in order to create our chart. For each word we get back, we append a div with an attribute of `class = "chart"`. For each div created, we can then use the `.enter()` d3 method. This creates a placeholder element and then gives this reference to the next method in our chain. It allows us to add data dynamically and append to our chart as we loop through our data object.

Finally, we set our styles for each bar element in our chart that we are creating. Adding in a transition for styling, setting the width of each bar in the chart based on the number of times a word has come up in our wordcount, and then setting the text within each bar as the word data and the count. Passing in true means that angular performs a `deep-object-tree` comparison. This allows us the watch to constantly check if a completely new object has been passed into our `scope.wordcounts`.

We are now ready to add in our directive into the html of our page, underneath our `row` div.

```html
<word-count-chart data="wordcounts"></word-count-chart>
```

However, if you load up the page and test it out with a url, you will see that there is only some text at the bottom of the page. What? Well, we haven't actually added any styling to our chart, so right now our function is adding classes that don't have any style to them. Let's add in some css and make this chart look good. Add a *styles.css* file into your static directory and add the following code.

```css
.chart {
    background: #eee;
    padding: 3px;
}

.chart div {
  width: 0;
  transition: all 1s ease-out;
  -moz-transition: all 1s ease-out;
  -webkit-transition: all 1s ease-out;
}

.chart div {
  height: 30px;
  font: 15px;
  background-color: #006dcc;
  text-align: right;
  padding: 3px;
  color: white;
  box-shadow: 2px 2px 2px gray;
}
```

Make sure to include this in the top of your html page with a *link* tag.

Now test out the app and you can see the words being charted underneath our table.


## Conclusion and Next Steps
