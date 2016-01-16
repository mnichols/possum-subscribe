'use strict';

import test from 'blue-tape'
import possumSubscribe from '../src/possum-subscribe.js'
import postal from 'postal'

test('possum-subscribe-able should subscribe to explicit channel',(assert) => {

    let sut = possumSubscribe
    .props({ channel: 'foo' })
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
})
