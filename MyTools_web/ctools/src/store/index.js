import Vue from 'vue'
import Vuex from 'vuex'

// 引入封装好的axios套件。
import { instance, login, getUserInfo ,getUnits,createUser} from '../utils/api'
Vue.use(Vuex)

export default new Vuex.Store({
  // 保存验证的必要信息，其中token最必要，info我也不知道装杀小。
  state: {
    token: window.localStorage.getItem('token'),
    userInfo: {},
    loginStatus: false,
    units:[]
    // 组织列表
  },

  // 修改全局存储信息。
  mutations: {
    changeUserInfo(state,payload){
      state.userInfo=payload;
    },
    changeToken(state,payload){
      state.token=payload;
    },
    changeLoginStatus(state,payload){
      state.loginStatus=payload;
    },
    changeUnities(state,payload){
      state.units=payload;
    }
  },

  // 执行远程身份验证操作。
  actions: {
    // 登入操作
    loginUser({commit},info){
      // 返回值是一个Promise，根据其状态，用户前端收到代码后可以执行不同操作。
      return new Promise((resolve,reject)=>{
        login(info).then(res=>{
          // 如果响应为233，则读取成功，login的返回结果是响应的报文对象。
          if(res.status===233){
            commit('changeToken',res.data.token)
            // 将token放置在返回代码中。
            commit('changeLoginStatus',true);
            instance.defaults.headers.common['Authorization']=`Bearer `+res.data.token;
            // 默认请求头注入token。
            window.localStorage.setItem('token',res.data.token)
            resolve(res)
          }
      }).catch((error)=>{
        console.log(error);
        reject(error);
      })
    })},
    //判断用户是否为登入状态的操作
    getUser({commit}){
      return new Promise((resolve,reject)=>{
      getUserInfo().then(res=>{
        if(res.status===200){
          commit('changeUserInfo',res.data)
        }
        // 其实只需要是reject了还是resolve即可，具体的value不重要。
        resolve(true);
      }).catch((error)=>{
        console.log(reject);
        throw(error)
        // 表示返回一个错误，该函数需要报错，通常是没有匹配的token。
      })
    })
    },
    // 登出只是一个本地操作。
    logOut({commit}){
        commit('changeUserInfo',null);
        commit('changeLoginStatus',false);
        commit('changeToken','');
        window.localStorage.removeItem('token')
        // 清除了本地的存储登入信息。
    },
    getUnities({commit}){
      return new Promise((resolve,reject)=>{
        getUnits().then(res=>{
          if(res.status===200){
            commit('changeUnities',res.data)
          }
          resolve('Nothing')
        }).catch((error)=>{
          reject(error);
        })
      })
    },
    createNewUser({state},payload){
      console.log(state);
      console.log("payload信息为")
      console.log(payload);
      return new Promise((resolve,reject)=>{
        console.log("此刻的payload为")
        console.log(payload);
        createUser(payload).then(res=>{
          if(res.status===200){
            console.log("提交成功")
          }
          resolve(true)
        }).catch((error)=>{
          reject(error);
        })
      })
    }
  },
    
  modules: {
  }
})
