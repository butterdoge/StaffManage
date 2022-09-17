<template style="overflow: auto">
  <div
    class="d-flex flex-column justify-center align-center px-7"
    style="overflow: auto"
  >
    <h2 class="my-8">成员信息管理</h2>
    <h4>创建用户</h4>
    <v-alert border="left" color="#ffe58f" dark width="100%" dense >
        创建用户的规则如下。<br>
        （1）仅系统管理员和单位管理员可以创建用户。
        （2）单位管理员仅可以创建自己单位的用户。
        （3）不可以越级创建高级用户。<br>
        （4）验证阶段会在提交时执行。
      </v-alert>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="addedUser.name"
              :counter="10"
              label="用户名称"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="addedUser.password"
              :counter="10"
              label="用户密码"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="8">
            <v-text-field
              v-model="addedUser.description"
              label="关于用户的描述信息"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="5">
            <v-select
              v-model="addedUser.unitID"
              :items="UnitsName"
              item-value="unitID"
              item-text="name"
              filled
              label="组织名称"
            ></v-select>
          </v-col>

          <v-col cols="12" md="2">
            <v-select
              v-model="addedUser.authority"
              :items="[1, 2, 3]"
              filled
              label="权限级别"
            ></v-select>
          </v-col>

          <v-col cols="12" md="2">
            <v-btn @click="createUserMethod">创建用户！</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <h4>用户查询</h4>
    <v-container>
      <v-alert border="left" color="#ffe58f" dark width="100%" dense>
        修改用户信息的规则如下。<br>
        （1）若为系统管理员，则可以自由修改。
        （2）若为单位管理员，则只可以修改普通成员和自身。
        （3）若为普通成员，则只可以修改自身信息。
      </v-alert>
      <v-row align-content="center" justify="center">
        <v-col cols="12" md="4">
          <v-select
            v-model="selectedUnit"
            :items="UnitsName"
            item-value="unitID"
            item-text="name"
            filled
            label="组织名称"
          ></v-select>
        </v-col>

        <v-col cols="12" md="2">
          <v-btn @click="getUsersQuery">执行查询</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container id="UsersSelected" >
      <!-- user-info触发的事件只能直接被user-info处理，可能要研究下如何冒泡什么，不过算是完成组件间通讯了。 -->
      <user-info
        v-for="user in respondUsers"
        :key="user.uuid"
        :userDetail="user"
        @changeRequest="handleChange"
      >
      </user-info>
    </v-container>
    <dialog-change :dialog="dialogOrNot" :userInfo="userToBeChangedInfo">

    </dialog-change>
  </div>
</template>

<script>
import { getUsersOfCertainUnit } from "../utils/api";
import UserInfo from "@/components/UserInfo.vue";
import dialog from "@/components/dialog.vue"
// import UserInfo from '../components/UserInfo.vue';
export default {
  components: {
    "user-info": UserInfo,
    "dialog-change":dialog,
  },
  name: "memberManage",
  data() {
    return {
      dialogOrNot:false,
      blue: 1,
      selectedUnit: 1,
      addedUser: {
        name: "",
        password: "",
        description: "",
        unitID: 1,
        authority: 1,
      },
      userInfoDemo: {
        username: "bili",
        authority: 1,
        uuid: 1,
        description: "ehentai",
      },
      respondUsers: null,
      userToBeChangedInfo:{

      }
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
    UnitsName() {
      return this.$store.state.units;
    },
  },
  methods: {
    createUserMethod() {
      console.log("执行创造用户");
      if(this.addedUser.authority<=this.$store.state.userInfo.authority){
        alert("您不可以越级创建高级用户。");
        return;
      }
      if(this.$store.state.userInfo.authority==3){
        alert("普通成员无权限添加用户。")
        return;
      }
      if(this.addedUser.unitID!=this.$store.state.userInfo.unitID&&this.$store.state.userInfo.authority!=1){
        alert("除非您是系统管理员，否则您所创建的用户只可隶属于您所在组织。")
        return;
      }
      var requestResult = this.$store.dispatch("createNewUser", this.addedUser);
      requestResult.then(function (result) {
        alert("新用户创建成功。");
        console.log(result);
      });
    },
    getUsersQuery() {
      console.log("方法检测");
      console.log(getUsersOfCertainUnit);
      getUsersOfCertainUnit(this.selectedUnit).then((res) => {
        if (res.status === 200) {
          console.log("读取组织成员数据成功");
          console.log(res.data);
          this.respondUsers = res.data;
        }
      });
    },
    // 信息修改模块，限制修改的对象可以是什么。
    handleChange(userinfo){
      console.log(userinfo)
      // 检查是否为普通用户，如果是，只可以修改自己。
      if(this.$store.state.userInfo.authority==3&&userinfo.uuid!=this.$store.state.userInfo.userID){
        alert("抱歉，普通用户无法修改自己以外的成员信息。")
        return
      }
      //如果是管理员用户。
      if(this.$store.state.userInfo.authority==2){
        // 如果不是自己。
        if(userinfo.uuid!=this.$store.state.userInfo.userID){
          if(userinfo.unitID!=this.$store.state.userInfo.unitID){
            alert("仅可以修改本组的对象。")
            return;
          }
          if(userinfo.authority<=this.$store.state.userInfo.authority){
            alert("不可以修改和自己同级别或者级别更高的对象");
            return;
          }
        }
      }

      if(this.$store.state.userInfo.authority==1){
        if(userinfo.uuid!=this.$store.state.userInfo.userID){
          if(userinfo.authority==1){
            alert("不可以修改和自己同级别或者级别更高的对象");
            return;
          }
        }
      }
      
      this.userToBeChangedInfo=userinfo;
      this.dialogOrNot=true;
      console.log("changeHandled")
    }
  },
};
</script>

<style>
</style>