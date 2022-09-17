<template>
  <div class="d-flex flex-column align-center justify-center">
    <h2 class="mt-5">单位管理界面</h2>
    <v-container>
      <v-container style="coler:blue">
        <h4>您所隶属的单位为:{{ this.$store.state.userInfo.unitName }}</h4>
        <h4>您在该组织的管理级别为:{{ this.AuLevel }}</h4>
        <h4>
          您在该组织的描述为:{{ this.$store.state.userInfo.unitDescription }}
        </h4>
      </v-container>

      <v-divider></v-divider>
      <v-alert border="left" color="#ffe58f" dark>
        关于权限，系统管理员可以管理所有用户，但请从用户管理入口；单位管理员可以管理该单位下的用户，其他成员只具备查看的权限。
      </v-alert>
      <v-container id="UsersSelected">
        <user-info
          v-for="user in currentUnitUsers"
          :key="user.uuid"
          :userDetail="user"
          @changeRequest="handleChange"
        >
        </user-info>
      </v-container>
      <dialog-change :dialog="dialogOrNot" :userInfo="userToBeChangedInfo">
      </dialog-change>
    </v-container>
  </div>
</template>

<script>
import { getUsersOfCertainUnit } from "../utils/api";
import UserInfo from "@/components/UserInfo.vue";
import dialog from "@/components/dialog.vue";
export default {
  components: {
    "user-info": UserInfo,
    "dialog-change": dialog,
  },
  name: "unitManage",
  mounted() {
    getUsersOfCertainUnit(this.$store.state.userInfo.unitID).then((res) => {
      this.currentUnitUsers = res.data;
    });
  },
  data() {
    return {
      currentUnitUsers: [],
      blue: 1,
      dialogOrNot: false,
      userToBeChangedInfo: {},
    };
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to, from, next);
    next();
  },
  computed: {
    example() {
      return "1";
    },
    AuLevel() {
      switch (this.$store.state.userInfo.authority) {
        case 1: {
          return "系统管理员";
        }
        case 2: {
          return "部门管理员";
        }
        case 3: {
          return "一般成员";
        }
        default:
          return "规格外存在";
      }
    },
  },
  methods: {
    handleChange(userinfo) {
      console.log(userinfo);
      this.userToBeChangedInfo = userinfo;
      this.dialogOrNot = true;
      console.log("changeHandled");
    },
  },
};
</script>

<style>
</style>