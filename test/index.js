'use strict';
var console = require('console');
// var React = require('react');
var ReactDOM = require('react-dom/server');
var test = require('tape');

var DataMarkup = require('../');

var Component = createComponent();
var FunctionComponent = createFunctionComponent();

var renderTests = {
  'basic html tag': {
    dom: ['h1'],
    html: '<h1></h1>'
  },
  'tag with an id and classes in selector': {
    dom: ['h1#boom.whatever.foo'],
    html: '<h1 id="boom" class="whatever foo"></h1>'
  },
  'tag with an id and classes in selector and props': {
    dom: ['h1.foo', {className: 'bar'}],
    html: '<h1 class="foo bar"></h1>'
  },
  'tag with other properties': {
    dom: ['a', {href: 'http://www.google.com'}],
    html: '<a href="http://www.google.com"></a>'
  },
  'tag with string as third argument': {
    dom: ['h1', null, 'Hello World!'],
    html: '<h1>Hello World!</h1>'
  },
  'tag with string as second argument': {
    dom: ['h1', 'Hello World!'],
    html: '<h1>Hello World!</h1>'
  },
  'tag with number as second argument': {
    dom: ['h1', 5],
    html: '<h1>5</h1>'
  },
  'tag with number as third argument': {
    dom: ['h1', null, 5],
    html: '<h1>5</h1>'
  },
  'tag with `0` as second argument': {
    dom: ['h1', 0],
    html: '<h1>0</h1>'
  },
  'tag with children array as third argument': {
    dom: ['h1', null, [
      ['span'],
      ['span']
    ]],
    html: '<h1><span></span><span></span></h1>'
  },
  'tag with children array as second argument': {
    dom: ['h1', [
      ['span'],
      ['span']
    ]],
    html: '<h1><span></span><span></span></h1>'
  },
  'tag with nested dataset': {
    dom: ['div', {dataset: {foo: 'bar', bar: 'oops'}}],
    html: '<div data-foo="bar" data-bar="oops"></div>'
  },
  'tag with nested attributes': {
    dom: ['div', {attributes: {title: 'foo'}}],
    html: '<div title="foo"></div>'
  },
  'basic component': {
    dom: [Component],
    html: '<div><h1></h1></div>'
  },
  'component with props and children': {
    dom: [Component, {title: 'Hello World!'}, [
      ['span', 'A child']
    ]],
    html: '<div><h1>Hello World!</h1><span>A child</span></div>'
  },
  'component with children': {
    dom: [Component, [
      ['span', 'A child']
    ]],
    html: '<div><h1></h1><span>A child</span></div>'
  },
  'component with children in props': {
    dom: [Component, {children: [['span', 'A child']]}],
    html: '<div><h1></h1><span>A child</span></div>'
  },
  'function component with children': {
    dom: [FunctionComponent, [['span', 'A child']]],
    html: '<div class="a-class"><span>A child</span></div>'
  }
};

test('Tags rendered with different arguments', function t(assert) {
  Object.keys(renderTests).forEach(function runRenderTest(name) {
    var dom;
    var data = renderTests[name];
    var messages = catchWarns(function makeDomString() {
      dom = getDOMString(DataMarkup.transform(data.dom));
    });

    assert.equal(messages.length, 0,
      '`' + name + '` does not log warnings');

    assert.equal(dom, data.html,
      '`' + name + '` renders correctly');
  });
  assert.end();
});

function createComponent() {
  return DataMarkup.createClass({
    render: function render() {
      return (
        ['div',
          ['h1', this.props.title],
          this.props.children
        ]
      );
    }
  });
}

function createFunctionComponent() {
  return DataMarkup.wrapFunction(function(props) {
    return (
      ['div.a-class', props]
    );
  })
}

function getDOMString(reactElement) {
  return ReactDOM.renderToStaticMarkup(reactElement);
}

function catchWarns(fn) {
  var messages = [];

  /* eslint-disable no-console */
  var originalWarn = console.warn;
  console.warn = warn;
  fn();
  console.warn = originalWarn;
  /* esline-enable no-console */

  return messages;

  function warn(message) {
    messages.push(message);
  }
}
