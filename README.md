## JSEL
DOM 3 XPath implementation for JavaScript object data.

Written by Ali Chamas [site](http://www.musicartscience.com.au).

Based on the npm module "xpath" originally written by Cameron McCormack ([blog](http://mcc.id.au/xpathjs)) with thanks to Yaron Naveh ([blog](http://webservices20.blogspot.com/)).

#### Try Online
Try the interactive editor to test your own data at:

[dragonworx.github.io/jsel](http://dragonworx.github.io/jsel/)

#### Contributors:

* Tim Harrington

## Install

#### Node.js / CommonJS
Install locally with [npm](http://github.com/isaacs/npm):

    npm install jsel

Then require the module into your application.

    var jsel = require('jsel');
    
Now you can wrap your JSON data by using the `jsel()` function and receive a DOM object.

    var dom = jsel(data);

#### Runnign in the Browser

To run jsel in the browser, just include the `jsel.js` file from the local jsel npm module installation into your web page.

    <script src='node_modules/jsel/jsel.js'></script>

You will receive a global `jsel` object. Use it like you would a regular `jsel` object in NodeJS.

    var dom = jsel(data);

## Usage

Jsel allows you to apply XPath expressions against your JavaScript data objects, and return values from them.

For example, say you had the following data.

    var myJsonData = {
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
    };
    
Wrap it in a JSel object like this to receive a Document Object Model.

    var dom = jsel(myJsonData);
	
You now have a DOM object which you can apply XPath expressions to and select data from.

The DOM object is similar to an XMLDocument and has the following methods to select either single or multiple elements (The element is an actual sub object from your data, not a copy):

* `select()` - return a single value from your data
* `selectAll()` - return a result set from your data (array)

You can return scalar results from XPath expressions, such as when using the `count()` XPath function.

**Note** Jsel will return you the actual node values from your data. Think of it like turning any JavaScript object into a walkable XML document.

Given the `dom` variable you've just created, the following XPath expressions would all be true.

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

Jsel supports the following [XPath functions](https://developer.mozilla.org/en-US/docs/Web/XPath/Functions): `last`, `position`, `count`, `match`, `replace`, `id`, `name`, `string`, `concat`, `starts-with`, `contains`, `substring-before`, `substring-after`, `substring`, `string-length`, `normalize-space`, `translate`, `boolean`, `not`, `true`, `false`, `lang`, `number`, `sum`, `floor`, `ceiling`, `round`.

#### Schemas

By default, JSel works with JavaScript objects by treating simple values of object keys as attributes (eg. a key value where the value is a string, number or boolean), and values as objects as elements.

Since Jsel converts all string, number or boolean values to attributes, and all object or array values to named children, you don't even need to create a schema if you are working with JSON data, it all just works out of the box.

However you can override this default behaviour by defining a set of callbacks which resolve the schema of each node in your data as they are being walked by the XPath engine.

To do so, create an object with function values for some or all of the following keys:

    var schema = {
	    /*@param {*} node A node from your data
		* @returns {string} The element name of the node
		*/
	    nodeName: function(node) {},
		/*@param {*} node A node from your data
		* @returns {Array} The children of the node
		*/
	    childNodes: function(node) {},
		/*@param {*} node A node from your data
		* @returns {Object} A key/value object of the node's attributes
		*/
	    attributes: function(node) {},
		/*@param {*} node A node from your data - you can use text() in the XPath expression to select this value
		* @returns {*} The value of the node
		*/
	    nodeValue: function(node) {},
	}

These properties make up the structure of your data, as according to XPath. You now have total control of how to interpret these values from each node in your dom as they are being required.

Jsel takes care of caching, so the values are only asked for once. This builds a virtual tree of walkable nodes for the XPath engine whenever you `select` or `selectAll` an expression, and will be cached for subsequent selections of that DOM.

It's ok to return `null` from any function. That would be the same as not defining an adapter for that property and just means that there will no way to match that property in an expression.

Once you've defined a schema, attach it to your dom object.

    dom.schema(schema); // set the schema of this DOM object to change how data is searched

It's even possible to create a temporary array or object structure for either `childNodes` and/or `attributes` and return that if you would like to simplify your expressions and aggregate your data. Since JSel caches the resolution of each node, it's only processed once and allows you to collect or aggregate inner data to make your expressions more flexible.

Defining your own schema allows you to completely design how your data is defined, and therefore searchable by XPath. For example, you could define a schema to handle CSV data, and pass a CSV string to jsel so you could find expressions like `//line` or `//line[1]/field[2]`.

#### Reuse and Share Schemas

The great thing about schemas is that once you've written one to support a data type, you can reuse and share that schema every time you access data of that type. You can distribute that schema so that other users can handle that data type too.

For example, you could write a schema to unify and normalise the ast tree of [UglifyJS](http://lisperator.net/uglifyjs/ast) and [esprima](http://esprima.org/doc/index.html#ast). Your schema (and mappings) would abstract both structures and you could use a common expression syntax to search both.

#### Writing Schemas for Uniform Data

If your data is uniform you could use the same logic for each node in your schema. Since each node will have a common structure, you can simplify how each schema function works for all nodes.

#### Writing Schemas for Variable Data

If your data has variable data schema, you might need to use conditional tests inside your schema such as `if` or `switch` statements. Since each node will vary, you'd need to test each node and return from the schema functions accordingly.

#### User Nodes

You can create virtual nodes which only exist to help walk your data, these are called User Nodes. You create these nodes in your schema definitions to wrap parts of your data during expression evaluation, so that you can test for them during subsequent calls to the schema properties. You would usually do this in your `childNodes` property handler.

To create a User Node, just call `jsel.Node(nodeName, value)` and pass the node name and it's value. For example you could wrap a plain string and call it a `data` node so that you could test for that node later, and create more virtual types from that.

## Mappings

Jsel allows you to use regular expressions against your `nodeName` and `attribute` node values. This means you can use shorthand expressions, or map one expression to many nodeNames. This becomes very powerful when simplifying or abstracting your nodes.

To provide your own custom mappings, just pass an object to `dom.map(..)` with key value pairs of find and replace regular expressions. The key matches against your expression, the value matches against the node (`nodeName` or `attribute`).

For example, we can tell the dom that when we write "e" in our expressions, match it to "someLongElementName" nodes.

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

Install [mocha](http://mochajs.org/#installation) globally

    npm install -g mocha

From the jsel module root, run mocha with spec reporter option

    mocha -R spec

To run tests in the browser, open the `tests/index.html` file in your browser. They are the same tests.
