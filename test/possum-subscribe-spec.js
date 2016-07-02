'use strict';

import test from 'blue-tape'
import possumSubscribe from '../src/possum-subscribe.js'
import postal from 'postal'

test('possum-subscribe-able should subscribe to namespace channel',(assert) => {

    let sut = possumSubscribe
    .props({ namespace: 'foo' })
    .methods({
        handle: function(inputType, args) {
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()
    postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
    assert.equal(sut.invoked,'bar')
    assert.deepEqual(sut.invokedArgs, { bat: 'man' })
    assert.end()
    postal.reset();
})
test('possum-subscribe-able should subscribe to explicit channel',(assert) => {

    let sut = possumSubscribe
    .props({ channels: ['foo'] })
    .methods({
        handle: function(inputType, args) {
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()
    postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
    assert.equal(sut.invoked,'bar')
    assert.deepEqual(sut.invokedArgs, { bat: 'man' })
    assert.end()
    postal.reset();
})
test('possum-subscribe-able namespaced instances should discriminate other channels',(assert) => {

    let sut = possumSubscribe
    .props({ channels: ['foo'], namespace: 'bar' })
    .methods({
        handle: function(inputType, args) {
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()
    postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
    postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
    assert.equal(sut.invoked,'foo.bar')
    assert.deepEqual(sut.invokedArgs, { bat: 'man' })
    postal.publish({ channel: 'bar', topic: 'baz', data: { rob: 'in' } })
    assert.equal(sut.invoked, 'baz')
    assert.deepEqual(sut.invokedArgs, { rob: 'in' })
    assert.end()
    postal.reset();
})
test('possum-subscribe-able should unsubscribe to explicit channel',(assert) => {

    let invocationCount = {}
    let sut = possumSubscribe
    .props({
        channels: ['foo','goo']
    })
    .methods({
        handle: function(inputType, args) {
            invocationCount[inputType] = (invocationCount[inputType] || 0) + 1
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()

    const publish = () => {
        postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
        postal.publish({ channel: 'goo', topic: 'baz', data: { bat: 'man' } })
    }

    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],1)
    sut.unsubscribe('foo')
    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],2)
    assert.end()
    postal.reset();
})
test('possum-subscribe-able should unsubscribe to all channels when none listed',(assert) => {

    let invocationCount = {}
    let sut = possumSubscribe
    .props({
        channels: ['foo','goo']
    })
    .methods({
        handle: function(inputType, args) {
            invocationCount[inputType] = (invocationCount[inputType] || 0) + 1
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()

    const publish = () => {
        postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
        postal.publish({ channel: 'goo', topic: 'baz', data: { bat: 'man' } })
    }

    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],1)
    sut.unsubscribe()
    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],1)
    assert.end()
    postal.reset();
})
test('possum-subscribe-able should unsubscribe to all channels when `unsubscribe` event is raise',(assert) => {

    let invocationCount = {}
    let sut = possumSubscribe
    .props({
        channels: ['foo','goo']
    })
    .methods({
        handle: function(inputType, args) {
            invocationCount[inputType] = (invocationCount[inputType] || 0) + 1
            this.invoked = inputType
            this.invokedArgs = args
        }
    })
    .create()

    const publish = () => {
        postal.publish({ channel: 'foo', topic: 'bar', data: { bat: 'man' } })
        postal.publish({ channel: 'goo', topic: 'baz', data: { bat: 'man' } })
    }

    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],1)
    postal.publish({ channel: 'foo', topic: 'unsubscribe'})
    publish()
    assert.equal(invocationCount['bar'],1)
    assert.equal(invocationCount['baz'],2)
    assert.end()
    postal.reset();
})
