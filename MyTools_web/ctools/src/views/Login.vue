<template>
  <div>
    <div class="text-center pt-7 text-h5">登入界面</div>
    <div
      id="loginBoard"
      class="flex-column d-flex justify-space-between align-center px-15 pt-10"
    >
      <v-spacer></v-spacer>
      <v-text-field
        label="账户"
        hide-details="auto"
        v-model="account"
      ></v-text-field>

      <v-text-field label="密码" v-model="password"></v-text-field>
    </div>
    <div id="sendBox" class="px-10 d-flex justify-center">
      <v-btn depressed @click="login" class="mx-5"> 登入该账户 </v-btn>
      <v-btn depressed @click="register"> 注册该账户 </v-btn>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
// import qs from "qs";
export default {
  name: "Login",
  data() {
    return {
      account: "",
      password: "",
      user: {},
    };
  },
  methods: {
    login() {
      // 用于处于用户的登入请求。
      var payload = {
        loginUser: this.account,
        loginPassword: this.password,
      };
      this.$store
        .dispatch("loginUser", payload)
        .then(() => {
          alert("登入成功。")
          this.$store.dispatch("getUser");
          let redirectUrl = decodeURIComponent(
            this.$route.query.redirect || "/"
          );
          // 进行地址重路由
          console.log(redirectUrl);
          // 跳转到指定的路由
          this.$router.push({
            path: redirectUrl,
          });
          
        })
        .catch(() => {
          // 在这边由于402的请求不会被拦截，所以会被这边的catch处理。
          alert("密码或者账户有误，登入失败。")
        });
    },
    register(){
      alert("本系统暂不支持注册,请向管理人员申请创建账户。");
    }
  },
};
</script>

<style>
#loginBoard {
  width: 100%;
  height: 300px;
}
#sendBox {
  width: 50%;
  margin: auto;
}
</style>