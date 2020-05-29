<template>
  <div class="comment-icon" :class="evcla">
    <template v-if="isRadio">
      <div class="radio" @click="$emit('update:nowSel', type)">
        <p class="radio-icon" :class="{active: nowSel === type}"></p>
        <p class="radio-text">{{evclaText}}</p>
        <img class="icon rf" :src="icon"/>
      </div>
    </template>

    <template v-if="!isRadio">
      <div class="comment-icon" @click="clickCommon">
        <img class="icon" :src="icon"/>
        <p>{{evclaText}}<span v-if="showNum !== false">({{showNum}})</span></p>
        <van-rate v-if="showRate" class="rate" :readonly="true" gutter="0.08rem" size="0.33rem" v-model="value"
                  color="#ee0a24" void-icon="star" void-color="#eee"/>
      </div>
    </template>
  </div>
</template>

<script>
  const hpI = require('@/assets/service/hp.png')
  const zpI = require('@/assets/service/zp.png')
  const cpI = require('@/assets/service/cp.png')
  export default {
    name: 'commentIcon',
    data() {
      return {}
    },
    props: {
      type: Number, // 1好评 2中评 3差评
      value: [Number, String],
      showRate: {
        type: Boolean,
        default: true
      },
      showNum: {
        type: [Boolean, Number],
        default: false
      },
      isRadio: {
        type: Boolean,
        default: false
      },
      events: {
        type: String,
        default: ''
      },
      color: {
        type: String
      },
      nowSel: Number
    },
    computed: {
      evcla() {
        switch (this.type) {
          case 3:
            return 'cp'
          case 2:
            return 'zp'
          default:
            return 'hp'
        }
      },
      evclaText() {
        switch (this.type) {
          case 3:
            return '差评'
          case 2:
            return '中评'
          default:
            return '好评'
        }
      },
      icon() {
        switch (this.type) {
          case 3:
            return cpI
          case 2:
            return zpI
          default:
            return hpI
        }
      }
    },
    methods: {
      clickCommon() {
          if(!this.events){
            return
          }
          this.$emit('emit',this.type)
      }
    }
  }
</script>

<style scoped lang="scss">
  .comment-icon {
    font-size: 20px;
    font-family: $font;
    font-weight: 400;
    @include flex;

    &.hp {
      color: $red;
    }

    &.zp {
      /*color: #ffc948;*/
      color: $c_666;
    }

    &.cp {
      /*color: black;*/
      color: $c_666;
    }
  }

  .icon {
    @include square(36);
    margin-right: 10px;
    // background: $red;
    @include round(50%);

    &.rf {
      margin-right: 0;
      margin-left: 10px;
    }
  }

  .radio {
    @include flex(flex-start);

    .radio-text {
      color: #999;
    }

    .radio-icon {
      @include square(28);
      background: #fff;
      border: 1px solid #999;
      @include round(50%);
      @include flex(center);
      margin-right: 10px;

      &.active::after {
        content: " ";
        @include square(20);
        @include round(50%);
        background: $red;
      }
    }
  }

  .rate {
    margin-left: 10px;
  }
</style>
