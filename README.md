# pico stream

A dom render loop using picodom and pull streams


## install

    npm install pico-stream


## example

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
var view = render(MyComponent, ['foo', 'bar'], { hello: 'world' })

S(
    view.source.foo(),
    S.map(ev => ({ hello: ev.target.value })),
    S.through(state => console.log('new state', state)),
    view.sink
)

S(
    view.source(),  // create new multiplexed stream
    S.log()
)
```

