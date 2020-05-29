import req, {post} from '@/utils/req'
import {regDaqo, isObject, createProxy, mount} from '@/utils/tool'
import {viewFiles} from '@/api/service'
import { apiUrl } from '@/utils/apiUrl'
var urls = apiUrl.replace(/.com[/]api/,'.com')
/**
 * @Description: 分页
 * @param {listName | String} 列表字段名
 * @return: Mixin
 * @Date: 2019-11-02 18:56:56
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
/*
 */
export const pageMixin = listName => {
  return {
    data() {
      return {
        nowPage: 1
      }
    },
    created() {
      this.getData(this.nowPage)
    },
    computed: {
      total() {
        return this[listName].total
      },
      pageSize() {
        return this[listName].per_page
      },
      totalPage() {
        return Math.floor(this[listName].total / this.pageSize)
      }
    },
    methods: {
      async pageChange(cur) {
        await this.getData(cur)
      },
      nextPage() {
        this.nowPage++
      },
      prevPage() {
        this.nowPage--
      }
    },
    watch: {
      nowPage: function (val, oldVal) {
        this.pageChange(val)
      }
    }
  }
}

/**
 * @Description: 倒计时
 * @param {countDownStandard | Number} 倒计时标准
 * @return:
 * @Date: 2019-11-02 18:57:39
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export const countDownMixin = ({countDownStandard = 60, countDownBtnText = '获取验证码'} = {}) => {
  return {
    data() {
      return {
        countDownConfig: {
          countDown: 0,
          countDownStandard,
          countDownBtnText,
          timer: null
        }
      }
    },
    computed: {
      countDownUIText() {
        const {countDown, countDownBtnText} = this.countDownConfig
        return countDown <= 0 ? countDownBtnText : `重新获取(${countDown})`
      },
      canCountDownDo() {
        const {countDown} = this.countDownConfig
        return countDown <= 0
      }
    },
    methods: {
      countDownInit() {
        this.countDownConfig.countDown = this.countDownConfig.countDownStandard
        this.countDownFn()
      },
      countDownFn() {
        this.countDownConfig.timer = setTimeout(() => {
          this.countDownConfig.countDown--
          if (this.countDownConfig.countDown <= 0) return clearTimeout(this.countDownConfig.timer)
          this.countDownFn()
        }, 1000)
      }
    },
    beforeDestory() {
      this.countDownConfig.timer && clearTimeout(this.countDownConfig.timer)
    }
  }
}

/**
 * @Description: 弹窗统一关闭
 * @param {type}
 * @return:
 * @Date: 2019-11-02 20:48:28
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export const dialogMixin = ({closeFnName = 'close'} = {}) => {
  return {
    methods: {
      close(data) {
        this.$emit(closeFnName, data)
      }
    }
  }
}
/**
 * @Description: 上传统一
 * @param {
 * // 自定义上传字段 othOpts 其中$_reqFileName 值为文件字段名
 *
 * 内部字段说明
 * fileLoading type:Boolean 上传是否结束
 * reqFileName Symbol('files') 固定值
 * othOpts :{ // 上传的其他字段
 * [this.reqFileName]: {   // type:Object | String
 *   name: 上传的文件字段名, 必须
 *   extra: 与接口的额外规则 默认{code:1} type:Object
 * }
 * }
 * fileUploadSuccess type:Function 上传成功回调 参数:response
 *
 * }
 * @return:
 * @Date: 2019-11-03 22:47:03
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export const uploadMixin = ({
                              limit = 5,
                              url,
                              baseURL = urls,
                              model = {
                                prop: 'files',
                                event: 'change'
                              }
                            } = {}) => {
  return {

    data() {

      return {
        maxFileSize: 52428800,
        progress: 100,
        fileLoading: false,
        fileHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        reqFileName: Symbol('files'),
        selectType: '',
      }
    },
    computed: {
      imgApi() {
        return url || this.$store.state.uploadApi
      },
      fileList: {
        get() {
          return this.files || []
        },
        set(v) {
          this.$emit('change', v)
        }
      },
      fileLimit() {
        return this.max || limit
      }
    },
    props: [model.prop],
    model,
    methods: {
      moreSize() {
        this.$toast('文件大小不超过50M')
      },
      async beforeRead(files, detail) {
        files.size > this.maxFileSize && this.moreSize(files, detail)
      },
      async afterFile(files, detail) {
        this.fileLoading = true
        let data = {}
        let propName = 'imgs'
        let propOpts = null // TODO propOpts like vue props
        let extra = {code: 1}
        if (this.othOpts) {
          data = this.othOpts
          propOpts = this.othOpts[this.reqFileName]
          if (isObject(propOpts)) {
            if (!propOpts.name) throw new Error('文件上传的字段名未定义')
            propName = propOpts.name
            extra = propOpts.extra || extra
          }
          data[propName] = Array.isArray(files) ? files.map(f => f.file) : [files.file]
        } else {
          data = {[propName]: Array.isArray(files) ? files.map(f => f.file) : files.file}
        }
        const res = await post(
          {
            url: this.imgApi,
            data,
            forms: true,
            baseURL
          },
          {
            onUploadProgress: this.progressFun,
            timeout: 600000
          },
          extra
        )
        this.fileLoading = false
        if (!res) return this.$toast('文件上传失败')
        this.fileUploadSuccess(res.data)
      },
      beforeFileRemove(idx) {
        this.$dialog
          .confirm({
            message: `确定移除附件${idx + 1}？`
          })
          .then(async () => {
            await post(
              {
                url: '/admin/removeFile',
                data: {rmfile: this.fileList[idx]},
                baseURL: urls
              },
              null,
              {code: 1}
            )
            this.fileList.splice(idx, 1)
          })
      },
      progressFun(event) {
        this.progress = ((event.loaded / event.total) * 100) | 0
      },
      fileUploadSuccess(data) {
        // 自定义场景的话  可以在组件内重写这个方法
        const {file} = data
        if (!file) return
        if (this.types === 'card') {
          this.fileList = [{url: file}]
          return;
        }
        this.fileList = Array.isArray(file)
          ? [...this.fileList, ...file.map(f => ({url: f}))]
          : [...this.fileList, {url: file}]
      }
    }
  }
}

export const uploadMixinVideo = ({
                                   limit = 5,
                                   url,
                                   baseURL = urls,
                                   model = {
                                     prop: 'files',
                                     event: 'change'
                                   }
                                 } = {}) => {
  return {
    data() {
      return {
        maxFileSize: 52428800,
        progress: 100,
        fileLoading: false,
        fileHeaders: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        reqFileName: Symbol('files')
      }
    },
    computed: {
      videoApi() {
        return url || this.$store.state.uploadVideoApi
      },
      fileList: {
        get() {
          return this.files || []
        },
        set(v) {
          this.$emit('change', v)
        }
      },
      fileLimit() {
        return this.max || limit
      }
    },
    props: [model.prop],
    model,
    methods: {
      moreSize() {
        this.$toast('文件大小不超过50M')
      },
      removeFile() {
        this.fileList = []
      },
      async beforeRead(files, detail) {
        files.size > this.maxFileSize && this.moreSize(files, detail)
      },
      async afterFile(files, detail) {
        this.fileLoading = true
        let data = {}
        let propName = 'video'
        let propOpts = null // TODO propOpts like vue props
        let extra = {code: 1}
        if (this.othOpts) {
          data = this.othOpts
          propOpts = this.othOpts[this.reqFileName]
          if (isObject(propOpts)) {
            if (!propOpts.name) throw new Error('文件上传的字段名未定义')
            propName = propOpts.name
            extra = propOpts.extra || extra
          }
          data[propName] = Array.isArray(files) ? files.map(f => f.file) : [files.file]
        } else {
          data = {[propName]: Array.isArray(files) ? files.map(f => f.file) : files.file}
        }
        const res = await post(
          {
            url: this.videoApi,
            data,
            forms: true,
            baseURL
          },
          {
            onUploadProgress: this.progressFun,
            timeout: 600000
          },
          extra
        )
        // alert(JSON.stringify(res))
        this.fileLoading = false
        if (!res) return this.$toast('文件上传失败')
        this.fileUploadSuccessVideo(res.data)
      },
      beforeFileRemove(idx) {
        this.$dialog
          .confirm({
            message: `确定移除附件${idx + 1}？`
          })
          .then(async () => {
            await post(
              {
                url: '/admin/removeFile',
                data: {rmfile: this.fileList[idx]},
                baseURL: urls
              },
              null,
              {code: 1}
            )
            this.fileList.splice(idx, 1)
          })
      },
      progressFun(event) {
        this.progress = ((event.loaded / event.total) * 100) | 0
      },
      fileUploadSuccess(data) {
        // 自定义场景的话  可以在组件内重写这个方法
        this.fileList = data ? [{url: data}] : []
      },
      fileUploadSuccessVideo(data) {
        // alert(JSON.stringify(data))
        // 自定义场景的话  可以在组件内重写这个方法
        this.fileList = data ? [{url: data.origin}] : []
        // alert(JSON.stringify([{url: data.origin}]))
        // alert(JSON.stringify(this.fileList))
      }
    }
  }
}

/**
 * @Description: 下载
 * @param {type}
 * @return:
 * @Date: 2019-11-06 09:37:30
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export const downloadMixin = () => {
  return {
    computed: {
      imgHost() {
        return this.$store.state.ali_api_host
      }
    },
    methods: {
      async download(path, name, id) {
        // 兼容其他模块使用  所以添加id  不删减前面的参数
        let url = id ? `/service/downFile?id=${id}` : `${this.imgHost}${path}`
        req(
          {
            url
          },
          {
            headers: {
              'response-content-type': 'application/octet-stream',
              'response-content-disposition': `attachment; filename="${encodeURI(name)}"`
            },
            responseType: 'blob'
          }
        )
          .then(res => this.createDown(res.data, name))
          .catch(e => this.$toast('下载文件失败'))
      },
      createDown(res, name) {
        let blob = new Blob([res], {type: res.type})
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = name // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
      },
      async previewFile(path, name, id) {
        // 兼容其他模块使用  所以添加id  不删减前面的参数
        if (id) {
          const url = await this.getFileForId(id)
          url && window.open(url)
        } else {
          // 根据路径和名字
          if (!name || !path) return this.$message.error('该文件异常')
          if (regDaqo.orderCanRead.test(name)) {
            // 图片查看
            window.open(`${this.imgHost}${path}`)
          } else {
            this.$message.info('暂不支持在线查看该文件,您可以下载至本地查看')
          }
        }
      },
      async getFileForId(id, way) {
        // 根据文件id获取地址
        const res = await viewFiles(id, way).catch(e => this.$message.error('获取文件路径失败'))
        if (!res) return
        return res.url
      }
    }
  }
}

/**
 * @Description: 拦截注入
 * @param {
 * origin 需要拦截的主体方法对象
 * checks 需要执行的检测
 * }
 * @return:
 * @Date: 2019-11-06 16:02:11
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */

