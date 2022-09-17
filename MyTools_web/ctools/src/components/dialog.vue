<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <!-- <v-card-title>
        信息修改如下:
      </v-card-title>
      <v-card-subtitle>
          用户名称：{{userInfo.username}}
      </v-card-subtitle>
      <v-card-subtitle>
          用户描述：{{userInfo.description}}
      </v-card-subtitle> -->

      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="12">
             <h3>被修改用户的账户身份ID为:{{userInfoCopy.uuid}}</h3>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="userInfoCopy.username"
                :counter="10"
                label="用户名称"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="userInfoCopy.password"
                :counter="10"
                label="用户密码"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="8">
              <v-text-field
                v-model="userInfoCopy.description"
                label="关于用户的描述信息"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="5">
              <v-select
                v-model="userInfoCopy.unitID"
                :items="UnitsName"
                item-value="unitID"
                item-text="name"
                filled
                label="组织名称"
              ></v-select>
            </v-col>

            <v-col cols="12" md="2">
              <v-select
                v-model="userInfoCopy.authority"
                :items="AuthoValue"
                filled
                label="权限级别"
              ></v-select>
            </v-col>

            <v-col cols="12" md="2">
              <v-btn @click="sendChangeRequest">执行修改请求</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import {changeUserInfo} from '@/utils/api'
export default {
  name: "dialog-change",
  props: ["dialog", "userInfo"],
  data() {
    return {
      account: "",
      password: "",
      user: {},
      userInfoCopy: this.userInfo,
    };
  },
  computed: {
    UnitsName() {
      return this.$store.state.units;
    },
    AuthoValue(){
      switch(this.$store.state.userInfo.authority){
        case 1:
          return [1,2,3];
        case 2:
          return [2,3];
        case 3:
          return [3];
      }
      return [1,2,3];
    }
  },
  created() {
    this.$watch("dialog", () => {
      this.userInfoCopy = this.userInfo;
      //   利用监听属性，这样子每一次打开的时候都会更新infoCopy对象。
    });
  },
  methods: {
      sendChangeRequest(){
        //   只要将绑定好的userInfoCopy发送出去即可。
        changeUserInfo(this.userInfoCopy).then(res=>{
            alert("用户信息修改成功。")
            console.log(res);
            console.log("实现请求")
        })
      }
  },
};
</script>
