<template>
  <v-container>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>
            用户信息:{{ userDetail.username }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            用户账户:{{ userDetail.uuid }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            用户权级:{{ userDetail.authority }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            用户描述:{{ userDetail.description }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            用户组织:{{ userDetail.unitID }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn @click="changeUser">修改按钮</v-btn>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "user-info",
  props: ["userDetail"],
  data() {
    return {
      account: "",
      password: "",
      user: {},
    };
  },
  methods: {
    changeUser() {
      console.log("触发事件changeRequest");
      console.log(this.userDetail)
      this.$emit("changeRequest", this.userDetail);
    },
  },
};
</script>
