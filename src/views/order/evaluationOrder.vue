<template>
  <div class="contain bg">
    <head-nav title="订单评价"></head-nav>
    <!--nav-->
    <ul class="invoice_nav">
      <li :class="['item',navIndex === index ? 'active':'' ]" v-for="(item,index) in navList" @click="clickNav(index)"
          :key="index">{{item}}
      </li>
    </ul>
    <!--nav-->
    <div class="eval_wrap">
      <listBox ref="listBox" :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
               @load="loadData">
        <div v-for="(item,index) in dataArr" :key="item.id">
          <!--雇主对我的评价-->
          <div class="eval_item active" v-if="navIndex === 0 &&item.u_content" :key="item.id">
            <p class="head">
              <img v-if="item.evaluate ===1" class="icon" src="@/assets/shop/expression_red.png" alt="好评">
              <img v-else-if="item.evaluate ===2" class="icon" src="@/assets/shop/expression_yellow.png" alt="中评">
              <img v-else class="icon" src="@/assets/shop/expression_gray.png" alt="差评">
              <span class="head_name">{{item.evaluate | evaluate}}</span>
              <span class="time">{{item.u_time}}</span>
            </p>
            <p class="eval_fraction">
              <span class="item">工作速度<span class="red">{{item.speed}}</span>分</span>
              <span class="item">完成质量<span class="red">{{item.quality}}</span>分</span>
              <span class="item">服务态度<span class="red">{{item.attitude}}</span>分</span>
            </p>
            <p class="desc">{{item.u_content}}</p>
            <p class="desc" v-if="item.explain"><span class="label">我的解释：</span><span>{{item.explain}}</span></p>
            <p class="split_lines"></p>
            <a tag="div" :href="`serviceOrder?sn=${item.order_sn}`">
              <p class="name">{{item.name}}</p>
              <p class="order_num">订单编号：{{item.order_sn}}</p>
            </a>
            <div class="btn_wrap" v-if="!item.explain || !item.s_content">
              <!--/serviceExplain?sn=订单号&oth=1 解释-->
              <!--/serviceComment?sn=订单号&role=1服务商2雇主&oth=1-->
              <van-button v-if="!item.explain" plain class="btn active"
                          :to="{path:'/serviceExplain',query:{sn:item.order_sn}}">我要解释
              </van-button>
              <van-button v-if="!item.s_content" plain class="btn active"
                          :to="{path:'/serviceComment',query:{sn:item.order_sn, role:1}}">评价雇主
              </van-button>
            </div>
          </div>
          <!--我对雇主的评价-->
          <div class="eval_item active" v-if="navIndex === 1 &&item.s_content" :key="item.id">
            <p class="head">
              <img v-if="item.s_evaluate ===1" class="icon" src="@/assets/shop/expression_red.png" alt="好评">
              <img v-else-if="item.s_evaluate ===2" class="icon" src="@/assets/shop/expression_yellow.png" alt="中评">
              <img v-else class="icon" src="@/assets/shop/expression_gray.png" alt="差评">
              <span class="head_name">{{item.s_evaluate | evaluate}}</span>
              <span class="time">{{item.s_time}}</span>
            </p>
            <p class="desc">{{item.s_content}}</p>
            <p class="split_lines"></p>
            <a tag="div" :href="`serviceOrder?sn=${item.order_sn}`">
              <p class="name">{{item.name}}</p>
              <p class="order_num">订单编号：{{item.order_sn}}</p>
            </a>
          </div>
        </div>
      </listBox>
    </div>
    <upBack/>
  </div>
</template>

<script>
  import listBox from '@/components/service/listBox'
  import {commentList} from '@/api/order'
  import upBack from "@/components/service/upBack";

  export default {
    name: "evaluationOrder",
    components: {listBox, upBack},
    data() {
      return {
        finished: false,
        listLoading: false,
        isLoading: false,
        error: false,
        dataArr: [],
        dataObj: {},
        form: {
          page: 1,//	是	integer	页码
          // order_sn: '',//	否	string	定单号
          // u_content: '',//	否	string	用户评价内容
          // evaluate: '',//	否	integer	1是好评 2是中评 3是差评
          // start_time: '',//	否	integer	搜索开始时间，例:2019-08-29
          // end_time: '',//	否	integer	搜索结束时间，例:2019-08-30
        },
        navList: ['雇主对我的评价', '我对雇主的评价'],
        navIndex: 0,
      }
    },
    created() {
      const {type = 0} = this.$route.query;
      this.navIndex = +type;
    },
    methods: {
      clickNav(index) {
        this.navIndex = index;
      },
      async loadData(page) {
        page === 1 ? await this.onRefresh() : await this.getList(page)
      },
      async onRefresh() {
        await this.getList(1)
        this.isLoading = false
      },
      async getList(page = 1) {
        this.listLoading = true
        this.form.page = page;
        const data = await commentList(this.form);
        this.listLoading = false;
        if (!data) return
        // this.dataArr = data.data
        this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
        this.dataObj = {
          current_page: data.current_page,
          total: data.total,
          per_page: data.per_page
        }
      }
    },
    filters: {
      evaluate(type) { // 1是好评 2是中评 3是差评
        let name = ''
        switch (type) {
          case 1:
            name = '好评'
            break
          case 2:
            name = '中评'
            break
          default:
            name = '差评'
            break
        }
        return name
      }
    }
  }
</script>

<style scoped lang="scss">
  .invoice_nav {
    display: flex;
    align-items: center;
    height: 77px;
    font-size: 26px;
    padding: 0 $w_30;
    background-color: $white;

    .item {
      margin-right: 48px;
    }

    .active {
      color: $red;
    }
  }

  .btn_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 90px;

    .btn {
      margin-left: $w_20;
      width: 135px;
      height: 50px;
      font-size: 24px;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
      color: $c_666;
      background: $white;
      border: 1px solid $c_ccc;
    }

    .active {
      color: $red;
      background: $white;
      border: 1px solid $red;
    }
  }

  .eval_wrap {
    font-size: 22px;

    .eval_item {
      padding: $w_20 $w_30 0;
      background-color: $white;
      margin: $w_20 0;

      &.active {
        padding-bottom: $w_30;
      }

      & > p:not(:last-of-type) {
        margin: $w_10 0;
      }

      .head {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 36px;

        .icon {
          width: 36px;
          height: 36px;
        }

        .head_name {
          font-size: 20px;
          margin-left: $w_10;
          flex: 1;
        }

        .time {
          color: $c_999;
        }
      }

      .eval_fraction {
        margin: $w_10 0;
        line-height: 30px;
        color: $c_666;

        .item {
          &:not(:last-child) {
            margin-right: 80px;
          }
        }
      }

      .desc {
        font-size: 22px;
        line-height: 30px;
        margin: $w_10 0;
      }

      .split_lines {
        margin: $w_20 0;
        border-bottom: 1px solid $c_eee;
      }

      .label {
        color: $c_666;
      }

      .name {
        line-height: 37px;
        font-size: 26px;
        color: $blue;
        margin-bottom: $w_10;

      }

      .order_num {
        color: $c_999;
      }
    }
  }

</style>
<style lang="scss">
  .btn_wrap {
    .van-button--normal {
      padding: 0;
    }
  }
</style>
