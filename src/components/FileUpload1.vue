<template>
    <div class="xxy-upload1" style="width: 100%;">
        <!--测试-->

        <!-- <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload> -->

      <div v-for="(item, index) in list" class="div11" :key="index">
        <div class="bg">
            <!-- <div class="previewImg" @click="previewImg(item)">预览</div> -->
            <div class="line-1"></div>
            <div class="deleteImg" @click="deleteImg(index)">删除</div>
        </div>
        <img :key="index" :src="item"/>
    </div>


        <el-upload ref="dom_upload" list-type="picture-card" :multiple="true"
                   style="margin-bottom: 15px"
                   :auto-upload="false" :on-success="uploadHandle" :on-change="changeHandle"
                   v-show="list.length!==maxCount"
                   :on-remove="removeHandle"
                   action="http://up-z2.qiniu.com" :on-error="errorHandle"
                   :data="data" :accept="accept" :limit="count" :show-file-list="false">
            <!--正式-->
            <!--<el-upload ref="dom_upload" list-type="picture-card" :multiple="true"
                       style="margin-left: 20px;margin-bottom: 15px"
                       :auto-upload="false" :on-success="uploadHandle" :on-change="changeHandle"
                       v-show="list.length!==maxCount"
                       :on-remove="removeHandle"
                       action="https://up-z2.qiniup.com" :on-error="errorHandle"
                       :data="data" :accept="accept" :limit="count" :show-file-list="false">-->

            <slot>
                <div class="aaa">
                    <!--<i class="el-icon-circle-plus-outline"></i>-->
                    <i class="el-icon-circle-plus-outline"></i>
                    <div class="el-upload__text1">{{text1}}</div>
                    <div class="el-upload__text2">{{text2}}</div>
                </div>
            </slot>
        </el-upload>
        <!--<div class="imageDiv">-->
        <!-- <draggable v-model="list"> -->

        <!-- </draggable> -->
        <!--</div>-->
        <!-- 预览头像 -->
        <el-dialog :visible.sync="isShowImg" title="预览" :append-to-body="true" custom-class="preview-img" class="agent">
            <img :src="showImgSrc" width="100%">
        </el-dialog>
    </div>
