<template>
  <div class="v">
    <!-- {{this.$store.getters.userid}} -->
    <!-- 不是微信端提示用微信打开 -->
    <div v-if="$store.state.notWeChat" class="isWechatBrowser">请用微信内置浏览器打开</div>
    <div class="index" v-if="!$store.state.notWeChat">
      <img class="index-bg" src="~@/assets/img/index-bg2.jpg" alt="">
      <div class="getInfo-wrap">
        <div class="record-wrap">
          <div class="tit-wrap2">
            <!-- <img class="tit" src="~@/assets/img/Entry.png" alt="" /> -->
          </div>
          <div class="video-wrap">
            <div class="item" v-for="(item, index) in videoWrap" :key="index">
              <div class="item-top">

                <div class="videos" @click="scrollTop11(index)">
                  <video class="video" :src="item.videourl" controls="controls" @play="handlePlay(index)"
                    webkit-playsinline='true' playsinline='true' :poster="item.poster">
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
              </div>
              <div class="item-bottom">
                <div class="left-info">
                  <div class="name">{{item.teamname}}</div>

                  <div class="video-tit">
                    <div class="name22">{{item.name}}</div>
                    <div class="number22">票数 {{item.tickets}}</div>
                  </div>

                </div>

                <div class="right-info">
                  <div :class="['number', {fadeInDown4: index == buttonActive}]">+{{voteNumber}}</div>
                  <div v-if="item.isvote == 0" class="operation" @click="voteFun(index)">立即投票</div>
                  <div v-if="item.isvote == 1" class="operation active" @click="voteFun(index)">已投票</div>
                  <div v-if="item.isvote == 2" class="operation" @click="voteFun(index)">再次投票</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="tanceng" v-show="tanceng">
        <div class="shadow" @click="closeTanceng"></div>
        <div class="tanceng-con">
          <img class="tanceng-img" src="~@/assets/img/tanceng.png" alt="" />
          <div class="text">{{tip}}</div>
        </div>
      </div>

      <!-- <img class="footer-img" src="~@/assets/img/footer-img.png" alt="" /> -->
    </div>
  </div>
</template>


<script type="text/javascript">
  document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
  });
