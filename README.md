## JSEL
DOM 3 XPath implementation for JavaScript object data.

Written by Ali Chamas [site](http://www.musicartscience.com.au).

Based on the npm module "xpath" originally written by Cameron McCormack ([blog](http://mcc.id.au/xpathjs)) with thanks to Yaron Naveh ([blog](http://webservices20.blogspot.com/)).

Full documentation available at [www.jselement.org](http://www.jselement.org).

## Install

#### Node.js
Install locally with [npm](http://github.com/isaacs/npm):

    npm install jsel

Then `require(..)` module.

    var jsel = require('jsel');
    var dom = jsel(data);

#### Browser
To run jsel in the browser, just include the `jsel.js` file from the npm module install into your page.

    <script src='jsel.js'></script>

You will receive a global `jsel` object. Use it like you would a `require('jsel')` object.

    var dom = jsel(data);

## Usage
jsel allows you to apply XPath expressions against your JavaScript data objects, and return values from them.

jsel supports the following XPath functions: `last`, `position`, `count`, `match`, `replace`, `id`, `name`, `string`, `concat`, `starts-with`, `contains`, `substring-before`, `substring-after`, `substring`, `string-length`, `normalize-space`, `translate`, `boolean`, `not`, `true`, `false`, `lang`, `number`, `sum`, `floor`, `ceiling`, `round`.

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

jsel will return you the actual node values from your data. Think of it like turning your JSON data into XML.

## Adapters

#### What's an Adapter?

An adapter is a callback function you give to the `dom` object to abstract one of the following properties for any node in your data.

* **nodeName** - *{string | null}* the element name of the node
* **childNodes** - *{array | null}* the children of the node
* **attributes** - *{object | null}* a key/value object of the node's attributes
* **nodeValue** - *{* | null}* the whole value of the node

These properties make up the structure of your data. You have total control of how to interpret these values from each node in your dom as they are being required.

#### Default Adapters Built In

jsel has default adapters built in that convert all string or number values to attributes, and all object or array values to named children. Therefore you don't even need to use adapters if you like, it all just works out of the box.

#### Defining Adapters

To provide your own custom adapters, just pass an object to `dom.adapters(..)` with all or some of the following keys.

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

It's ok to return `null` from any function. That would be the same as not defining an adapter for that property.

It's even possible to create a temporary array or object structure for either `childNodes` and/or `attributes` and return that if you would like to simplify your expressions and aggregate your data internally.

The good thing about adapters is that once you've written them to support a data set type, you can reuse the adapters everything you access that set. For example, you could write an adapter set for [UglifyJS](http://lisperator.net/uglifyjs/ast) or [esprima](http://esprima.org/doc/index.html#ast) to select from their AST trees. Your adapters (and mappings) would abstract both structures and you could use a common expression syntax to search both.

#### Uniform Data Schema

If your data is uniform you could use the same logic for each node in your adapters.

#### Variable Data Schema

If your data has variable data schema, you might need to use conditional tests inside your adapters such as `if` or `switch` statements.

## Mappings

jsel allows you to use regular expressions against your `nodeName` and `attribute` node values. This means you can use shorthand expressions, or map one expression to many nodeNames. This becomes very powerful when simplifying or abstracting your nodes.

To provide your own custom mappings, just pass an object to `dom.map(..)` with key value pairs of find and replace regular expressions. The key matches against your expression, the value matches against the node (`nodeName` or `attribute`).

For example, we can tell the dom that when we write "e" in our expressions, match it to "someLongElementName" nodes

    dom.map({
        'e': 'someLongElementName'
    });

    var result = dom.selectAll('//e');
    // will return any nodes with name "someLongElementName"

We could also tell the dom that when we write "person", match it any node with "male" or "female" `nodeName` values.

    dom.map({
        'person': 'male|female'
    });

    var result = dom.selectAll('//person');
    // will return any nodes with nodeName "male" or "female"

We could even tell the dom that when we write "person" or "human", match it any node with "male" or "female" `nodeName` values.

    dom.map({
        'person|human': 'male|female'
    });

    var result = dom.selectAll('//human');
    // will return any nodes with nodeName "male" or "female"
    // as would..
    var result = dom.selectAll('//person');

## Tests

Install [mocha](http://visionmedia.github.io/mocha/#installation) globally

    npm install -g mocha

From the jsel module root, run mocha with spec reporter option

    mocha -R spec

To run tests in the browser, open the `tests/index.html` file in your browser. They are the same tests.