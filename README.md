# react-data-markup [![Build Status](https://travis-ci.org/dferens/react-data-markup.svg?branch=master)](https://travis-ci.org/dferens/react-data-markup) ![npm version](https://img.shields.io/npm/v/react-data-markup.svg)

Write React.js markup with arrays & objects, inspired by [react-hyperscript](https://github.com/mlmorg/react-hyperscript) and [rum](https://github.com/tonsky/rum).

## Installing
- v1 - include via <script> tag, access `window.DataMarkup`
  - v1.0.x - React v15
  - v1.1.x - React v16 (requires [create-react-class](https://www.npmjs.com/package/create-react-class))
- v2 - webpack & require
  - v2.0.x - React v15
  - TODO: v2.1.x - React v16


## Importing

```es6
import DataMarkup from 'react-data-markup'; // ES6
var DataMarkup = require('react-data-markup'); // ES5 with npm
```

If you prefer a <script> tag, you can get it from window.DataMarkup global:

```html
<!-- development version -->
<script src="https://unpkg.com/react-data-markup/react-data-markup.js"></script>
```

## Form syntax

```
[<tag-n-function>, <props>?, <children>*, ...]
```
- **\<tag-n-function\>** `String|Object` - function, component, or string in a format 'tag#id.class'
- **\<props\>** `Object` *(optional)* - An object containing the props you'd like to set on the element
- **\<children\>** `Array` - Zero or more forms or a strings. This will create child elements or a text node, respectively.

## Usage

```javascript
var DataMarkup = window.DataMarkup;    

// Use `DataMarkup.wrapFunction` for functional components
var FunctionalComponent = DataMarkup.wrapFunction(function(props) {
  return (
    ['p', props.x * 2]
  )
});

// Use `DataMarkup.createClass` to get `render` automatically wrapped
var AnotherComponent = DataMarkup.createClass({
  render: function() {
    return ['p', 'Hello world!', this.props.children]            
  }
});

var MainComponent = DataMarkup.createClass({
  render: function render() {
    return (
        ['.example',
            ['h1#heading', 'These are arrays'],
            ['h2', 'creating React.js markup'],
            [FunctionalComponent, {x: 5}],
            [AnotherComponent, {foo: 'bar'},
                ['li', {href: 'http://whatever.com'}, 'One list item'],
                ['li', 'Another list item']
            ]    
        ]
    );                    
  }
});    
```

## API

#### `DataMarkup.createClass(classSpec)`

Creates React component, which transforms markup returned by `render` into React's elements.

#### `DataMarkup.wrapFunction(fn)`

Returns function, which calls `fn` and transforms it's result.

- **fn** `Function`

#### `DataMarkup.transform(form)`

Parses array markup and returns React elements.

- **form** `Array`
