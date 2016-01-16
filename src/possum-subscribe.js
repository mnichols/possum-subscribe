'use strict';

import stampit from 'stampit'
import postal from 'postal'

export default stampit()
.init(function(){
    let channels = (this.channels || [])
    const handleMessage = (data, env) => {
        //special handling of unsubscription
        if(env.topic === 'unsubscribe') {
            this.unsubscribe(env.channel)
        }
        return this.handle(env.topic,data)
    }
    if(this.namespace) {
        channels.push(this.namespace)
    }
    this.subscriptions = channels.map(channel => {
        return postal.subscribe({
            channel
            , topic: '#'
            , callback: handleMessage
        })
    })
    this.unsubscribe = (...unsubscribeChannels) => {
        if(!unsubscribeChannels.length) {
            this.subscriptions.forEach(s => { s.unsubscribe() })
        } else {
            this.subscriptions
            .filter(c => { return unsubscribeChannels.indexOf(c.channel) > -1 })
            .forEach(s => { s.unsubscribe() })
        }
        this.subscriptions.length = 0
        return this
    }
})
