<template>
  <div class="tollMarket">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>工具市场</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="homeMarket">
      <img :src="$store.state.ali_api_host + bannerImg" alt />
      <div class="scroll">
        <p class="dynamic-title">购买动态:&nbsp;</p>
        <div class="dealScroll">
          <ul :class="{animateadMoney}">
            <li v-for="item in scrollListMoney" :key="item.id">
              <p>{{item.store_name}}</p>
              <p>在{{item.updated_at}}购买了</p>
              <p>{{item.type_name}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="category">
        <ul>
          <li v-for="(item,index) in dataList" :key="index" @click="memberClick(item)">
            <div>
              <img :src="$store.state.ali_api_host + item.tool_img" alt />
            </div>
            <div class="money">
              <span>{{item.tool_name}}</span>
              <span>￥{{item.price}}起</span>
            </div>
            <div class="phone">
              <!-- <span>
                支持平台
                <img src="../../assets/arrowhead/diannao.png" alt />
                <img src="../../assets/arrowhead/shouji.png" alt />
              </span>-->
              <span>
                购买人数
                <p>{{item.deal_num}}</p>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";
import { bodyColor } from "@/utils/mixins";
import { toolsList } from "@/api/list";
export default {
  mixins: [bodyColor("fff")],
  components: {
    MenuSlide
  },

  data() {
    return {
      showMenu: false,
      animateadMoney: false,
      scrollListMoney: [
        {
          store_name: "服务商",
          updated_at: "2019-01-02 12:20",
          type_name: "会员升级"
        },
        {
          store_name: "服务商",
          updated_at: "2019-01-02 12:20",
          type_name: "技能类目"
        }
      ],
      dataList: [],
      bannerImg: ""
    };
  },
  created() {
    this.init();
    if (this.scrollListMoney.length > 1) {
      setInterval(this.showMoney, 2000);
    }
  },
  methods: {
    init() {
      // 工具市场列表
      toolsList()
        .then(res => {
          this.dataList = res.data;
          this.scrollListMoney = res.dynamic;
          this.bannerImg = res.mobile_ad;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    // 返回上一页
    histroyClick() {
      this.$router.go(-1);
    },
    // 滚动
    showMoney() {
      this.animateadMoney = true;
      setTimeout(() => {
        this.scrollListMoney.push(this.scrollListMoney[0]);
        this.scrollListMoney.shift();
        this.animateadMoney = false;
      }, 1000);
    },
    // 会员跳转

    memberClick(item) {
      this.$router.push({
        path: "/tollMarketData?id="+item.id
      });
    }
  }
};
</script>
<style lang="scss">
.tollMarket {
  & > header {
    height: rem(88);
    width: 100%;
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
  & > .homeMarket {
    & > img {
      height: rem(200);
      width: 100%;
    }
    & > .scroll {
      height: rem(77);
      background: #f4f6f8;
      font-size: rem(24);
      padding-left: rem(30);
      display: flex;
      line-height: rem(77);
      .dynamic-title{
        width: max-content;
      }
      & > p {
        color: #999;
      }
      & > .dealScroll {
        height: rem(77);
        overflow: hidden;
        vertical-align: rem(-4);
        display: flex;
        flex-direction: column;

        & > ul {
          width: 100%;
          & > li {
            display: flex;
            width: 100%;
            & > p {
              margin-right: rem(7);
            }

            & > p:nth-child(1) {
              color: #999;
              max-width: rem(130);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-right: 0;
            }

            & > p:nth-child(1) {
              color: #0066cc;
            }

            & > p:nth-child(2) {
              color: #333;
              margin-right: 0;
            }

            & > p:nth-child(3) {
              color: #f3262d;
            }
          }
        }

        & > .animateadMoney {
          transition: all 1s;
          margin-top: rem(-76);

          & > li {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    & > .category {
      padding: rem(20) rem(30) 0;
      & > ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        & > li {
          width: 49%;
          border: rem(1) solid #eee;
          margin-bottom: rem(10);
            padding: rem(10) rem(10);
            box-sizing: border-box;
          & > div:nth-child(1) {
            width: 100%;
            height: rem(320);
            text-align: center;
            & > img {
              width: 100%;
              height: rem(320);
            }
          }
          & > .money {
            font-size: rem(26);
            display: flex;
            margin: rem(20) 0 rem(17);
            justify-content: space-between;
            & > span:nth-child(1) {
              color: #333;
              font-weight: 600;
            }
            & > span:nth-child(2) {
              color: #ff0027;
            }
          }
          & > .phone {
            display: flex;
            justify-content: space-between;
            font-size: rem(20);
            color: #666;
            & > span {
              display: flex;
              & > p {
                color: #0066cc;
              }
            }
          }
        }
      }
    }
  }
}
</style>