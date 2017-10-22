var picodom = require('picodom')
var h = picodom.h
var patch = picodom.patch
var S = require('pull-stream/pull')
var Map = require('pull-stream/throughs/map')
var Drain = require('pull-stream/sinks/drain')
var Notify = require('pull-notify')
var Many = require('pull-many')
var xtend = require('xtend')

function render (view, evs, initState, root) {
    var drain = Drain(function onStateChange (state) {
        _render(state)
    }, function onEnd (err) {
        console.log('stream end', err)
    })

    var sources = evs.reduce(function (acc, ev) {
        acc[ev] = Notify()
        return acc
    }, {})

    var oldNode
    function _render (state) {
        var newNode = h(view, xtend(state, { emit: sources }), [])
        root = root || document.body
        patch(oldNode, newNode, root)
        oldNode = newNode
    }

    _render(initState)

    function _source () {
        return Many(Object.keys(sources).map(function (k) {
            return S(
                sources[k].listen(),
                Map(function (ev) { return [k, ev] })
            )
        }))
    }

    Object.keys(sources).forEach(function (k) {
        _source[k] = sources[k].listen
    })

    return {
        source: _source,
        sink: drain
    }
}

module.exports = render

