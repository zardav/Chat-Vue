<template>
  <q-page class="row items-center justify-evenly">
    <div class="main-container">
      <message-list :messages="messages" :myId="userId" />
      <div v-if="connected">
        <message-input v-model="messageText" @send="send" />
        <q-select v-model="target" :options="targets" option-value="user_id" option-label="nick" label="to" />
      </div>
      <nick-choose v-else v-model="nick" @connect="connect" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { Todo, Meta, Message } from 'components/models';
import ExampleComponent from 'components/CompositionComponent.vue';
import { defineComponent, ref, computed } from 'vue';
import NickChoose from 'src/components/NickChoose.vue';
import MessageList from 'src/components/MessageList.vue';
import MessageInput from 'src/components/MessageInput.vue';
import {io, Socket} from 'socket.io-client'


export default defineComponent({
  name: 'PageIndex',
  components: { NickChoose, MessageList, MessageInput },
  setup() {
    const users = ref<Array<any>>([]);
    const targets = computed(() => [{nick: "All", user_id: -1}].concat(users.value));
    return {users, targets};
  },
  data() {
    return {
      nick: "",
      connected: false,
      messageText: "",
      messages: [
        /*
        {
            content: "hi",
            senderId: 1,
            senderName: "Dave",
            time: new Date()
        },
        {
            content: "hi2",
            senderId: 0,
            senderName: "me",
            time: new Date()
        }
        */
      ] as Message[],
      userId: 0,
      socket: {} as Socket,
      target: {user_id: -1, nick: "All"}
    };
  },
  props: {
  },
  methods: {
    connect() {
      const socket = io(':3000');
      socket.once("logon", (uid: number) => {
        this.userId = uid;
        this.connected = true;
        console.log("connected, uid:  " + uid.toString());
        this.updateUsers();
        socket.on("user connected", (u : any) => this.users.push(u));
        socket.on("user disconnected", uid => {this.users = this.users.filter((u:{user_id: number}) => u.user_id !== uid)});
        socket.on("public message", data => this.receiveMessage(data, false));
        socket.on("private message", data => this.receiveMessage(data, true));
      })
      socket.emit("login", this.nick);
      this.socket = socket;
    },
    send() {
      const {user_id, nick} = this.target, message = this.messageText;
      if (user_id === -1) {
        this.socket.emit("public message", message);
      } else {
        this.socket.emit("private message", {user_id, message});
      }
      this.messages.push({
        content: message, 
        senderId: this.userId, 
        senderName: this.nick, 
        time: new Date(), 
        isPrivate: user_id !== -1,
        targetName: nick
      });

      this.messageText = "";
    },
    receiveMessage(data : {user_id: number, nick: string, message: string, time: number}, is_private : boolean) {
      console.log(data);
      const {user_id, nick, message, time} = data;
      if (user_id !== this.userId) {
        this.messages.push({
          content: message,
          senderId: user_id,
          senderName: nick,
          time: new Date(time),
          isPrivate: is_private,
          targetName: is_private ? this.nick : "All"
        });
      }
    },
    updateUsers() {
      this.socket.once("users list", (list: Array<any>) => {
        this.users = list;
        console.log(list);
      });
      this.socket.emit("get users");
    }
  }
});
</script>



<style scoped>
.main-container {
  width: 99vw;
  max-width: 500px;
}
</style>