## JSElement
DOM 3 XPath implementation for JavaScript object data.

Written by Ali Chamas [site](http://www.musicartscience.com.au).

Based on the npm module "xpath" originally written by Cameron McCormack ([blog](http://mcc.id.au/xpathjs)) with thanks to Yaron Naveh ([blog](http://webservices20.blogspot.com/)).

## NPM Install
Install locally with [npm](http://github.com/isaacs/npm):

    npm install jsel

Then require module.

    var jsel = require('jsel');
    var dom = jsel(data);

## Browser Usage
To run jselement in the browser, just include the `jsel.js` file from the npm module install into your page.

    <script src='jsel.js'></script>

You will receive a global `jsel` object. Use it like you would a `require('jsel')` object.

    var dom = jsel(data);

## Usage
JSElement allows you to apply XPath expressions to your JavaScript data objects.

Imagine you have some arbitrary data like this:

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

First, wrap your data object in the `jsel` module export. This will give you a document object model, similar to an XML document.

    var jsel = require('jsel');
    var dom = jsel(data);

Now you can call `dom.select()` and pass an xpath expression to select nodes or values from your document.

    var result = dom.select('count(//*)');
    // will return a number for the count of all nodes

Pass true as the second argument to select a single value.

    var result = dom.select('//*', true);
    // will return the first node of all nodes selected

## Adapters
JSElement uses adapters to convert any arbitrary JavaScript object into an XMLElement-like interface for the XPath engine.

This means that for every node in your document structure, JSElement will want to know the following properties:

* **nodeName** - *{string | null}* the element name of the node, this allows for element name tests in the xpath expression such as `/foo1/foo2`
* **childNodes** - *{array | null}* the children of the node
* **attributes** - *{object | null}* a key/value object of the node's attributes, this allows for attribute name tests in the xpath expression such as `@foo1`
* **nodeValue** - *{* | null}* the whole value of the node, this allows for the `text()` equivalent of the node

JSElement has standard adapters that convert all string or number values to attributes, and all object or array values to children.

To provide your own custom adapters, you pass an object to the `dom.adapters()` function containing the callbacks for the required properties.

    dom.adapters({
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

You have total control in how to interpret these values from each node in your dom. JSElement will cache the values so it's nice and efficient.

It's even possible to create new array or object structure for `childNodes` and `attributes` if you would like to compress your data structure in your expressions.

## Mappings
JSElement allows you to use different element names in your expressions to those defined by your adapters. This let's you create shorthand or normalised expressions.

To provide your own custom mappings, you pass an object to the `dom.map()` function containing a key which is a regex to find, and the value to replace it with when resolving element names (including attributes).

    dom.map({
        'e': 'element'
    });

You can then use the shorthand form in your expression.

     var result = dom.select('//e1');
     // will return any node with name "element1"

## Tests
Install [mocha](http://visionmedia.github.io/mocha/#installation)

    npm install -g mocha

From the jsel module root, run mocha with spec reporter

    mocha -R spec