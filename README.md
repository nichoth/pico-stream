# pico stream

A dom render loop using picodom and pull streams

## install

    npm install pico-stream

## example

    $ npm start

```js
var h = require('picodom').h
var S = require('pull-stream')
var render = require('../')

function MyComponent (props) {
    return h('div', {}, [
        'hello ' + props.hello,
        h('br'),
        h('input', { type: 'text', value: props.hello,
            oninput: props.emit.foo })
    ])
}

// pass in view function, event names, and initial state
var app = render(MyComponent, ['foo', 'bar'], { hello: 'world' })

// create a render loop by piping data to app.sink
S(
    app.source.foo(),
    S.map(ev => ({ hello: ev.target.value })),
    S.through(state => console.log('new state', state)),
    app.sink
)

// create new multiplexed stream of all events -- a stream of tuples
// with the event key followed by data:
// [ 'foo', domEvent ]
S(
    app.source(),  
    S.log()
)
```

