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

S(
    app.source.foo(),
    S.map(ev => ({ hello: ev.target.value })),
    S.through(state => console.log('new state', state)),
    app.sink
)

S(
    app.source(),  // create new multiplexed stream
    S.log()
)






