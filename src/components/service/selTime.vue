<template>
  <van-overlay :show="show">
    <div class="time-box">
      <van-datetime-picker style="width:100%;" :formatter="formatter" v-model="stime" type="date" :min-date="minDate" @confirm="sure" @cancel="cancel" />
    </div>
  </van-overlay>
</template>

<script>
/* eslint-disable */
Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}
import { isString, browser } from '@/utils/tool'
export default {
  name: 'selTime',
  components: {},
  props: ['time', 'show', 'min'],
  model: {
    prop: 'time',
    event: 'change'
  },
  data () {
    return {
      oldTime: null,
      first: false,
      isUp: false,
      // formatStr: browser.versions.ios ? 'yyyy/MM/dd' : 'yyyy-MM-dd',
      formatStr: 'yyyy-MM-dd'
    }
  },
  computed: {
    minDate () {
      let date = new Date()
      if (this.min) {
        date.setDate(date.getDate() + this.min)
      }
      return date
    },
    stime: {
      get () {
        let t = this.time
        if (browser.versions.ios) t = t.replace(/\-/g, "/")
        return (isString(t) && t) ? new Date(t) : t
      },
      set (val, oldVal) {
        if (!this.first) {
          this.first = true
          return
        }
        this.$emit('change', val.format(this.formatStr))
      }
    }
  },
  updated () {
    if (this.show && !this.isUp) {
      this.oldTime = this.time
      this.isUp = true
    }
    if (!this.show) {
      this.isUp = false
    }
  },
  methods: {
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
    sure (val) {
      this.oldTime = this.time
      this.$emit('change', val.format(this.formatStr))
      this.cancel()
    },
    cancel () {
      this.oldTime !== this.time && this.$emit('change', this.oldTime)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="scss">
.time-box {
  @include flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
}
</style>
