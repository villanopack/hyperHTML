'use strict';
/*! (c) Andrea Giammarchi (ISC) */

const Megatron = (m => m.__esModule ? m.default : m)(require('./classes/Megatron.js'));
const Component = (m => m.__esModule ? m.default : m)(require('./classes/Component.js'));
const {setup} = require('./classes/Component.js');
const Intent = (m => m.__esModule ? m.default : m)(require('./objects/Intent.js'));
const wire = (m => m.__esModule ? m.default : m)(require('./hyper/wire.js'));
const {content, weakly} = require('./hyper/wire.js');
const render = (m => m.__esModule ? m.default : m)(require('./hyper/render.js'));

// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
const bind = context => render.bind(context);
const define = Intent.define;

hyper.Component = Component;
hyper.bind = bind;
hyper.define = define;
hyper.hyper = hyper;
hyper.wire = wire;

// it is possible to define a different engine
// to resolve nodes diffing.
// The engine must provide an update method
// capable of mutating liveNodes collection
// and the related DOM.
// See hyperhtml-majinbuu to know more
Object.defineProperty(hyper, 'engine', {
  get: function get() {
    return Megatron.engine;
  },
  set: function set(engine) {
    Megatron.engine = engine;
  }
});

// the wire content is the lazy defined
// html or svg property of each hyper.Component
setup(content);

// everything is exported directly or through the
// hyperHTML callback, when used as top level script
exports.Component = Component;
exports.bind = bind;
exports.define = define;
exports.hyper = hyper;
exports.wire = wire;

// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      content('html') :
      (typeof HTML === 'string' ?
        wire(null, HTML) :
        ('raw' in HTML ?
          content('html')(HTML) :
          ('nodeType' in HTML ?
            render.bind(HTML) :
            weakly(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      content('html') : wire
    ).apply(null, arguments);
}
Object.defineProperty(exports, '__esModule', {value: true}).default = hyper