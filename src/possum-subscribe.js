'use strict';

import stampit from 'stampit'
import postal from 'postal'

export default stampit()
.init(function(){
    let channel = (this.channel || this.namespace)
    const handleMessage = (data, env) => {
        return this.handle(env.topic,data)
    }
    let subscription = postal.subscribe({
        channel
        , topic: '#'
        , callback: handleMessage
    })
    //@TODO destroy mechanism for unsubscribing
})