</template>
<script>
    // import draggable from 'vuedraggable'
    import config from '@/assets/js/config'
    import {uptoken} from "@/assets/js/api";


    export default {
        props: {
            maxCount: {
                type: Number,
                default: 3
            },
            text1: {
                type: String,
                default: '点击上传'
            },
            text2: {
                type: String,
                default: '支持jpg/gif/png格式，文件大小不超过2M，建议比例为1:1'
            },
            requirement: {
                type: String,
                default: '无'
            },
            isVideo: {
                type: Boolean,
                default: false
            },
            isText: {
                type: Boolean,
                default: false
            },
            fileList: {
                type: Array,
                default: []
            }
        },
        components: {
            // draggable
        },
        data: () => ({
            data: {
                token: ''
            },
            count: 3,
            list: [],
            callback: null,
            isShowImg: false,
            showImgSrc: '',
            loading: null
        }),
        computed: {
            accept() {
                return 'image/*'
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.dom_upload && this.$refs.dom_upload.clearFiles()
            })
        },
        watch: {
            fileList(a, b) {
                console.log('MMM:' + a)
                if (b.length === 0) {
                    this.count = 4 - a.length
                    this.list = a
                }
            }
        },
        updated() {
            console.log("========================LidtUrl:"+this.list)
            this.$emit('update:fileList', this.list)
        },
        methods: {
            action() {
                return location.origin === 'http://bdwinningweb.yinchtv.com' ? 'https://up-z2.qiniup.com' : 'http://up-z2.qiniu.com'
            },
            startupload(cb) {
                let that = this
                let up = that.$refs.dom_upload
                this.callback = cb
                let a = false
                up.uploadFiles.forEach(item => {
                    if (item.status !== 'success') {
                        a = true
                    }
                })
                if (!a) {
                    cb()
                    return
                }
                if (up && up.uploadFiles.length > 0 && !up.uploadFiles[up.uploadFiles.length - 1].response) {
                    that.loading = this.$loading({
                        lock: true,
                        text: '文件上传中...',
                        customClass: 'full-loading'
                    })
                    uptoken().then(res => {
                        that.data.token = res.data.Data[0].Token
                        that.$refs.dom_upload.submit();
                        console.log(res)
                    })
                } else {
                    cb()
                }
            },
            uploadHandle(response, file, fileList) {
                // console.log("MM:"+fileList)
                // console.log(response)
                //  console.log(2222222)
                //  console.log( this.list)
                // // console.log(1111111111)


                this.list.forEach((item, index) => {
                    fileList.forEach(a => {
                        if (item === a.url) {
                            if (a.raw.size >= 2097152) {
                                this.list[index] = config.qiniu.bucketHost + a.response.key + '?imageView2/2/w/1024/h/1024'
                            } else {
                                this.list[index] = config.qiniu.bucketHost + a.response.key
                            };
                            console.log(a.response.key)
                        }
                    })
                })
                console.log(response);
                console.log(file);
                console.log(fileList);
                console.log(this.list);
                this.$emit('update:fileList', this.list);
                console.log(111)
            },
            errorHandle(err, file, fileList) {
                console.log(err, file, fileList)
            },
            changeHandle(e) {
                let _this = this
                if (this.loading) this.loading.close()
                let url = ''
                let img = new Image()
                if (e.response) {
                    url = config.qiniu.bucketHost + e.response.key
                    // 图片大于2M后会被压缩
                    if ((e.raw.type === 'image/jpeg' || e.raw.type === 'image/png') && e.raw.size >= 2097152) {
                        img.src = url + '?imageView2/2/w/10'
                        img.onload = function () {
                            console.log(img)
                            console.log(img.width + '宽=====高' + img.height)
                            if (img.width > img.height) {
                                console.log('宽大')
                                url = url + '?imageView2/2/w/1024'
                            } else {
                                console.log('高大')
                                url = url + '?imageView2/2/h/1024'
                            }
                            _this.callback && _this.callback()
                        }
                    } else {
                        console.log('142', url)
                        console.log(this.$refs.dom_upload)
                        _this.callback && _this.callback()
                    }
                    this.$refs.dom_upload && this.$refs.dom_upload.clearFiles()
                } else {
                    // console.log(this.$refs.dom_upload)
                    // console.log(this.fileList)
                    // console.log(e.raw.type.indexOf('image'))
                    if (this.count <= 0) {
                        this.$refs.dom_upload.uploadFiles.pop()
                    } else {
                        if (e.raw.type.indexOf('image') === -1) {
                            this.$refs.dom_upload.uploadFiles.pop()
                        } else {
                            this.list.push(e.url)
                        }
                    }
                    // console.log(this.$refs.dom_upload)
                    // console.log(33333)
                    // console.log(this.fileList)
                    // console.log(3333333)
                    this.callback && this.callback()
                }
            },
            removeHandle(file) {
                this.$emit("update:defaultUrl", "");
                console.log(file)
            },

            // 清除文件
            clearFiles() {
                this.$refs.dom_upload.clearFiles()
            },
            // 删除图片
            deleteImg(arg) {
                if (this.$refs.dom_upload.uploadFiles.length !== 0) {
                    this.$refs.dom_upload.uploadFiles.forEach((item, index) => {
                        if (item.url === this.list[arg]) {
                            this.$refs.dom_upload.uploadFiles.splice(index, 1)
                        }
                    })
                }

                this.list.splice(arg, 1)
            }
        }
    }
</script>
<style lang="scss">
    .div11 {
        position: relative;
        width: 100%;
        height: 180px;
        display: block;
        border-radius: 5px;
        border: 1px solid #f0f0f0;
        margin-left: 20px;
        text-align: center;
        overflow: hidden;
        img {
            width: 180px;
            display: block;
        }
    }


    .line-1 {
        height: 14px;
        width: 2px;
        background-color: #FFFFFF;
    }

    .xxy-upload1 {
        /* display: inline-flex;
        flex-direction: row; */
    }
      
    .aaa .el-upload__text1 {
      position: relative;
      bottom: 115px;
      margin: auto;
      width: 73px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 20px;
  }

  /* .aaa {
     width: 180px;
     height: 180px
   }*/

  .aaa .el-icon-circle-plus-outline {
    position: relative;
      bottom: 40px;
      font-size: 29px;
      color: rgba(153, 153, 153, 1);
      font-weight: 100
  }


  .aaa .el-upload__text2 {
      position: relative;
      bottom: 100px;
      margin: auto;
      width: 141px;
      height: 54px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      line-height: 18px;
  }

  .agent .el-icon-close:before {
      content: "\e6db" !important;
  }
</style>
