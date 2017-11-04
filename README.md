# react-data-markup [![Build Status](https://travis-ci.org/dferens/react-data-markup.svg?branch=master)](https://travis-ci.org/dferens/react-data-markup)

Data syntax for React.js markup.

## Usage

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.0/react.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.0/react-dom.js"></script>
<script type="text/javascript" src="path/to/react-data-markup.js"></script>
<script type="text/javascript">
    var DataMarkup = window.DataMarkup;

    // `DataMarkup.createClass` wraps `render` method in order to create markup from lists
    var AnotherComponent = DataMarkup.createClass({
        render: function() {
            return ['p', 'Hello world!']            
        }
    });

    var MainComponent = DataMarkup.createClass({
      render: function render() {
        return (
            ['div.example',  // or simply '.example'
                ['h1#heading', 'This are lists'],
                ['h2', 'creating React.js markup'],
                [AnotherComponent, {foo: 'bar'}
                    ['li', {href: 'http://whatever.com'}, 'One list item'],
                    ['li', 'Another list item']
                ]    
            ]
        );                    
      }
    });
</script>
```

## Documentation

TODO


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
