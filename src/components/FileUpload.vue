<template>
  <div class="xxy-upload">
    <div class="tooltip">
      <div class="thumbnail" v-if="defaultUrl && !isVideo">
        <div class="img-wrap">
          <img :src="defaultUrl" v-if="!isVideo" />
        </div>
        <div class="deleteImg" @click="deleteImg(index)">
          <img src="~@/assets/img/close2.png" alt />
        </div>
        <!-- <div class="bg">
                    <div class="previewImg" @click="previewImg(item)">预览</div>
                    <div class="line-1"></div>
                    <div class="deleteImg" @click="deleteImg(index)">删除</div>
        </div>-->
      </div>
      <!-- <div class="d" v-if="defaultUrl && isVideo">
                <video height="160px" width="285px" poster :src="defaultUrl"></video>
                <div class="bg">
                    <div class="deleteImg" @click="deleteImg()">删除</div>
                    <div class="line-1"></div>
                    <div class="previewImg" @click="previewVideo()">预览</div>
                </div>
      </div>-->

      <!--测试-->
      <!-- <el-upload v-show="!defaultUrl || isText" ref="dom_upload" :list-type="listType" :auto-upload="false"
        :on-success="uploadHandle" :on-error="errorHandle" :on-preview="handlePictureCardPreview"
        :on-change="changeHandle" :on-remove="handleRemove" action="http://up-z2.qiniu.com" :data="data" :limit="1"
        :accept="accept" :show-file-list="false" :before-upload="beforeUpload" :on-progress="progress"> -->

      <!--正式-->
      <el-upload v-show="!defaultUrl || isText" ref="dom_upload" :list-type="listType" :auto-upload="false"
        :on-success="uploadHandle" :on-error="errorHandle" :on-preview="handlePictureCardPreview"
        :on-change="changeHandle" :on-remove="handleRemove" action="https://up-z2.qiniup.com" :data="data" :limit="1"
        :accept="accept" :show-file-list="false">
        <i slot="default" class="el-icon-plus"></i>
      </el-upload>
    </div>
    <!-- 预览头像 -->
    <el-dialog :visible.sync="isShowImg" :append-to-body="true" title="预览" custom-class="preview-img" class="agent">
      <img width="100%" :src="showImgSrc" alt />
    </el-dialog>
  </div>
