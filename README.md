# react-data-markup [![Build Status](https://travis-ci.org/dferens/react-data-markup.svg?branch=master)](https://travis-ci.org/dferens/react-data-markup)

Data syntax for React.js markup, inspired by [react-hyperscript](https://github.com/mlmorg/react-hyperscript).

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

## Usage

```html
<script type="text/javascript">
    var DataMarkup = window.DataMarkup;    

    // Use `DataMarkup.wrapFunction` get wrap functional component
    var FunctionalComponent = DataMarkup.wrapFunction(function(props) {
      return (
        ['p', props.foo]
      )
    });

    // Use `DataMarkup.createClass` to get `render` automatically wrapped
    var AnotherComponent = DataMarkup.createClass({
      render: function() {
        return ['p', 'Hello world!', this.props.children]            
      }
    });

    var MainComponent = DataMarkup.createClass({
      // Will render to:      
      //   <div class="example">
      //     <h1 id="heading">This are lists</h1>
      //     <h2>creating React.js markup</h2>
      //     <p>bar</p>
      //     <p>
      //       Hello world!
      //       <li href="http://whatever.com">One list item</li>
      //       <li>Another list item</li>
      //     </p>
      //   </div>
      render: function render() {
        return (
            ['div.example',  // or simply '.example'
                ['h1#heading', 'This are lists'],
                ['h2', 'creating React.js markup'],
                [FunctionalComponent, {foo: 'bar'}],
                [AnotherComponent, {foo: 'bar'},
                    ['li', {href: 'http://whatever.com'}, 'One list item'],
                    ['li', 'Another list item']
                ]    
            ]
        );                    
      }
    });    
</script>
```

## API

#### DataMarkup


#### `h(componentOrTag, properties, children)`

Returns a React element.

- **componentOrTag** `Object|String` - Can be a React component **OR** tag
string with optional css class names/id in the format `h1#some-id.foo.bar`.
If a tag string, it will parse out the tag name and change the `id` and
`className` properties of the `properties` object.
- **properties** `Object` *(optional)* - An object containing the properties
you'd like to set on the element.
- **children** `Array|String` *(optional)* - An array of `h()` children or
a string. This will create child elements or a text node, respectively.
