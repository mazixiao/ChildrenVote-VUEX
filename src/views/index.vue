<template>
  <div class="v">
    <!-- {{$store.state.count}} -->
    <!-- 不是微信端提示用微信打开 -->
    <div v-if="$store.state.notWeChat" class="isWechatBrowser">请用微信内置浏览器打开</div>

    <div class="index" v-if="!$store.state.notWeChat">
      <img class="index-bg" src="~@/assets/img/index-bg.jpg" alt="">

      <div class="getInfo-wrap">
        <!-- <div class="tit-wrap">
          <img class="tit" src="~@/assets/img/index-tit.png" alt="" />
          <div class="text">请为您最喜欢的团队和视频投出一票</div>
        </div> -->

        <div class="staff-form">
          <div class="form-con">
            <div class="item item22">
              <div class="input-wrap select" @click="usernameChoice">
                <input v-model.trim="staffForm.username" type="text" placeholder="您的姓名" />
              </div>
            </div>
          </div>
          <div class="commit" @click="commit">去投票</div>


          <transition name="fade">
            <div class="error" v-if="usernameError">*请选择或输入您的姓名</div>
          </transition>

        </div>
      </div>


      <!-- <img class="footer-img" src="~@/assets/img/footer-img.png" alt="" /> -->


      <!-- 选择工作区域select -->
      <!-- <awesome-picker ref="picker2" :textTitle="usernamePicker.textTitle" :data="usernamePicker.data"
        @confirm="usernamePickerConfirm" v-if="usernamePicker.data"></awesome-picker> -->


      <van-popup v-model="showPicker" round position="bottom">
        <div class="search-wrap">
          <input class="search" type="text" placeholder="搜索" v-model="FuzzySearch" @input="FuzzySearchFun">
        </div>
        <van-picker title="请选择姓名" show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm"
          safe-area-inset-bottom="true" />
      </van-popup>

      <!-- safe-area-inset-bottom -->



      <!-- 报名暂时关闭 -->
      <transition name="fade" v-if="isTip1">
        <div class="applyStop">
          <div class="applyStop-con">
            <img class="hint-img" src="@/assets/img/information.png" alt />
            <div class="hint-text" v-html="tip1"></div>
          </div>
        </div>
      </transition>




      <!-- 请先去报名 -->
      <!-- <transition name="fade" v-if="applyNo">
        <div class="applyNow">
          <img class="hint-img" src="@/assets/img/information.png" alt />
          <div class="hint-text">
            {{tip}}
          </div>
        </div>
      </transition> -->

      <!-- 提示弹层略大 -->
      <transition name="fade" v-if="isTip2">
        <div class="applyNow2">
          <!-- 关闭 -->
          <img class="hint-img close" v-if="closeIcon" src="@/assets/img/close.png" alt />
          <!-- 提示 -->
          <img class="hint-img information" v-if="informationIcon" src="@/assets/img/information.png" alt />
          <!-- 成功 -->
          <img class="hint-img success" v-if="successIcon" src="@/assets/img/success.png" alt />
          <div class="hint-text" v-html="tip2"></div>
        </div>
      </transition>

      <transition name="fade" v-if="isTip5">
        <div class="applyStop applyStop2">
          <div class="applyStop-con">
            <img class="hint-img" src="@/assets/img/information.png" alt />
            <div class="hint-text">您已投过票！</div>
          </div>
        </div>
      </transition>
    </div>



  </div>
</template>



