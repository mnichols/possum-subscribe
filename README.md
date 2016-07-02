# possum-subscribe
composed message subscription lifecycle for possums


## Installation

`npm install possum-subscribe --save`

## Usage

```js
let machine = possum.config({
    namespace: 'foo',
    initialState: 'a'
})
.props({ channels: ['bar'] })
.states({
    a: {
        'bar.b'(inputType, args) { //came from channel 'bar'  },
        'b' (inputType, args) { // came from channel 'foo' }
    }
})
//publish on namespace channel
postal.publish({ channel: 'foo', topic: 'b', data: { ... } })

//publish on explicit channel
postal.publish({ channel: 'bar', topic: 'b', data: { ... } })

//nothing happens
postal.publish({ channel: 'baz', topic: 'b', data: { ... } })
```
