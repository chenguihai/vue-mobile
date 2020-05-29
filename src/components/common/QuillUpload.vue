<!--  模板 -->
<template>
  <div class="container bg">
    <div class="editor">
      <quill-editor
        v-model="content"
        ref="myQuillEditor"
        :options="options"
        :disabled="redact"
        @change="onEditorChange($event)"
      ></quill-editor>
      <van-uploader v-show="false" :afterRead="afterRead" :beforeRead="beforeRead">
        <van-button icon="photo">上传图片</van-button>
      </van-uploader>
    </div>
  </div>
  <!-- <div class="ql-editor" v-html="content"></div> -->
</template>

<script>
    import "quill/dist/quill.core.css"; //引入样式
    import "quill/dist/quill.snow.css";//引入样式
    import "quill/dist/quill.bubble.css";//引入样式
    import {uploadImage} from '@/api/commonApi'
    import {quillEditor} from "vue-quill-editor";//引入组件
    export default {
        name: "quillUpload",
        props: {
            //是否可以编辑
            redact: {
                type: Boolean,
                default: false
            },
            //头部是否可显示
            title: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                content: this.text,
                options: {
                    placeholder: "请详细介绍您的服务，1000字以内",
                    modules: {
                        toolbar: {
                            container: [
                                // ["bold", "italic", "underline", "strike"], //切换按钮  //bold 加粗 italic 斜 underline 下划线 strike删除线
                                // ["blockquote", "code-block"], //blockquote 引用 code-block 代码块
                                ["image"], //图片 link 链接  image图片
                                // [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                                // [{ list: "ordered" }, { list: "bullet" }], //排序 ordered 有序  bullet 无序
                                // [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
                                // [{ script: "sub" }, { script: "super" }], // sub上标 / super下标
                                // [{ indent: "-1" }, { indent: "+1" }], // 减少缩进/缩进
                                // [{ direction: "rtl" }], // 文本方向
                                // [{ color: [] }, { background: [] }], // color 字体颜色 background 背景颜色  从主题默认下拉
                                // [{ align: [] }], //文本对齐方式
                                // [{ font: [] }], //字体格式
                                // [{ size: [] }] // 自定义下拉
                            ],
                            handlers: {
                                image: value => {
                                    if (value) {
                                        //禁止软键盘弹出
                                        document.activeElement.blur();
                                        // 触发input框选择图片文件
                                        document.querySelector(".van-uploader input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                }
                            }
                        }
                    }
                }
            };
        },
        computed: {},
        watch: {
            //title变化时触发
            title(bool) {
                if (bool) {
                    document.querySelector(".quill-editor .ql-toolbar").style.display =
                        "none";
                }
            }
        },
        methods: {
            //图片上传成功
            afterRead(file) {
                // console.log("后", file);
            },
            //图片上传前
            async beforeRead(file) {
                // console.log("前", file, file.size / 1024);
                if (file.size == 0) {
                    return false
                }
                if (!/^image\/(jpeg|png|jpg)$/.test(file.type)) {
                    this.$toast("请上传 jpg,jpeg,png 格式图片");
                    return false;
                }

                this.$toast.allowMultiple();
                let loading = this.$toast.loading({
                    duration: 0,
                    mask: false,
                    forbidClick: true,
                    message: "上传中..."
                });

                let fr = new FormData();
                fr.append("imgs", file);
                try {
                    let quill = this.$refs.myQuillEditor.quill;
                    let {message, code, data} = await uploadImage(fr);
                    if (code === 1) {
                        // 获取光标所在位置
                        let indexObj = quill.getSelection();
                        let length = indexObj ? indexObj.index : 0;
                        // 插入图片
                        quill.insertEmbed(length, "image", data.domain + '/' + data.file);
                        // 调整光标到最后
                        quill.setSelection(length + 1);
                        return true;
                    } else {
                        this.$toast(`${message}`);
                    }
                } catch (err) {
                    console.log("错误", err);
                    this.$toast("网络错误，请检查网络连接!");
                } finally {
                    loading.clear();
                }
            },
            //内容改变触发
            onEditorChange() {
                try {
                    let quill = this.$refs.myQuillEditor.quill;
                    if (quill.getLength() > 1000) {
                        this.$toast("服务1000字以内");
                        return
                    }
                    this.$emit("chang", this.content);
                } catch (err) {
                    console.log("错误", err);
                }
            }
        },
        mounted() {
            //初始化title
            this.title == true
                ? (document.querySelector(".quill-editor .ql-toolbar").style.display =
                    "none")
                : "";
        },
        components: {quillEditor}
        // components: { editor }
    };
</script>
<style scoped lang='scss'>
  .container {
    padding: $w_20 $w_30;
  }

  .editor {
    height: 70%;
    position: relative;
    display: flex;
    flex-direction: column;

    .quill-editor {
      height: 100%;
    }

    .ql-toolbar {
      z-index: inherit;
      // position: absolute;
      // top: 0;
    }

    .ql-container {
      flex: 1;

      s,
      i,
      em {
        font-style: italic;
        text-decoration: line-through;
      }
    }
  }
</style>
<style lang="scss">
  .editor {
    .ql-toolbar {
      .ql-image {
        height: 60px;
        width: 100%;
      }
    }

    .ql-snow {
      background: $white;
      font-size: 26px;
    }
  }

</style>
