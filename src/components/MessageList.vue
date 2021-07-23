<template>
<div class=mlistdiv>
  <message v-for="message, n in messages" 
  :content="message.content" 
  :mine="myId === message.senderId" 
  :targetName="message.targetName" 
  :senderName="message.senderName" 
  :time="message.time"
  :key="n" />
  </div>
</template>

<script lang='ts'>
import message from './message.vue'
import {Message} from './models'
import {PropType} from 'vue'
export default {
  components: { message },
  // name: 'ComponentName',
  setup () {
    return {}
  },
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      default: () => []
    },
    myId: {
      type: Number,
      default: -1
    }
  }
}
</script>
<style scoped>
  div.mlistdiv {
    border: 1px lightgray solid;
    border-radius: 2px;
    min-height:80vh;
    height: 80vh;
    margin: 2px;
    padding: 10px;
    overflow-y: auto;
  }
</style>