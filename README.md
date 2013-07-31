## JSElement
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

## Browser Usage
To run jselement in the browser, just include the `jsel.js` file from the npm module install into your page.

    <script src='jsel.js'></script>

You will receive a global `jsel` object. Use it like you would a `require('jsel')` object.

    var dom = jsel(data);

## Usage
JSElement allows you to apply XPath expressions to your JavaScript data objects.

Imagine you have some arbitrary data, and the data may be uniform or not:

    var data = {
    	type: 'root',
    	value: 'val1',
    	attributes: {id: 1},
    	children: [
    		{
    			type: 'element1',
    			value: 'val1',
    			attributes: {id: 2, egg: 'flip'},
    			children: [
    				{
    					type: 'foo1',
    					value: 'val3',
    					attributes: {id: 3}
    				},
    				{
    					type: 'foo2',
    					value: 'val4',
    					attributes: {id: 4}
    				}
    			]
    		},
    		{
    			type: 'element2',
    			value: 'val5',
    			attributes: {id: 5, egg: 'roll'},
    			children: []
    		}
    	]
    };

First, wrap your data object in the `jsel` module export object. This will give you a document object model, similar to an XMLDocument.

    var jsel = require('jsel');
    var dom = jsel(data);

Now you can call `dom.select(..)` and pass an xpath expression to select nodes or values from your document.

    var result = dom.select('count(//*)');
    // will return a number for the count of all nodes

Pass true as the second argument to select if you only want a single value.

    var result = dom.select('//*', true);
    // will return the first node of all nodes selected

## Adapters
JSElement uses adapters internally to convert your JavaScript object into an XMLElement-like interface that the XPath engine can walk.

This means that for every node in your document structure, JSElement will want to know the return type for the following properties:

* **nodeName** - *{string | null}* the element name of the node
* **childNodes** - *{array | null}* the children of the node
* **attributes** - *{object | null}* a key/value object of the node's attributes
* **nodeValue** - *{* | null}* the whole value of the node

JSElement has standard adapters that convert all string or number values to attributes, and all object or array values to children.

To provide your own custom adapters, you pass an object to `dom.adapters(..)` with the following keys.

    dom.adapters({
        // nodeValue can either be a string with property name
        // or a function returning a string
        nodeValue: function(node) {
            // assumes each node will have a type property
            return node.type;
        },
        childNodes: function(node) {
            // assumes each node will have a children property
            return node.children;
        },
        attributes: function(node) {
            // assumes each node will have an attributes property
            return node.attributes;
        },
        nodeValue: function(node) {
            // assumes each node will have a value property
            return node.value;
        }
    });

You have total control of how to interpret these values from each node in your dom as they are being required. JSElement will cache the values so it's nice and efficient. This means the extra objects required to wrap your data will only be created and cached as the xpath engine needs them.

It's even possible to create a temporary array or object structure for `childNodes` and `attributes` if you would like to compress your data structure in your expressions and aggregate inner values.

For example, say you had the following data.

    var dom = jsel({
        title: "abc",
        children: [
            {
                foo: "bar"
            },
            'val'
        ],
        subData: {
            foo: 555,
            foo2: "bar2"
        }
    });

The following expressions would be true.

    dom.select("count(//*)") === 4;                     // true
    dom.select("@title", true) === "abc";               // true
    dom.select("//children/*[1]/@foo", true) === "bar"  // true
    dom.select("count(//@foo)") === 2;                  // true
    dom.select("//@foo[2]", true) === 555;              // true
    dom.select("count(//children//*)") === 2;           // true
    dom.select("//children/*[2]", true) === "val";      // true


## Mappings
JSElement allows you to use different element names and attributes in your expressions to those defined by your adapters. This let's you create shorthand or normalised expressions.

For example, if you had elements with long names or attribute names, you could create mappings to shorter forms.

To provide your own custom mappings, you pass an object to the `dom.map(..)` function containing a key which is a regex to find, and the value to replace it with when resolving element names (including attributes).

    // tell the dom that when we write "e" in our expressions, replace it with "element"
    dom.map({
        'e': 'element'
    });

You can then use the shorthand form in your expression.

     var result = dom.select('//e1');
     // will return any node with name "element1"

## Tests
Install [mocha](http://visionmedia.github.io/mocha/#installation) globally

    npm install -g mocha

From the jsel module root, run mocha with spec reporter option

    mocha -R spec

To run tests in the browser, open the `tests/index.html` file in your browser.