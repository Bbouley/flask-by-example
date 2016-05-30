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

We are now ready to add in our directive into the html of our page, underneath our `row` div.

```html
<word-count-chart data="wordcounts"></word-count-chart>
```

Now we can add in the data to draw our chart. Currently, the data we are getting back from our POST function in our controller is returning an object, so we will have to iterate through that object to get the data out that we can use to draw our chart. Before that, let's start with an introduction to the D3 library.

## Intro to D3

D3 has some very useful functionality that we can use to build out bar charts. In vanilla javascript, we traditionally select one element at a time when looking to set its contents.

```js
var exampleDiv = document.createElement('div');
exampleDiv.innerHTML = 'This will be the div content';
document.body.appendChild(exampleDiv);
```

This code creates a div element, then adds the string to that div and appends it to the body. What we can do with D3 is work with multiple elements at at time. This group of related elements is called 'selections'. We can manipulate several elements at once by querying using a selector by name or by class. For example, if we had multiple `p` elements on a page, we could do something to each one of them with the following code.

```js
var paragraphs = d3.selectAll('p');
var exampleDiv = paragraphs.append('div');
exampleDiv.html('Now all the paragraphs have this text');
```

The next D3 feature we will cover is called *method chaining*. This feature allows us to apply multiple operations to the same elements. What we can do is select an element and perform several operations on it. Here, we can select an element, append something to it and edit the text in one go.

```js
d3.select('div')
  .append('p')
  .text('New Paragraph');
```

Note that while most operations will return the same selection (in this case, the div originally selected) when using `.append` we are actually returned a new selection. So above the `.append` works on the first selected item, our `div` element. Then, when we use `.append`, the code that follows will apply to our appended element. Here that is the paragraph element we have added.

##A simple bar chart

Now that we've taken a brief look at some of the methods we can use with D3, let's start to build a simple bar chart. We'll need to build this within our `watch` function. This means that whenever our `scope.wordcounts` data changed, this function will be fired.

```js
var data = scope.wordcounts
for (var word in data)
{
  d3.select('#chart')
    .append('div')
    .selectAll('div')
      .data(word[0])
    .enter().append('div')
}
```

We currently have an object coming back from our POST function coming back. So what we want to do is select the chart element we are inserting into our html with angular, and then for every word append a new div. However, D3's append method only creates one new element. So what we need to do is use a [data join](https://bost.ocks.org/mike/join/). This will allow us to create a new bar for each data element. So what happens when you run the code now? Wait, nothing shows up? Well although we have a basic chart being built, we havent added any styles yet, so of course, nothing is actually visible. Let's sort that out now.

##Styling our chart

Let's start with some simple css to add a bit of colour to our page.

```css
#chart {
  overflow-y: scroll;
}

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

```html
<link rel="stylesheet" type="text/css" href="../static/main.css">
```

So if we fire up the app in our browser, what's happening now? When you search for a website, you should now see a grey area with some thin blue bars on the left hand side. So you can see that we are generating a bar for each data element we're getting back, there are 10 bars displayed. However, we need to modify our D3 code in order to generate how wide we want each bar to be. We can chain this on to our existing code and use the D3 style function.

```js
var data = scope.wordcounts
for (var word in data)
{
  d3.select('#chart')
    .append('div')
    .attr('class', 'chart')
    .selectAll('div')
      .data(word[0])
    .enter()
    .append('div')
      .style('width', function() {
        return (data[word] * 20) + 'px';
      })
      .text(function(d){
        return word;
      })
}
```

Now we are dynamically creating a width based on the numeric value of how often a word shows up on a webpage.

```js
.style('width', function() {
  return (data[word] * 20) + 'px';
})
.text(function(d){
  return word + '  :  ' + data[word];
})
```

The style is calculated by returning the value associated with each word, multiplying that number by 20 and then converting it into pixels. We can also add text to each bar element. We can insert the string value of the word plus how often it shows up in that webpage.

So now if we fire up that page, we should see our barchart displayed underneath when we search for a website. There's still one thing missing though. What happens when you search for a new website? Well, that chart is appended underneath our previous one. So we need to clear out our chart div before a new one is created.

```js
scope.$watch('wordcounts', function() {
  d3.select('#chart').selectAll('*').remove();
  var data = scope.wordcounts
  for (var word in data)
  {
    d3.select('#chart')
      .append('div')
      .attr('class', 'chart')
      .selectAll('div')
        .data(word[0])
      .enter()
      .append('div')
        .style('width', function() {
          return (data[word] * 20) + 'px';
        })
        .text(function(d){
          return word + '  :  ' + data[word];
        })
  }
}, true)
```

```js
d3.select('#chart').selectAll('*').remove();
```

This line clears our chart each time the `$scope.watch` function is fired. So now we have a chart that is cleared before each new use, and we have a fully functional word-count application!!


## Conclusion and Next Steps