<script>
  // ajax
  import { getOpenID, getNameList, voteCommit, updateOpenId } from "@/assets/js/api";
  // vuex
  import { Alert } from "vux";

  import { Button, Toast, Picker, Popup } from "vant";

  // vuex
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";


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

  export default {
    name: "index",
    components: {
      Alert,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Picker.name]: Picker,
      [Popup.name]: Popup,
    },
    data() {
      return {
        // 语言提示
        tip: "",
        // 未报名
        applyNo: false,
        // 是否是微信内置浏览器
        notWeChat: false,
        // 微信code
        wxCode: "",
        openid: "",

        tip1: "",
        // 是否提示
        isTip1: false,

        tip2: "",
        // 是否提示
        isTip2: false,
        isTip3: false,
        isTip4: false,
        isTip5: false,
        closeIcon: false,
        informationIcon: false,
        successIcon: false,

        // 成功之后的弹层
        ok: false,
        id: "",

        // 员工信息
        staffForm: {
          username: "",
        },

        // 选择工作区域组件
        usernamePicker: {
          // anchor: [],
          textTitle: "请选择姓名",
          data: [],
        },
        nameError: false,
        usernameError: false,
        departmentError: false,
        suggestError: false,


        // 1=集团总裁 2=分公司总经理 3=股东
        role: '',
        // 投票次数
        amount: '',
        // 投票一次 票数加几张票
        votenum: '',
        // 地区  上海 无锡  南京 武汉  杭州 惠元
        region: '',



        // 用户id
        userid: '',
        username: '',


        value: '',
        showPicker: false,
        columns: [],

        // 模糊搜索
        FuzzySearch: ''


      };
    },

    created() {
    },
    mounted() {

      // 禁止分享
      document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
        WeixinJSBridge.call('hideToolbar');
      });


      // 获取openId并回显数据
      // this.getWxCode();

      // 解决微信返回按钮到上一页页面不刷新的问题
      window.onpageshow = function (event) {
        //event.persisted 判断浏览器是否有缓存, 有为true, 没有为false
        if (event.persisted) {
          window.location.reload();
          // this.$router.go(0);
        }
      };


      // this.$store.dispatch("getWxCode")

      console.log(this.$store.state.notWeChat, "this.$store.notWeChat")

      this.$store.dispatch('getWxCode', {
        //在此处传入该组件的this，vuex中即可获取this
        _this: this
      });


      // this.


      console.log(this.$store.state.notWeChat, "this.$store.notWeChat")




    },

    methods: {



      FuzzySearchFun() {
        console.log(this.FuzzySearch);



        // 支持模糊查询
        // this.xmgcqkJsonsData：用于搜索的总数据
        //　toLowerCase():用于把字符串转为小写，让模糊查询更加清晰


        let _search = this.FuzzySearch; // 搜索的值

        // if (_search) {

        this.columns = [];

        let newListData = []; // 用于存放搜索出来数据的新数组


        getNameList().then((response) => {
          console.log(response.data, "姓名列表");
          if (response.data.ReturnCode == 0) {
            if (response.data.Data) {
              console.log(response, "选择姓名列表接口(104)");
              response.data.Data.map((item, index) => {
                if (_search) {
                  if (item.username.indexOf(_search) != -1) {
                    newListData.push(item.username);
                  }
                } else {
                  newListData.push(item.username);
                }

              });



              console.log("新数组", newListData)
              this.columns = [];
              this.columns = newListData;
              console.log("新数组", this.columns)


            }
          }
        });



        // }



      },




      // 姓名列表
      getNameListFun() {
        getNameList().then((response) => {
          console.log(response.data, "姓名列表");
          if (response.data.ReturnCode == 0) {
            if (response.data.Data) {
              console.log(response, "选择姓名列表接口(104)");
              response.data.Data.map((item, index) => {
                this.columns.push(item.username);
              });

              // this.$nextTick(function () {
              //   this.usernamePicker.data = response.data.Data;
              // });
            }
          }
        });
      },

      // 选择工作区域组件
      usernameChoice() {
        console.log(this.$store.state, "this.$store.state66")
        if (this.$store.state.openid && this.columns) {
          this.showPicker = true;
          this.columns = [];
          this.getNameListFun();
        }
        // this.$refs.picker2.show();

      },



      onConfirm(value, index) {
        // this.value = value;
        this.showPicker = false;

        console.log(value, "value");
        console.log(index, "下标");


        this.staffForm.username = value;
        this.usernameFun(this.staffForm.username);
      },



      usernamePickerConfirm(v) {
        this.staffForm.username = v[0].value;

        console.log(v, "选择的项目");
        // 选择工作区域,判断是否没有选择
        this.usernameFun(this.staffForm.username);
      },

      nameFun(v) {
        if (!v) {
          this.nameError = true;
          return false;
        } else {
          this.nameError = false;
          return true;
        }
      },

      departmentFun(v) {
        if (!v) {
          this.departmentError = true;
          return false;
        } else {
          this.departmentError = false;
          return true;
        }
      },

      suggestFun(v) {
        if (!v) {
          this.suggestError = true;
          return false;
        } else {
          this.suggestError = false;
          return true;
        }
      },

      usernameFun(v) {
        if (!v) {
          this.usernameError = true;
          return false;
        } else {
          this.usernameError = false;
          return true;
        }
      },

      commit() {

        let username = this.usernameFun(this.staffForm.username);


        console.log(username, "username")

        if (username) {
          var obj = {
            openid: this.$store.state.openid,
            username: this.staffForm.username,
          };

          console.log(this.staffForm.username, "this.staffForm.username")
          // 根据OpenId绑定用户接口(101)
          voteCommit(obj).then((response) => {
            console.log(response.data, "根据OpenId绑定用户接口(101)");
            if (response.data.ReturnCode == 0) {
              if (response.data.Data) {

                // 用户id
                this.$store.state.userid = response.data.Data[0].id;
                this.$store.state.username = response.data.Data[0].username,
                this.$store.state.votenum = response.data.Data[0].votenum;
                this.$store.state.amount = response.data.Data[0].amount;

                this.$router.push({
                  path: "/commitRecord",
                });

              }
            } else if (response.data.ReturnCode == 305) {
              Toast("该用户已经绑定其他微信");
            } else if (response.data.ReturnCode == 110) {
              Toast("该用户不存在");
            }
          });
        }
      },

      okFun() {
        this.ok = false;
        this.staffForm.suggest = '';
      },


      // 禁止微信浏览器下拉弹性效果
      noScroll() {
        var that = this;
        document.body.addEventListener(
          "touchmove",
          function (e) {
            // alert(that.commitOk)
            if (that.ok) {
              e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
            } 
          },
          { passive: false }
        ); //passive 参数不能省略，用来兼容ios和android
      },

      // 关闭成功弹层
      closeOk() {
        this.ok = false;
        // 关闭微信窗口
        WeixinJSBridge.call("closeWindow");
      },

      weixinSendAppMessage(title, desc, link, imgUrl) {
        WeixinJSBridge.invoke("sendAppMessage", {
        });
      },
    },


    watch: {
      ok: {
        //深度监听，可监听到对象、数组的变化
        handler(newName, oldName) {
          if (newName == true) {
            this.noScroll();
          }
        },
        //  deep:true //true 深度监听
        // 页面-加载就执行
        immediate: true,
      },
      isTip1: {
        //深度监听，可监听到对象、数组的变化
        handler(newName, oldName) {
          if (newName == true) {
            this.noScroll();
          }
        },
        //  deep:true //true 深度监听
        // 页面-加载就执行
        immediate: true,
      },
      isTip2: {
        //深度监听，可监听到对象、数组的变化
        handler(newName, oldName) {
          if (newName == true) {
            this.noScroll();
          }
        },
        //  deep:true //true 深度监听
        // 页面-加载就执行
        immediate: true,
      },
    },
  };
</script>

<style lang="sass" scoped>
  @import '~@/assets/scss/index.scss';
</style>