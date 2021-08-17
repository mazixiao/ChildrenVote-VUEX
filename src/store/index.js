
import Vue from 'vue';
import Vuex from 'vuex';

// 引入路由
import router from '../router'
import { Button, Toast } from "vant";

// ajax
import { getOpenID, getNameList, voteCommit, updateOpenId } from "@/assets/js/api";
Vue.use(Vuex);


// 判断是否为公众号模拟器环境
const isWechat = () => {
  return (
    String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
    "micromessenger"
  );
};
// 判断公众号截取code
const getUrlParam = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};


// 东西需要state
// 缓存一动看getters
// 同步需看mutations
// 异步找打actions


const store = new Vuex.Store({
  state: {
    count: 222222,

    // 是否是微信内置浏览器
    notWeChat: false,
    // 微信code
    wxCode: "",
    openid: "",


    // 用户id
    userid: '',
    // 用户名字
    username: "",
    // 投票次数
    amount: '',
    // 投票一次 票数加几张票
    votenum: '',


  },
  // 类似vue的computed(计算属性)
  // getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
  getters: {


  },
  // 类似于事件,更改Vuex的store中的状态的唯一方法
  // 向 store.commit 传入额外的参数，即 mutation 的 载荷（payload）,比如下面的 n
  // 在大多数情况下，载荷应该是一个对象
  // mutation 都是同步事务
  mutations: {



    // 重定向获取code
    getWxCodeRedirect() {
      //为测试号id
      let appid = "wx08bfc749a05da85c";

      // 正式路径
      // bdbsxwx.yinchtv.com
      // let link = 'http://bdbsxwx.yinchtv.com/#/vote';

      // 测试路径
      let link = "http://bdlyh5.yinchtv.com";
      //不存在就打开上面的地址进行授权
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
      //   link
      // )}&response_type=code&scope=snsapi_base&state=${new Date().getTime()}#wechat_redirect`;



      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent("http://yinchh5web.yinchtv.com/ChildrensDayResult")}&response_type=code&scope=snsapi_base&state=${new Date().getTime()}#wechat_redirect`;


    },




    // 获取微信code并且拿到openid
    getWxCode(state) {


      if (isWechat()) {
        state.notWeChat = false;
      // 获取微信code
      let code = getUrlParam('code');
      // console.log('微信code' + code);

      // /-----------------------------------------------------------------------


      // state.openid = "oOEgp02xCQIBdVALe3f81wdwOiBY";
      // // 更据OpenId获取用户信息(105)
      // updateOpenId({
      //   openid: state.openid
      // }).then((response) => {
      //   console.log(response.data, "更据OpenId获取用户信息(105)00-vuex");

      //   if (response.data.ReturnCode == 0) {
      //     state.userid = response.data.Data[0].id;
      //     state.username = response.data.Data[0].username;
      //     state.votenum = response.data.Data[0].votenum;
      //     state.amount = response.data.Data[0].amount;
      //     router.push({
      //       path: "/commitRecord",
      //     });
      //   } 
      // });

      // return;

      // /-----------------------------------------------------------------------

      if (code) {
        state.wxCode = code;
        getOpenID({ code: state.wxCode }).then((response) => {
          // console.log(response.data, "获取openid");
          // 如果获取到openid
          if (response.data.Data) {
            if (response.data.ReturnCode == 0) {
              if (response.data.Data[0].openid) {
                state.openid = response.data.Data[0].openid.replace(/\+/g, "*").replace(/\//g, "^").replace(/=/g, "-").replace(/_/g, "^=^");

                // 更据OpenId获取用户信息(105)
                updateOpenId({ openid: state.openid }).then((response) => {
                  console.log(response.data, "更据OpenId获取用户信息(105)00");
                  if (response.data.ReturnCode == 0) {
                    state.userid = response.data.Data[0].id;
                    state.username = response.data.Data[0].username;
                    state.votenum = response.data.Data[0].votenum;
                    state.amount = response.data.Data[0].amount;
                    router.push({
                      path: "/commitRecord",
                    });

                  } else if (response.data.ReturnCode == 305) {
                    Toast("微信已绑定");
                  } else {
                    // 获取姓名
                    this.getNameListFun();
                    console.log(1111)
                  }
                });
              }
            }
          } else {
            // 重定向获取code
            this.commit("getWxCodeRedirect");
          }
        });
        return;
      }

      // 重定向获取code
      this.commit("getWxCodeRedirect");
      } else {
        // 不是用微信打开链接
        state.notWeChat = true;
      }
    },
  },
  // Action 类似于 mutation，不同在于：
  // Action 提交的是 mutation，而不是直接变更状态。
  // Action 可以包含任意异步操作。
  actions: {
    getWxCode({ commit }, data) {
      commit("getWxCode", data)
    }
  }
})


export default store;