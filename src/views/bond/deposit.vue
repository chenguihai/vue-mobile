<template>
  <div class="container bg">
    <head-nav title="缴纳保证金"></head-nav>
    <div class="deposit" v-if="skillList.length > 0">
      <p class="deposit_desc">您有如下类目未缴纳保证金，请尽快缴纳。</p>
      <ul class="deposit_wrap">
        <li class="deposit_item pr clearFix" v-for="(item,index) in skillList" :key="index">
          <van-checkbox icon-size="15px" class="check" v-model="item.checked" @change="handleSingle"></van-checkbox>
          <div class="item">
            <div class="name"><span>{{item.cate_name}}</span>
              <i class="deleteIcon" @click="showDelete(item.id,item.cate_name,index)"></i>
            </div>
            <p class="money"><span>保证金</span><span class="price_red">¥{{item.cat_money}}</span></p>
            <div class="detail" @click="queryCate(index)"><span>查看已选类目</span><img class="arrow"
                                                                                  src="@/assets/auth/arrow_right_gray.png"
                                                                                  alt="">
            </div>
          </div>
        </li>
      </ul>
      <div class="select_all">
        <van-checkbox icon-size="15px" class="check_item" v-model="selectAll" @change="handleAllSelect">全选
        </van-checkbox>
        <span>需缴纳保证金 <span class="price_red">¥{{totalPrice}}</span></span>
      </div>
      <fixed-btn name="立即缴纳" :fixed="1" @submit="saveSubmit"></fixed-btn>
    </div>

    <!--无数据-->
    <no-data v-else></no-data>
    <!--弹框-->
    <skyPop v-model="agreeFlag" @change="emitClose" type="cate">
      <template>
        <h5 class="pop-title mb_30">温馨提示</h5>
        <p class="pop-top">确定要删除【{{cateName}}】一级类目吗，删除后该类目下的二级类目和三级类目都会被被删除哦，并有以下影响：</p>
        <p class="pop-bottom w_rate">1、您将不能发布该类目下服务 <br>
          2、您将不能参与该类目下的任务 <br>
          3、您将不能购买该类目下的线索 <br>
          4、请选择其他类目弥补空缺，让赚钱来得更容易
        </p>
        <div class="pop-empty-btn" @click="emitSubmit">确认删除</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
  import {skillList, deletecate, marginOrder} from '@/api/bond'
  import skyPop from '@/components/service/order/skyPop'
  import noData from "@/components/noData";
  import FixedBtn from "@/components/common/FixedBtn";

  export default {
    name: "deposit",
    components: {skyPop, noData, FixedBtn},
    data() {
      return {
        skillList: [],
        selectIndex: 0,
        cateName: '',
        skillId: 0,
        agreeFlag: false,
        totalPrice: 0,
        selectAll: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      saveSubmit() {
        this.marginOrderHttp();
      },
      async marginOrderHttp() {
        let idArr = this.skillList.filter(item => item.checked === true).map(item => item.id)//	是	array	多个缴纳类目id
        if (idArr.length === 0) {
          this.$toast('请先选择类目');
          return
        }
        let params = {entered_skillId: idArr}
        let data = await marginOrder(params);
        if (!data) return;
        this.$router.push(`/payment?order_sn=${data.order_sn}&type=4`)
      },
      handleSingle() {
        this.selectAll = this.skillList.every(item => item.checked === true);
        this.totalPrice = this.skillList.reduce((prev, cur) => {
          if (cur.checked) {
            return prev - (-cur.cat_money);
          }
          return prev
        }, 0);
      },
      handleAllSelect(val) {
        this.skillList.map(item => item.checked = val)
        this.totalPrice = this.skillList.reduce((prev, cur) => {
          if (cur.checked) {
            return prev - (-cur.cat_money);
          }
          return prev
        }, 0);
      },
      showDelete(id, name, index) {
        this.selectIndex = index;
        this.skillId = id;
        this.cateName = name;
        this.agreeFlag = true;
      },
      queryCate(index) {
        this.selectIndex = index;
        this.$router.push({path: '/viewCategory', query: {index: index}})
      },
      async getList() {
        let data = await skillList();
        if (!data) return
        this.skillList = data;
      },
      async delete() {
        let params = {
          id: this.skillId,//	是	int	当前入主技能id
          type: 1,//	是	int	删除的为几级类目 1：一级类目 2：二级类目 3：三级类目
          cat_id: this.skillId,//	是	int	删除的类目id
        }
        let data = await deletecate(params);
        if (!data) return
        this.skillList.splice(this.selectIndex, 1);
        this.emitClose();
      },
      emitClose() {
        this.agreeFlag = false;
      },
      emitSubmit() {
        this.delete();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "@/css/sky-pop.scss";

  .deposit {
    padding: $w_30 $w_15 168px;

    .deposit_desc {
      height: 33px;
      line-height: 33px;
      font-size: 24px;
      color: $c_666;
    }

    .deposit_wrap {

    }

    .deposit_item {
      background: $white;
      margin: $w_20 0;
      padding: 20px 20px 0 40px;

      .item {
        padding: 0 $w_20 0 $w_10;
      }

      .check {
        position: absolute;
        left: 10px;
        top: 24px;
        z-index: 10;
      }

      .name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 37px;
        line-height: 37px;
        font-size: 26px;

        .deleteIcon {
          width: 22px;
          height: 22px;
          background: url("/static/images/auth/trash.png") no-repeat center;
          background-size: 22px 22px;
        }
      }

      .money {
        font-size: 22px;
        height: 37px;
        line-height: 37px;
        margin: $w_10 0 $w_20;
      }

      .price_red {
        font-size: 26px;
        margin-left: 13px;
      }

      .detail {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 22px;
        height: 70px;
        border-top: 1px solid $c_ccc;

        .arrow {
          width: 12px;
          height: 22px;
        }
      }
    }

    .select_all {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      font-size: 22px;
      color: $c_666;
      margin: 16px 0 20px;

      .check_item {
      }
    }
  }
</style>
