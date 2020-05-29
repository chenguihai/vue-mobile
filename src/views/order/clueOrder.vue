<template>
  <div class="myThread">
    <head-nav title="线索订单"></head-nav>
    <div class="myThreadList">
      <listBox
        :refreshLoading.sync="isLoading"
        :listLoading.sync="listLoading"
        :dataArr="dataArr"
        :dataObj="dataObj"
        @load="loadData"
      >
        <div
          class="thread_item"
          v-for="(item , index) in dataArr"
          :key="index"
          @click="threadClick(item)"
        >
          <div>
            <span>{{item.title}}</span>
            <span>¥{{item.budget_money || item.amount}}</span>
          </div>
          <div>
            <span>联系人：{{item.name}}</span>
            <span v-if="item.mobile !=='' && item.mobile !== '隐藏'">手机号码：{{item.mobile}}</span>
            <span v-if="item.qq">QQ：{{item.qq}}</span>
            <span v-if="item.wechat">微信：{{item.wechat}}</span>
            <span v-if="item.email">邮箱：{{item.email}}</span>
          </div>
          <div>
            <span>下单时间：{{item.pay_time}}</span>
            <span v-if="item.status == 'N'">已关闭</span>
            <span v-else-if="item.status == 'Y'">未关闭</span>
            <span v-else-if="item.status == 'S'">已成交</span>
          </div>
        </div>
      </listBox>
    </div>
    <upBack/>
  </div>
</template>
<script>
    import listBox from "@/components/service/listBox";
    import {myClue} from "@/api/list";
    import {clueList} from "@/api/order";
    import upBack from "@/components/service/upBack";

    export default {
        name: "clueOrder",
        components: {listBox, upBack},
        data() {
            return {
                finished: false,
                listLoading: false,
                isLoading: false,
                error: false,
                dataArr: [],
                dataObj: {},
                page: "1",
                form: {
                    // page: 1, //	是	integer	页码
                    // time: '', // =2019-10-10,2019-10-25&
                    // title: '', // =测试
                    // cluestatus: ''// = N:已关闭,Y:未关闭'
                }
            };
        },
        methods: {
            async loadData(page) {
                page === 1 ? await this.onRefresh() : await this.getList(page);
            },
            async onRefresh() {
                await this.getList(1);
                // this.$toast("刷新成功");
                this.isLoading = false;
            },
            async getList(page = 1) {  //线索订单
                this.listLoading = true;
                let data = await clueList(page);
                this.listLoading = false;
                if (!data) return;
                this.dataObj = {
                    current_page: data.current_page,
                    total: data.total,
                    per_page: data.per_page
                };
              this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
            },
            threadClick(item) {
                // this.$router.push({
                //     path: `/clues/detail/${item.id}`
                // });
                window.location.href = location.origin+"/clues/detail/"+item.id;
            }
        }
    };
</script>
<style lang="scss" scoped>
  @import "@/css/common.scss";

  .myThread {
    & > header {
      height: rem(88);
      width: 100%;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      & > div {
        & > img {
          display: block;
          width: rem(20);
          height: rem(36);
          margin-left: rem(20);
        }
      }

      & > h2 {
        font-size: rem(34);
        color: #030303;
      }

      & > .dian {
        display: flex;
        margin-right: rem(44);

        & > div {
          width: rem(8);
          height: rem(8);
          border-radius: 50%;
          background: #999;
          margin-right: 6px;
        }
      }

    }

    & > .myThreadList {
      .thread_item {
        margin-top: rem(20);
        border-radius: rem(20);
        padding: 0 rem(30);
        background: #fff;

        & > div {
          display: flex;

          justify-content: space-between;


        }

        & > div:nth-child(1) {
          padding-top: rem(33);
          font-size: rem(28);
          line-height: rem(40);

          & > span:nth-child(1) {
            width: rem(531);
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: #333;
            font-weight: 600;
          }

          & > span:nth-child(2) {
            color: #ff0027;
          }
        }

        & > div:nth-child(2) {
          flex-wrap: wrap;
          font-size: rem(24);
          color: #666;
          border-bottom: 1px solid #eee;
          padding-bottom: rem(20);

          & > span {
            width: rem(320);
            margin-top: rem(20);
          }
        }

        & > div:nth-child(3) {
          font-size: rem(22);
          color: #999;
          padding: rem(24) 0 rem(33);
        }
      }
    }
  }

</style>
