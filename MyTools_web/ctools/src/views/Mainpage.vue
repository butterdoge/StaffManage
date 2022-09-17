<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="2" class="flex">
        <v-card width="90%" class="mx-auto my-3 elevation-8">
          <v-navigation-drawer>
            <v-list-item>
              <v-list-item-content>
                <div class="mb-5">
                  <img
                    src="https://iwisspicgo.oss-cn-shanghai.aliyuncs.com/img/%E5%8D%9A%E5%A3%AB2.png"
                    id="subing_head"
                    class="elevation-4 mx-auto"
                  />
                </div>
                <v-list-item-title class="text-h6 text-center font-weight-bold">
                  {{this.$store.state.userInfo.userName}}
                </v-list-item-title>
                <v-list-item-subtitle class="text-center">
                  {{this.$store.state.userInfo.description}}
                </v-list-item-subtitle>
                <v-divider class="mx-0 my-2"></v-divider>
                <v-list-item-title class="text-h6"> 信息管理系统 </v-list-item-title>
                <v-list-item-subtitle> 隶属组织:{{this.$store.state.userInfo.unitName||"未登入"}} </v-list-item-subtitle>
                <v-list-item-subtitle> 该组织描述:{{this.$store.state.userInfo.unitDescription||"未登入"}} </v-list-item-subtitle>
                <v-list-item-subtitle> 权限级别:{{this.AuLevel}} </v-list-item-subtitle>
                <v-divider class="mx-0 my-2"></v-divider>
              </v-list-item-content>
            </v-list-item>

            <!-- 在这下面是正式导航部分 -->

            <v-list dense nav>
              <v-list-item link to="/chatRoom">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>聊天室</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link to="/Login">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>登入入口</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link to="/memberManage">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>成员管理界面</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link to="/unitManage">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>单位管理界面</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link to="/dataAnalysis">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>数据管理与检索</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link to="/dataRefer">
                <v-list-item-icon>
                  <v-icon>mdi-checkbox-marked-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>数据浏览与分析</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            
          </v-navigation-drawer>
        </v-card>
      </v-col>

      <!-- 呈现部分 -->
      <v-col cols="10" class=""> 
        <v-card class="elevation-8 mt-3 mx-auto" width="98%" height="600px" style="overflow: auto">
          <router-view></router-view>
        </v-card>  
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed:{
    AuLevel(){
      switch(this.$store.state.userInfo.authority){
        case 1:{
          return "系统管理员"
        }
        case 2:{
          return "部门管理员"
        }
        case 3:{
          return "一般成员"
        }
        default:
          return "规格外存在"
      }
    }
  },
  mounted(){
    console.log('mounted!!')
    this.$store.dispatch('getUnities');
    console.log('前端Unit数据更新成功！')
  }
};
</script>

<style>
#subing_head {
  width: 150px;
  height: 130px;
  border-style: solid;
  border-radius: 50%;
  border-color: #fde8c6;
  display: block;
}
</style>