<template>
  <van-popup v-model="show" round position="bottom" @close="onClose" :style="{ height: 'auto' }">
    <div class="popup">
      <h4 class="title">选择到账银行卡</h4>
      <ul class="bank_nav" v-if="roleType === 2">
        <!--status 1、个人 2、企业-->
        <li v-if="leftArr.length >0" :class="['nav_item',navIndex === 0?'active':'']" @click="clickNav(0)">个人银行卡</li>
        <li v-if="rightArr.length >0" :class="['nav_item',navIndex === 1?'active':'']" @click="clickNav(1)">对公银行卡</li>
      </ul>
      <div v-else class="line"></div>
      <ul class="bank_list" v-if="bankList.length > 0">
        <li class="band_item" v-for="(item,index) in bankList" :key="item.id" @click.stop="clickBank(index)">
          <p class="name">{{item.bankname}}</p>
          <div class="card">{{item.banknumber|cardF}}</div>
          <i :class="['selectIcon',index === selectIndex?'active':'']"></i>
        </li>
      </ul>
      <i class="deleteIcon" @click="onClose"></i>
    </div>
  </van-popup>
</template>

<script>
  import {filterCard} from '@/utils/tool'

  export default {
    name: "selectBank",
    props: {
      list: {
        type: Array,
        default: [],
      }
    },
    data() {
      let left = [], right = [], list = this.list;
      for (let i = 0; i < list.length; i++) {
        if (list[i].status === 1) {
          left.push(list[i]);
        } else {
          right.push(list[i]);
        }
      }
      return {
        show: true,
        navIndex: 0,
        selectIndex: -1,
        leftArr: left,
        rightArr: right,
        bankList: left.length > 0 ? left : right,
        roleType: 1,
      }
    },
    created() {
      let storeInfo = localStorage.getItem('storeInfo')
      if (storeInfo) {
        let data = JSON.parse(storeInfo)
        this.roleType = data.type_id;
      }
      console.log(this.bankList, this.leftArr, this.rightArr)
    },
    methods: {
      clickBank(index) {
        this.selectIndex = index;
        let val = this.bankList[this.selectIndex];
        this.$emit('submit', val)
      },
      clickNav(index) {
        this.navIndex = index;
        this.bankList = index === 0 ? this.leftArr : this.rightArr;
      },
      onClose() {
        this.$emit('close')
      },

    },
    filters: {
      cardF(data) {
        if (!data) {
          return ''
        }
        let val = data.substr(0, 4) + "********" + data.substr(data.length - 4)
        return val
      },
    }
  }
</script>

<style scoped lang="scss">
  .popup {
    position: relative;
    padding: 33px 28px 100px;

    .deleteIcon {
      position: absolute;
      top: $w_30;
      right: 40px;
      z-index: 10;
      width: 20px;
      height: 20px;
      background: url("/static/images/black_delete.png") no-repeat center;
      background-size: 20px;
    }

    .title {
      @include height(40px);
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 14px;
    }
  }
  .line{
    border-bottom: 1px solid $c_eee;
   }
  .bank_nav {
    display: flex;
    justify-content: space-between;
    @include height(48px);
    border-bottom: 1px solid $c_eee;

    .nav_item {
      font-size: 28px;
      color: $c_666;
      width: 237px;
      text-align: center;

      &.single {
        color: $red;
      }

      &.active {
        color: $red;
        border-bottom: 2px solid $red;
      }
    }
  }

  .bank_list {
    .band_item {
      position: relative;
      padding: 24px 0 24px 46px;
      border-bottom: 1px solid $c_eee;

      .name {
        @include height(40px);
        font-size: 28px;
      }

      .card {
        @include height(33px);
        font-size: 24px;
        color: $c_666;
      }

      .selectIcon {
        visibility: hidden;
        position: absolute;
        top: 44px;
        right: 20px;
        z-index: 10;
        width: 38px;
        height: 28px;
        background: url("/static/images/icon-success.png") no-repeat center;
        background-size: 28px 28px;

        &.active {
          visibility: visible;
        }
      }
    }
  }
</style>
