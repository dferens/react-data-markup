'use strict';
(function() {
  // Load React
  var React = null;
  var isNode = new Function("try {return this===global;}catch(e){return false;}")();
  if (isNode) {
    React = require('react');
  }
  else {
    React = window.React;
  }

  function _parseTag(tag, props) {
    var noId = !('id' in props),
      tagParts = tag.split(/([\.#]?[a-zA-Z0-9_:-]+)/),
      tagName = null,
      idName = null;

    if ((/^\.|#/).test(tagParts[1])) {
      tagName = 'div';
    }

    var classes = [];

    for (var i = 0; i < tagParts.length; i++) {
      var part = tagParts[i];
      if (part) {
        var type = part.charAt(0);
        if (!tagName) {
          tagName = part;
        }
        else if (type === '.') {
          classes.push(part.substring(1, part.length));
        }
        else if (type === '#' && noId) {
          idName = part.substring(1, part.length);
        }
      }
    }

    if (classes.length) {
      if (props.className) {
        classes.push(props.className);
      }
    }
    tagName = tagName ? tagName.toLowerCase() : 'div';
    return {
      tag: tagName,
      id: idName,
      classes: classes
    };
  }

  function _isElementForm(x) {
    return Array.isArray(x) && (typeof x[0] == 'string' || typeof x[0] ==
      'function')
  }

  // Code is taken from: https://github.com/jonschlinkert/is-plain-object

  // BEGIN

  function _isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  }

  function _isObjectObject(o) {
    return _isObject(o) === true && Object.prototype.toString.call(o) ===
      '[object Object]';
  }

  function _isPlainObject(o) {
    var ctor, prot;

    if (_isObjectObject(o) === false) return false;

    // If has modified constructor
    ctor = o.constructor;
    if (typeof ctor !== 'function') return false;

    // If has modified prototype
    prot = ctor.prototype;
    if (_isObjectObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) return false;

    // Most likely a plain Object
    return true;

  // END

  function _isPropsArgument(x) {return _isPlainObject(x)}

  function _transformRecursive(form) {
    if (_isElementForm(form)) {
      var children = [],
        props = {};

      if (form.length > 1) {
        var childrenStartsAt = null;

        if (_isPropsArgument(form[1])) {
          // Format: ['selector', {}, ['child1'], ...]
          Object.assign(props, form[1])
          childrenStartsAt = 2;
        }
        else {
          // Format: ['selector', ['child1'], ...]
          childrenStartsAt = 1;
        }

        // Recursively transformm children
        for (var i = childrenStartsAt; i < form.length; i++) {
          children.push(_transformRecursive(form[i]));
        }
      }

      // Supported nested dataset attributes
      if (props.dataset) {
        Object.keys(props.dataset).forEach(function unnest(attrName) {
          var dashedAttr = attrName.replace(/([a-z])([A-Z])/,
            function dash(match) {
              return match[0] + '-' + match[1].toLowerCase();
            });
          props['data-' + dashedAttr] = props.dataset[attrName];
        });
      }

      // Support nested attributes
      if (props.attributes) {
        Object.keys(props.attributes).forEach(function unnest(attrName) {
          props[attrName] = props.attributes[attrName];
        });
      }

      var componentOrTag = null;

      if (typeof form[0] === 'string') {
        var parsed = _parseTag(form[0], props);
        componentOrTag = parsed.tag;

        if (parsed.id) {
          props.id = parsed.id;
        }
        if (parsed.classes.length) {
          props.className = parsed.classes.join(' ');
        }
      }
      else {
        componentOrTag = form[0];
      }
      var args = [componentOrTag, props].concat(children);
      return React.createElement.apply(React, args);
    }
    else if (Array.isArray(form)) {
      return form.map(_transformRecursive);
    }
    else {
      return form
    }
  }

  /*
   * API
   */
  function transform(form) {
    return _transformRecursive(form);
  }

  function wrapFunction(renderFn) {
    return function() {
      return transform(renderFn.apply(this, arguments));
    };
  }

  function createClass(classSpec) {
    var newClassSpec = Object.assign({}, classSpec);
    newClassSpec.render = wrapFunction(classSpec.render);
    return React.createClass(newClassSpec);
  }

  /*
   * Exports
   */
  var namespace = {
    createClass: createClass,
    wrapFunction: wrapFunction,
    transform: transform
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = namespace;
  }
  else {
    /*eslint-env browser*/
    window.DataMarkup = namespace;
  }
})();