export const proxyMixin = (origin = {}, checks = []) => {
  const _origin = {
    checkStore() {
      // 检测当前店铺状态
      return this.role === 2 || !!(this.orderInfo && this.orderInfo.employee.status === 1)
    }
  }
  const methods = createProxy(Object.assign({}, _origin, origin), ['checkStore', ...checks])
  return {
    methods: mount(methods)
  }
}

/**
 * @Description: 更改body class 主题
 * @param {type}
 * @return:
 * @Date: 2019-11-13 17:32:18
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export const bodyColor = className => {
  return {
    data() {
      return {
        oldBodyClass: '',
        oldHtmlClass: '',
        bodyInstance: null,
        htmlInstance: null
      }
    },
    mounted() {
      this.bodyInstance = document.getElementsByTagName('body')[0]
      this.htmlInstance = document.getElementsByTagName('html')[0]
      this.oldHtmlClass = this.htmlInstance.className
      this.oldBodyClass = this.bodyInstance.className
      this.bodyInstance.className = `${this.oldBodyClass} ${className}`
      this.htmlInstance.className = `${this.oldHtmlClass} ${className}`
    },
    beforeDestroy() {
      this.bodyInstance.className = this.oldBodyClass
      this.htmlInstance.className = this.oldHtmlClass
    }
  }
}

import {browser} from '@/utils/tool'
// IOS微信键盘脱焦
export const iosWechatBlur = () => {
  return {
    data() {
      return {
        inpBug: browser.versions.isWeChat && browser.versions.ios
      }
    },
    methods: {
      hackIWBlur() {
        this.inpBug && window.scrollTo(0, 0)
      }
    }
  }
}
// 计算两个时间搓的差时
export const getInterval=(start, end) =>{
  let interval = end - start;
  interval /= 1000;
  const day = Math.round(interval / 60 / 60 / 24);
  const hour = Math.round(interval / 60 / 60 % 24);
  const minute = Math.round(interval / 60 % 60);
  const second = Math.round(interval % 60);
  return { day, hour, minute, second };
}
