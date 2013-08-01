## JSEL
DOM 3 XPath implementation for JavaScript object data.

Written by Ali Chamas [site](http://www.musicartscience.com.au).

Based on the npm module "xpath" originally written by Cameron McCormack ([blog](http://mcc.id.au/xpathjs)) with thanks to Yaron Naveh ([blog](http://webservices20.blogspot.com/)).

Full documentation available at [www.jselement.org](http://www.jselement.org).

## NPM Install
Install locally with [npm](http://github.com/isaacs/npm):

    npm install jsel

Then `require(..)` module.

    var jsel = require('jsel');
    var dom = jsel(data);

## Browser Install
To run jsel in the browser, just include the `jsel.js` file from the npm module install into your page.

    <script src='jsel.js'></script>

You will receive a global `jsel` object. Use it like you would a `require('jsel')` object.

    var dom = jsel(data);

## Usage
jsel allows you to apply XPath expressions to your JavaScript data objects.

For example, say you had the following data.

    var dom = jsel({
        title: 'abc',
        children: [
            {
                foo: 'bar'
            },
            'val'
        ],
        subData: {
            foo: 555,
            foo2: 'bar2'
        }
    });

The following expressions would all be true.

    dom.select('count(//*)') === 5;
    dom.select('@title') === 'abc';
    dom.select('//children/*[1]/@foo') === 'bar';
    dom.select('count(//@foo)') === 2;
    dom.select('//@foo[2]') === 555;
    dom.select('count(//children//*)') === 2;
    dom.select('//children/*[2]') === 'val';
    dom.select('name(//children/*[2])') === 'string';
    dom.select('name(*/*[2])') === 'subData';
    dom.select('*/children/*[2]/text()') === 'val';
    dom.selectAll('//@foo') === ['bar', 555];

Use `dom.select(..)` to return a single value, and `dom.selectAll(..)` to return a result set.

## Adapters
An adapter is a callback function you give to the `dom` object, to resolve one of the following properties for any node in your data.

* **nodeName** - *{string | null}* the element name of the node
* **childNodes** - *{array | null}* the children of the node
* **attributes** - *{object | null}* a key/value object of the node's attributes
* **nodeValue** - *{* | null}* the whole value of the node

jsel has standard adapters built in that convert all string or number values to attributes, and all object or array values to named children. Therefore you don't even need to use adapters if you like.

To provide your own custom adapters, you pass an object to `dom.adapters(..)` with all or some of the following keys. You can also return `null` for any of the values.

    dom.adapters({
        nodeName: function(node) {
            // return a string value to represent the nodes element name
        },
        childNodes: function(node) {
            // return an array with the children of this node
        },
        attributes: function(node) {
            // return an object with key values to represent the nodes attributes
        },
        nodeValue: function(node) {
            // return any value to represent the nodes value.
            // you can use text() in the expression to select the value
        }
    });

You have total control of how to interpret these values from each node in your dom as they are being required. jsel will cache the values so it's nice and efficient. This means the extra objects required to wrap your data will only be created and cached as the xpath engine needs them.

It's even possible to create a temporary array or object structure for `childNodes` and `attributes` if you would like to compress your data structure in your expressions and aggregate inner values.

## Mappings
jsel allows you to use different element names and attributes in your expressions to those defined by your adapters. This means you can use shorthand names in your expressions.

For example, if you had elements or attributes with long names, you could create mappings to use shorter forms in your expressions.

To provide your own custom mappings, you pass an object to `dom.map(..)` containing keys which are regex patterns to find in your element or attribute names, and the string value to replace them with. Since the strings in the mappings objects are regex patterns, you can use captures in your replace value.

    // tell the dom that when we write "e" in our expressions, replace it with "longElementName"
    dom.map({
        'e': 'longElementName'
    });

You can then use the shorthand form "e" instead of the longer "longElementName" in your expression.

     var result = dom.select('//e1');
     // will return any node with name "longElementName1"

## Tests
Install [mocha](http://visionmedia.github.io/mocha/#installation) globally

    npm install -g mocha

From the jsel module root, run mocha with spec reporter option

    mocha -R spec

To run tests in the browser, open the `tests/index.html` file in your browser.