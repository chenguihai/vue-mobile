<template>
  <div class="not_skill">
    <slot></slot>
    <van-button class="custom_btn" plain type="danger" size="small" @click="submit">{{btnName}}</van-button>
  </div>
</template>

<script>
    /**
     * 1、需要传入按钮的名字  name
     * 2、需要传入文字说明 如 <p class="desc">完善您擅长的领域，让雇主更快匹配您。</p>
     */
    export default {
        name: "addAttribute",
        props: {
            name: {
                type: String,
                reqirue: true
            }
        },
        data() {
            return {
                btnName: this.name
            }
        },
        methods: {
            submit() {
                this.$emit('submit')
            }
        }
    }
</script>

<style scoped lang="scss">
  .not_skill {
    margin: $w_20 $w_15;
    background: $white;
    height: 329px;
    border-radius: 8px;
    color: $c_333;
    padding-top: 50px;
    text-align: center;

    .desc {
      height: 33px;
      line-height: 33px;
      font-size: 24px;
      margin-bottom: 90px;
    }

    .custom_btn {
      height: 56px;
      line-height: 56px;
      padding: 0 28px;
      background: $white;
      font-size: 24px;
      border-radius: 4px;
      border: 1px solid $red;
    }
  }
</style>
