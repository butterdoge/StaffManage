import Axios from "axios";
import router from "../router";
import qs from "qs";
// 首先对axios进行封装，涉及到路由操作。

if (window.localStorage.getItem("token")) {
  Axios.defaults.headers.common["Authorization"] =
    `Bearer ` + window.localStorage.getItem("token");
}
// 如果本地已经有了登入记录的token，则将它保存在请求头内部。

export let instance = Axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://sayhub.me/api"
      : "http://localhost:4000/api",
});
// 根据生产环境的差异设置不同的baseURL。

// respone拦截器，对收到的401请求进行路由重置，这里的401请求回作为error被拦截，在这里就得到处理。
instance.interceptors.response.use(
  (response) => {
    return response;
    // 有点没看懂，算是照常响应的意思？
  },
  // 这里有一个问题，那就是密码错误的处理逻辑和未登入的处理逻辑是同一个。
  (error) => {
    if (error.response) {
      console.log("存在错误，路由重定义中——");

      switch (error.response.status) {
        case 401:
          router.replace({
            path: "/Login",
            query: { redirect: router.currentRoute.fullPath },
            // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
          alert("您还尚未登入！")
          break;
        case 500:
          alert("请先登入后再进行操作")
          router.replace({
            path: "/Login",
            query: { redirect: router.currentRoute.fullPath },
            // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
      }
    }
    // reject该Promise，表示报错，由error处理程序传递。
    return Promise.reject(error.response);
  }
);

// 发送登入请求
export const login = ({ loginUser, loginPassword }) => {
  return instance.post(
    "/login",
    qs.stringify({
      username: loginUser,
      password: loginPassword,
    })
  );
};

//发送获取用户状态的请求。
export const getUserInfo = () => {
  return instance.get("/profile");
};

// 获取不同的组织列表
export const getUnits = () => {
  return instance.get("getUnites");
};

// 获得指定组织的用户
export const getUsersOfCertainUnit = (ParaUnitID) => {
  console.log(`收到的unit参数为:`), console.log(ParaUnitID);
  return instance.get("/getUserOfUnit", {
    params: {
      unitID: ParaUnitID,
    },
  });
};

// 修改用户信息
export const changeUserInfo = (changedInfo) => {
  console.log(`收到的unit参数为:`);
  return instance.post("/updateUser", qs.stringify(changedInfo));
};

// 创造新用户
export const createUser = (UserInfo) => {
  console.log(`收到的userInfo为`);
  console.log(UserInfo);
  return instance.post(
    "/createNewUser",
    qs.stringify({
      username: UserInfo.name,
      password: UserInfo.password,
      unitID: UserInfo.unitID,
      authority: UserInfo.authority,
      description: UserInfo.description,
    })
  );
};

// 导出了一个基本共用的axios和2个直接封装好的方法。

export const sendSheet=(sheetInfo)=>{
  console.log(`收到的表格信息为`);
  return instance.post("/sendSheet",qs.stringify(sheetInfo));
}

export const getSheets=()=>{
  console.log("获取所有表单信息中");
  return instance.get("/sheets");
}

export const getUserUnitData=()=>{
  console.log("获取不同组织中人数数据")
  return instance.get("/numsData")
}

export const getAuthoData=()=>{
  console.log("获取不同权限的人数数据")
  return instance.get("/authorData")
}