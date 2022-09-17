<template>
  <div>
    <v-container>
      <h3>匹配聊天</h3>
    <v-text-field
      label="输入聊天信息"
      v-model="message"
      hide-details="auto"
    ></v-text-field>
    <!-- <v-text-field
      label="输入昵称信息"
      v-model="username"
      hide-details="auto"
    ></v-text-field> -->
    <v-btn @click="sendMessage" class="mt-3 ml-3"> 发射 </v-btn>
    <v-list>
      <v-list-item two-line v-for="(msg, index) in allMessages" :key="index">
        <v-list-item-content>
          <v-list-item-title>{{ msg.user }}:</v-list-item-title>
          <v-list-item-subtitle>{{ msg.content }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    </v-container>
    
  </div>
</template>

<script>
import { io } from "socket.io-client";
export default {
  data: () => {
    return {
      message: "",
      mySocket: null,
      // username: "",
      allMessages: [],
    };
  },
  computed:{
    username(){
      return this.$store.state.userInfo.userName;
    }
  },
  methods: {
    sendMessage() {
      this.mySocket.emit("message", {
        message: this.message,
        name: this.username,
      });
    },
  },
  name: "chatRoom",
  mounted() {
    const socket = io("http://localhost:4000");
    socket.on("connect", () => {
      console.log("连接成功了草。");
    });
    socket.on("message", (data) => {
      this.allMessages.push(data);
    });
    this.mySocket = socket;
  },
};
</script>

<style>
</style>