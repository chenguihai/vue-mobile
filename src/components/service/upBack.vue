<template>
  <transition name="van-fade">
    <div class="back-top" v-show="showBackTop" @click="backTop">
      <van-icon name="down" size="18" color="#ccc"/>
    </div>
  </transition>
</template>

<script>
    import {EventUtil} from '@/utils/tool'

    export default {
        name: 'upBack',
        data() {
            return {
                selectType: this.type,
                screenHeight: window.screen.availHeight,
                scrollTop: 0 // 返回顶部箭头
            }
        },
        computed: {
            showBackTop() {
                return this.scrollTop / this.screenHeight >= 1
            }
        },
        mounted() {
            EventUtil.addHandler(window, 'scroll', this.scrollEvent, true)
        },
        beforeDestroy() {
            EventUtil.removeHandler(window, 'scroll', this.scrollEvent, true)
        },
        methods: {
            scrollEvent() {
                this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            },
            backTop() {
                const speed = Math.floor(-this.scrollTop / 5)
                document.documentElement.scrollTop = document.body.scrollTop = this.scrollTop + speed
                if (this.scrollTop <= 0) return
                requestAnimationFrame(() => this.backTop())
            }
        }
    }
</script>

<style scoped lang="scss">
  .back-top {
    @include square(50);
    position: fixed;
    bottom: 147px;
    right: 30px;
    @include round;
    @include borderBox;
    background: #fff;
    border: 1px solid #ccc;
    @include flex(center);
    transform: rotate(180deg);
  }
</style>
