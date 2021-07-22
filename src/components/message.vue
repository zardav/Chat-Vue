<template>
  <q-chat-message :name="senderName + ' -> ' + targetName" :text="[content]" :stamp="time.toLocaleString()" :sent="mine" />
</template>

<script>
export default {
  // name: 'ComponentName',
  setup () {
    return {}
  },
  props: {
    senderId: {
      type: Number
    },
    content: {
      type: String
    },
    time: {
      type: Date,
      default: new Date()
    }, 
    senderName: {
      type: String
    },
    mine: {
      type: Boolean
    },
    targetName: {
      type: String,
      default: ""
    }
  }
}
</script>