</template>
<script>
  import config from "@/assets/js/config";
  import { uptoken } from "@/assets/js/api";
  import imageConversion from "image-conversion";

  export default {
    name: "FileUpload",
    props: {
      requirement: {
        type: String,
        default: "无",
      },
      defaultUrl: {
        type: String,
        default: null,
      },
      isVideo: {
        type: Boolean,
        default: false,
      },
      isText: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      disabled: false,
      limitCount: 1,
      data: {
        token: "",
      },
      callback: null,
      isShowImg: false,
      showImgSrc: "",
      loading: null,
    }),
    computed: {
      listType() {
        return this.isText ? "list-text" : "picture-card";
      },
      accept() {
        return this.isVideo ? "video/*" : "image/*";
      },
    },
    created() {
      // console.log(this.defaultUrl)
      // console.log(11111)
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.dom_upload && this.$refs.dom_upload.clearFiles();
        //  console.log( this.$refs.dom_upload)
      });
    },
    methods: {

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      action() {
        return location.origin === "http://bdwinningweb.yinchtv.com"
          ? "https://up-z2.qiniup.com"
          : "http://up-z2.qiniu.com";
      },
      getuptoken() {
        //发起请求获取token
        uptoken().then((res) => {
          // console.log(res)
          return res.data.Data[0].Token;
        });
      },
      startupload(cb, e) {
        let that = this;
        let up = that.$refs.dom_upload;
        that.callback = cb;


        // //1.首先声明seconds 超过40秒取消上传
        // var seconds = 1;
        // //2.声明定时器
        // var timer = null;
        // //3.开启定时器
        // timer = setInterval(show, 1000);
        // function show() {
        //   if (seconds == 0 && that.$refs.dom_upload) {
        //     clearInterval(timer); //清除定时器
        //     // 取消上传请求
        //     that.$refs.dom_upload.abort();
        //     // 清空已上传的文件列
        //     that.deleteImg();
        //     // 关闭loading
        //     if (that.loading) that.loading.close();
        //     return;
        //   }
        //   //将不断变化的秒数显示在页面上
        //   seconds--;
        // };




        if (up && up.uploadFiles.length > 0 && !up.uploadFiles[0].response) {
          // that.loading = this.$loading({
          //   lock: true,
          //   text: "文件上传中...",
          //   customClass: "full-loading",
          // });


          that.loading = this.$loading({
            background: 'rgba(255,255,255, 0.7)',
            lock: true,
            text: "上传中...",
            customClass: "full-loading",
          });

          uptoken().then((res) => {
            that.data.token = res.data.Data[0].Token;
            that.$refs.dom_upload.submit();
            console.log(up.uploadFiles[0].response);
          });
        } else {
          cb();
        }
      },
      uploadHandle(response, file, fileList) {
        // debugger
        console.log("上传成功准备中。。");
        this.$refs.dom_upload && this.$refs.dom_upload.clearFiles();
      },

      errorHandle(err, file, fileList) {
        console.log("上传失败");
        console.log(err, file, fileList);

        // console.log(err, file, fileList);
        this.$refs.dom_upload && this.$refs.dom_upload.clearFiles();
      },


      beforeUpload(file) {

        console.log(file, "165")




        // return false;
        // console.log(file.size / 1024 / 1024, "181")
        // return new Promise((resolve, reject) => {
        //     let isLt2M = file.size / 1024 / 1024 < 4 // 判定图片大小是否小于4MB
        //     if (isLt2M) {
        //         resolve(file)
        //     }
        //     console.log(file, "file")
        //     // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        //     imageConversion.compressAccurately(file, 400).then(res => {
        //         console.log(res, "6666999")
        //         resolve(res)
        //     })
        // })
      },

      progress(event, file, fileList) {
        // console.log(event, file, fileList, "200")
      },


      changeHandle(e, fileList) {
        // debugger;
        let _this = this;
        // if (this.loading) this.loading.close();
        let url = "";
        let img = new Image();
        //   console.log(this.beforeUpload(fileList), "9999")
        if (e.response) {
          console.log("changeHandle----");
          url = config.qiniu.bucketHost + e.response.key;
          console.log(e.raw.size);

          // this.beforeUpload(fileList);

          if (
            (e.raw.type === "image/jpeg" || e.raw.type === "image/png") &&
            e.raw.size < 2097152 * 10
          ) {
            // 小于20兆压缩
            console.log(11111111);
            img.src = url + "?imageView2/2/w/10";
            img.src = url;
            img.onload = function () {
              console.log(img);
              console.log(img.width + "宽=====高" + img.height);
              if (img.width > img.height) {
                console.log("宽大");
                url = url + "?imageView2/2/w/2048";
              } else {
                console.log("高大");
                url = url + "?imageView2/2/h/2048";
              }
              console.log("137", url);
              _this.$emit("update:defaultUrl", url);
              _this.callback && _this.callback();
            };
            console.log(222222);
            console.log("142----", url);
          } else {
            // 大于20兆不压缩
            console.log("142", url);
            _this.$emit("update:defaultUrl", url);
            _this.callback && _this.callback();
          }

          this.$refs.dom_upload && this.$refs.dom_upload.clearFiles();
        } else {
          console.log(11);
          // console.log(e.raw.type)
          // if (e.raw.type.indexOf('image') === -1) {
          //     // console.log(1111)
          //     this.$refs.dom_upload.uploadFiles.pop()
          // }else{
          url = e.url;
          this.$emit("update:defaultUrl", url);
          this.callback && this.callback();
          // }
        }
      },



      handleRemove(file) {
        this.$refs.dom_upload.clearFiles();
        this.$emit("update:defaultUrl", "");
      },
      previewImg() {
        if (this.isVideo) {
          window.open(this.defaultUrl, "_blank");
        } else {
          this.showImgSrc = this.defaultUrl;
          this.isShowImg = true;
        }
      },
      deleteImg() {
        this.$refs.dom_upload.clearFiles();
        this.$emit("update:defaultUrl", "");
      },
      previewVideo() {
        if (this.defaultUrl) {
          window.open(this.defaultUrl, "_blank");
        } else {
          this.$message({
            type: "error",
            message: "资源不存在！",
            duration: 5000,
            onClose: "",
          });
        }
      },
      clearFiles() {
        this.$refs.dom_upload.clearFiles();
      },
    },
  };