</script>
<script>

  // ajax
  import { programList, vote } from "@/assets/js/api";
  // vuex
  import { Alert } from "vux";

  // vuex
  import { mapState, mapGetters, mapMutations, mapActions } from "vuex";


  import { Button, Toast } from "vant";

  import poster0 from '../assets/img/posters/poster0.png';
  import poster1 from '../assets/img/posters/poster1.png';
  import poster2 from '../assets/img/posters/poster2.png';
  import poster3 from '../assets/img/posters/poster3.png';
  import poster4 from '../assets/img/posters/poster4.png';
  import poster5 from '../assets/img/posters/poster5.png';
  import poster6 from '../assets/img/posters/poster6.png';
  import poster7 from '../assets/img/posters/poster7.png';

  // 判断是否为公众号模拟器环境
  const isWechat = () => {
    return (
      String(navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) ===
      "micromessenger"
    );
  };
  // 判断公众号截取code
  const getUrlParam = name => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  };

  export default {
    name: "commitRecord",
    components: {
      Alert,
      [Button.name]: Button,
      [Toast.name]: Toast,
    },
    data() {
      return {
        // 是否是微信内置浏览器
        notWeChat: this.$store.state.notWeChat,
        // 微信code
        wxCode: "",
        openid: "",


        recordWrap: [],

        videoWrap: [
          // {
          //   src: 'https://www.w3school.com.cn/i/movie.ogg',
          //   tit: '视频1',
          // },
          {
            src: 'http://v.files.taiwan.cn/vod/nine/video/2021/05/24/E303B0944B14460aB3A5A94F6BE577DA2.mp4',
            tit: '视频2',
          },
          {
            src: 'http://v.files.taiwan.cn/vod/tww/HDgaoqing/yuanchuang/2021/05/24/CF1239735A3B41d69F59F7F1F700934B2.mp4',
            tit: '视频3',
          },
          {
            src: 'http://v.files.taiwan.cn/vod/tww/HDgaoqing/yuanchuang/2021/05/24/097366602A6C403c84AF6EE6374818F02.mp4',
            tit: '视频4',
          },

        ],
        // 当前播放的视频
        videoSrc: '',
        buttonActive: null,

        // 是否展示弹层
        tanceng: false,
        // 创建一个数组
        videoElement: [],


        // 1=集团总裁 2=分公司总经理 3=股东
        role: '',
        // 投票次数
        amount: '',
        // 投票一次 票数加几张票
        votenum: '',


        // 用户id
        userid: '',
        // 节目id
        rightid: '',
        // 用户姓名
        username: '',
        // 地区  上海 无锡  南京 武汉  杭州 惠元
        region: '',

        tip: '',

        // 定时器
        time1: null,
        time2: null,

        // +票数
        voteNumber: '',
        // 能投几次
        amount: '',

        // 当前投了第几次
        IsSingle: '',


        // 不能重复点击
        isClick: true,

      };
    },



    computed: {
      // // 写法1
      // 直接获取state里面的初始值
      // showGreen() {
      //   return this.$store.state.showGreen;
      // },

      // // 获取getters里面的数据
      // getStateCount() {
      //   return this.$store.getters.getStateCount;
      // },

      // // 写法2
      // ...mapState({
      //   // showGreen: state => state.showGreen
      //   showGreen: (state)=> {
      //     return state.showGreen;
      //   },
      // }),

      // 写法3, 上面注释的简写(2种方式)
      ...mapState(["userid", "username", "amount", "votenum"]),




      // // 用户id
      // userid: '',
      // // 用户名字
      // username: "",
      // // 投票次数
      // amount: '',
      // // 投票一次 票数加几张票
      // votenum: '',


      contractFile() {
        return this.$store.state.userid
      }


    },




    created() {



    },
    mounted() {




      console.log(this.$store.state.userid, "this.$store.state.userid");
      console.log(this.$store.state.username, "this.$store.state.username");
      console.log(this.$store.state.votenum, "this.$store.state.votenum");
      console.log(this.$store.state.amount, "this.$store.state.amount");


      // 禁止分享
      document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
        WeixinJSBridge.call('hideToolbar');
      });


      // 解决微信返回按钮到上一页页面不刷新的问题
      window.onpageshow = function (event) {

        //event.persisted 判断浏览器是否有缓存, 有为true, 没有为false
        if (event.persisted) {
          window.location.reload();
          // this.$router.go(0);
        }
      };
      this.videoElement = document.getElementsByTagName('video') // 获取页面上所有的video对象

    },



    methods: {


      handlePlay(index) {
        const videoElement = this.videoElement
        if (videoElement && videoElement.length > 0) {
          for (let i = 0; i < videoElement.length; i++) {
            if (i === index) {
              this.videoElement[i].play()
            } else {
              this.videoElement[i].pause()
            }
          }
        }
      },


      // 投票
      voteFun(index) {



        this.userid = this.$store.state.userid;
        // 地区  上海 无锡  南京 武汉  杭州 惠元
        this.region = this.videoWrap[index].region;
        this.rightid = this.videoWrap[index].id;
        let obj = {
          username: this.username,
          userid: this.userid,
          rightid: this.rightid,
          votenum: this.votenum,
          region: this.region,
        };



        if (!this.isClick) {
          return;
        }
        this.isClick = false;

        // 投票接口(103)
        vote(obj).then(res => {
          console.log(res.data, "投票接口(103)");
          if (res.data.ReturnCode == 0) {
            this.buttonActive = index;
            this.voteNumber = res.data.Data[0].votenum;
            // 防抖
            if (this.time1) {
              clearTimeout(this.time1);
            }
            this.time1 = setTimeout(() => {
              this.buttonActive = null;
            }, 1000);
            this.programListFun(this.userid);
          } else if (res.data.ReturnCode == 211) {
            // Toast("该用户不存在");
            this.tip = '该用户不存在';
            this.tanceng = true;
            this.buttonActive = null;
            // 防抖
            if (this.time2) {
              clearTimeout(this.time2);
            };
            this.time2 = setTimeout(() => {
              this.tanceng = false;
            }, 1000);
          } else if (res.data.ReturnCode == 306) {
            // Toast("支持一下其他团队呗！");
            this.tip = '支持一下其他团队呗！';
            this.tanceng = true;
            this.buttonActive = null;
            // 防抖
            if (this.time2) {
              clearTimeout(this.time2);
            };
            this.time2 = setTimeout(() => {
              this.tanceng = false;
            }, 1000);

          } else if (res.data.ReturnCode == 308) {
            // Toast("已没有投票机会咯");
            this.tip = '您已投过票';
            this.tanceng = true;
            this.buttonActive = null;
            // 防抖
            if (this.time2) {
              clearTimeout(this.time2);
            };
            this.time2 = setTimeout(() => {
              this.tanceng = false;
            }, 1000);
          } else if (res.data.ReturnCode == 203) {
            // Toast("已没有投票机会咯");
            this.tip = '投票暂未开启';
            this.tanceng = true;
            this.buttonActive = null;
            // 防抖
            if (this.time2) {
              clearTimeout(this.time2);
            };
            this.time2 = setTimeout(() => {
              this.tanceng = false;
            }, 1000);
          };


          this.isClick = true;
        })




      },


      // 关闭弹层
      closeTanceng() {
        this.tanceng = false;
      },

      programListFun(userid) {
        // 节目列表接口(102)
        programList({ userid: this.userid }).then(res => {
          console.log(res, "节目列表接口(102)");

          // return;
          if (res.data.ReturnCode == 0) {
            this.videoWrap = res.data.Data;
            this.IsSingle = res.data.IsSingle;

            for (let i = 0; i < this.videoWrap.length; i++) {
              if (i == 0) {
                this.videoWrap[i].poster = poster0
              }
              if (i == 1) {
                this.videoWrap[i].poster = poster1
              }
              if (i == 2) {
                this.videoWrap[i].poster = poster2
              }
              if (i == 3) {
                this.videoWrap[i].poster = poster3
              }
              if (i == 4) {
                this.videoWrap[i].poster = poster4
              }
              if (i == 5) {
                this.videoWrap[i].poster = poster5
              }
              if (i == 6) {
                this.videoWrap[i].poster = poster6
              }
              if (i == 7) {
                this.videoWrap[i].poster = poster7
              }

            }
            console.log(this.videoWrap, "this.videoWrap")

          }
        })
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
            } else {
              // return
            }

            // if (that.isTip1) {
            //   e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
            // } else {
            //   // return
            // }
            // if (that.isTip2) {
            //   e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
            // } else {
            //   // return
            // }
          },
          { passive: false }
        ); //passive 参数不能省略，用来兼容ios和android
      },

      // 点击视频的那一项滚动到页面顶部
      scrollTop11(index) {
        console.log(index, "index")
      },


    },


    // 销毁
    destroyed() {
      // clearInterval(this.time1);
      clearTimeout(this.time1);
    },








    watch: {

      // this.$store.dispatch('getWxCode', {
      //   //在此处传入该组件的this，vuex中即可获取this
      //   _this: this
      // });


      tanceng: {
        //深度监听，可监听到对象、数组的变化
        handler(newName, oldName) {
          if (newName == true) {
            this.noScroll();

            console.log(this.tanceng, "tancengtancengtanceng")
          }
        },
        //  deep:true //true 深度监听
        // 页面-加载就执行
        immediate: true,
      },


      contractFile: {

        handler(newName, oldName) {
          if (newName) {
            console.log(newName, "newName");
            this.userid = newName;
            this.userid = this.$store.state.userid
            this.username = this.$store.state.username
            this.votenum = this.$store.state.votenum
            this.programListFun(newName)
          } else {
            this.$router.push({
              path: "/",
            });
          }
        },
        //  deep:true //true 深度监听
        // 页面-加载就执行
        immediate: true,
      }

    },

  };
</script>

<style lang="sass" scoped>
  @import '~@/assets/scss/commitRecord.scss';
</style>