</script>
<style lang="scss" scoped>
  @function px2rem750($px, $base-font-size: 37.5px) {
    @return ($px / $base-font-size / 2) * 1rem;
  }

  .xxy-upload {
    margin: 0 auto;
  }

  .tooltip {
    width: px2rem750(500px);
    height: px2rem750(375px);
    margin: 0 auto;
  }


  /deep/ {
    .el-upload--picture-card {
      width: px2rem750(500px);
      height: px2rem750(375px);
      line-height: px2rem750(375px);
      background: #fff;
      border: px2rem750(20px) solid #fdf1e7;
      border-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        color: #b98f4b;
        font-size: 30px;
        font-weight: bold;
      }
    }

    .el-upload--picture-card:hover,
    .el-upload:focus {
      border-color: #fdf1e7;
      /* color: #409EFF; */
    }

    .el-loading-spinner i {
      color: #b98f4b !important;
    }

    .el-loading-spinner .el-loading-text {
      color: #b98f4b;
    }

  }

  .thumbnail {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    border: px2rem750(20px) solid #fdf1e7;


    .img-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    img {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain;
      display: block;
    }

    .deleteImg {
      position: absolute;
      right: px2rem750(-36px);
      top: px2rem750(-36px);
      width: px2rem750(42px);
      height: px2rem750(42px);
    }

    .bg {
      /* display: none; */
      display: inline-flex;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      bottom: 0px;
      left: 0px;
      width: 160px;
      height: 36px;
      justify-content: space-around;
      align-items: center;
      border-radius: 5px;
    }

    &:hover {
      .bg {
        display: inline-flex;

        .previewImg {
          cursor: pointer;
          margin-left: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }

        .deleteImg {
          cursor: pointer;
          margin-right: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }

    .line-1 {
      height: 14px;
      width: 2px;
      background-color: #ffffff;
    }
  }

  .d {
    width: 285px;
    height: 160px;
    border: 1px solid #f0f0f0;
    border-radius: 5px;
    text-align: center;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      display: block;
    }

    .bg {
      display: none;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.5);
      bottom: 0px;
      left: 0px;
      width: 285px;
      height: 36px;
      justify-content: space-around;
      align-items: center;
      border-radius: 5px;
    }

    &:hover {
      .bg {
        display: inline-flex;

        .previewImg {
          cursor: pointer;
          margin-left: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }

        .deleteImg {
          cursor: pointer;
          margin-right: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }

    .line-1 {
      height: 14px;
      width: 2px;
      background-color: #ffffff;
    }
  }

  .my-upload {
    width: 285px;
    height: 160px;
  }

  .el-upload__text {
    margin: -80px auto;
    width: 190px;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFangSC;
    color: #999999;
    font-weight: 500;
    line-height: 22px;
  }

  .el-upload__tip {
    margin: 95px auto;
    width: 255px;
    height: 40px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 18px;
  }

  .el-icon-upload:hover {
    color: #409eff;
  }

  .el-upload-dragger {
    width: 285px;
    height: 160px;
  }

  .agent .el-icon-close:before {
    content: "\e6db" !important;
  }
</style>