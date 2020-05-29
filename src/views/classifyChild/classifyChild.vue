<template>
  <div class="classifyChild">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt/>
      </div>
      <a class="search" href="/serviceSearch">
        <van-cell-group>
          <van-field v-model="value" disabled/>
        </van-cell-group>
        <div class="arrowhead">
          <img src="../../assets/arrowhead/search.png" alt />
        </div>
      </a>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="body">
      <div class="banner">
        <img
          v-if="bannerImg.ad_img != '' && bannerImg.ad_img != null && bannerImg.ad_img !=undefined"
          :src="$store.state.ali_api_host + bannerImg.ad_img"
          alt
        />
      </div>
      <div class="classifyList">
        <ul>
          <li v-for="(item , index) in thirdList" :key="index" @click="thirdClick(item,index)" v-if="index < 8">
            <img
              v-if="item.mobile_icon != '' && item.mobile_icon != null && item.mobile_icon !=undefined"
              :src="$store.state.ali_api_host + item.mobile_icon"
              alt
            />
            <span>{{item.mobile_name}}</span>
          </li>
        </ul>
      </div>
      <div class="releaseClues">
        <div class="releaseCon">
          <span>
            <i>5</i>秒发布广告线索，迅速找到合适媒介资源
          </span>
          <span>
            我们已经解决<i>38878</i>个广告主的需求和实现<i>38878</i>个媒介资源对接
          </span>
          <div>
            <van-cell-group :border="false">
              <van-field v-model="valuePhone" placeholder="您的联系方式" :border="false" />
            </van-cell-group>
            <span @click="releaseClick">立即发布</span>
          </div>
        </div>
      </div>
      <div class="categoryList">
        <div v-for="(item , index) in secondList" :key="index" v-if="item.child !=undefined && item.child.length > 0">
          <span>
            <img
              v-if="item.mobile_icon != '' && item.mobile_icon != null && item.mobile_icon !=undefined"
              :src="$store.state.ali_api_host + item.mobile_icon"
              alt
            />
            {{item.mobile_name}}
          </span>
          <ul>
            <li v-for="(itemC , index) in item.child" :key="index" @click="secondClick(itemC,index)">
              {{itemC.mobile_name}}
            </li>
            <li v-if="item.flage == '1'"></li>
            <li v-if="item.flage == '2'"></li>
            <li v-if="item.flage == '2'"></li>
          </ul>
        </div>
      </div>
      <div class="categoryTab">
        <div class="tabList">
          <ul>
            <li
              v-for="(item , index) in thirdList"
              :key="index"
              :class="{tabActive:tabIndex == index}"
              @click="tabClick(item , index)"
              v-if="index < 10"
            >{{item.mobile_name}}
            </li>
          </ul>
        </div>
        <listBox
          :refreshLoading.sync="isLoading"
          :listLoading.sync="listLoading"
          :dataArr="classList"
          :dataObj="dataObj"
          @load="loadData"
          ref="listBox"
        >
          <div class="categoryCon">
            <ul>
              <li v-for="(item , index) in classList" :key="index" :class="{'liHeight':item.liList}"
                  @click="listData(item,index)">
                <img
                  v-if="item.img != '' && item.img != null && item.img !=undefined"
                  :src="$store.state.ali_api_host + item.img"
                  alt
                />
                <img v-else src="../../assets/default/fuwu.png" alt/>
                <span>{{item.name}}</span>
                <p>￥{{item.price}}</p>
              </li>
              <li class="noClass" v-if="this.classList.length % 2 != 0"></li>
            </ul>
            <!-- <div class="noMore">
              <span>没有更多了</span>
            </div>-->
          </div>
        </listBox>
      </div>
      <upBack></upBack>
    </div>
  </div>
</template>
<script>
import MenuSlide from '@/components/common/MenuSlide'
import listBox from '@/components/service/listBox'
import upBack from '@/components/service/upBack'
import {serviceHot, mainHot, tertiaryHot, homeImage} from '@/api/list'
import {Toast} from 'vant'

export default {
  components: {
    MenuSlide,
    listBox,
    upBack
  },

  data () {
    return {
      showMenu: false,
      valuePhone: '',
      value: '',
      tabIndex: '0',
      classList: [],
      id: this.$route.query.id,
      first_id: '',
      second_id: '',
      third_id: '',
      secondList: [],
      thirdList: [],
      page: '1',
      bannerImg: '',
      listLoading: false,
      isLoading: false,
      dataObj: {}

    }
  },
  created () {
    console.log(this.first_id)
    this.init()
  },
  methods: {
    init () {
      var id = this.id
      mainHot(id)
        .then(res => {
          if (res != false) {
            for (var i in res) {
              this.secondList.push({...res[i], flage: '0'})
            }
            for (var j = 0; j < this.secondList.length; j++) {
              if (this.secondList[j].child) {
                var len = Object.keys(this.secondList[j].child).length
                if ((len + 1) % 3 == 0) {
                  this.secondList[j].flage = '1'
                }
                if ((len + 2) % 3 == 0) {
                  this.secondList[j].flage = '2'
                }
              }
            }
          }
        }).catch(err => {
          console.log(err)
        })
      tertiaryHot(id).then(res => {
        if (res != false) {
          this.thirdList = res
          this.second_id = this.thirdList[0].pid
          this.third_id = this.thirdList[0].id
          if (this.second_id && this.third_id) {
            this.serviceInit()
          }
        }
      }).catch(err => {
        console.log(err)
      })
      var type = '26'
      homeImage(type).then(res => {
        if (res != false) {
          this.bannerImg = res
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // serviceInit() {
    //   var first_id = this.id;
    //   var second_id = this.second_id;
    //   var third_id = this.third_id;
    //   var page = this.page;
    //   serviceHot(first_id, second_id, third_id, page)
    //     .then(res => {
    //       if (res != false) {
    //         this.classList = res.data;
    //         for (var i = 0; i < this.classList.length; i++) {
    //           this.classList[i] = { ...this.classList[i], liList: false };
    //         }
    //         console.log(this.classList);
    //         if (this.classList.length % 2 == 0) {
    //           console.log(this.classList.length);
    //           for (var i = 0; i < this.classList.length; i++) {
    //             if (i == this.classList.length / 2) {
    //               this.classList[i].liList = true;
    //             }
    //           }
    //         } else {
    //           for (var i = 0; i < this.classList.length; i++) {
    //             if (i == Math.ceil(this.classList.length / 2)) {
    //               this.classList[i].liList = true;
    //             }
    //           }
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    // 跳转发布线索
    releaseClick () {
      var reP = /^1[3|4|5|6|7|8][0-9]\d{8}$/
      if (this.valuePhone != '' && reP.test(this.valuePhone)) {
        window.localStorage.setItem('cluePhone', JSON.stringify(this.valuePhone))
        this.$router.push('/clues/release')
      } else {
        this.$toast('请输入正确的号码')
      }
    },
    // 返回上一页
    histroyClick () {
      this.$router.go(-1)
    },
    onClickRight () {
      this.showMenu = true
    },
    closeMenu () {
      this.showMenu = false
    },
    // 搜索
    // searchClick() {
    //   console.log("1");
    // },
    // tab切换
    tabClick (item, index) {
      this.classList = []
      this.tabIndex = index
      this.second_id = item.pid
      this.third_id = item.id
      if (this.$refs.listBox.nowPage === 1) {
        this.serviceInit()
      } else {
        this.$refs.listBox.nowPage = 1
      }
    },
    // 三级分类跳转服务列表
    thirdClick (item, index) {
      const query = {}
      query.claid = `${item.id};${item.mobile_name}`
      this.$router.push({ path: '/serviceList', query})
    },
    // 二级分类跳转服务列表
    secondClick (itemC, index) {
      const query = {}
      query.claid = `${itemC.id};${itemC.mobile_name}`
      this.$router.push({ path: '/serviceList', query})
    },
    // 跳转服务详情
    listData (item, index) {
      // this.$router.push({ path: '/serviceDetail/'+item.id, query: {id: item.store_id}})
      window.location.href = `${location.origin}/serviceDetail/${item.id}?id=${item.store_id}`;
    },
    // 下来刷新
    async loadData (page) {
      page === 1 ? await this.serviceInit() : await this.getList(page)
    },
    async serviceInit () {
      await this.getList(1)
      this.isLoading = false
    },
    async getList (page) {
      this.listLoading = true
      let data = null
      if (!this.second_id && !this.third_id) {
        return
      }
      var first_id = this.id
      var second_id = this.second_id
      var third_id = this.third_id
      var page = this.page
      data = await serviceHot(first_id, second_id, third_id, page)
      this.listLoading = false
      if (!data) return
      this.dataObj = {
        current_page: data.current_page,
        total: data.total,
        per_page: data.per_page
      }
      this.classList =
          page === 1 ? data.data : [...this.classList, ...data.data]
      for (var i = 0; i < this.classList.length; i++) {
        this.classList[i] = {...this.classList[i], liList: false}
      }
      if (this.classList.length % 2 == 0) {
        for (var i = 0; i < this.classList.length; i++) {
          if (i == this.classList.length / 2) {
            this.classList[i].liList = true
          }
        }
      } else {
        for (var i = 0; i < this.classList.length; i++) {
          if (i == Math.ceil(this.classList.length / 2)) {
            this.classList[i].liList = true
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .classifyChild {
    background: #fff;

    & > header {
      position: fixed;
      height: rem(88);
      width: 100%;
      z-index: 1;
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

      & > .search {
        width: 76%;//rem(574);
        height: rem(58);
        border-radius: rem(29);
        overflow: hidden;
        position: relative;

        & > .van-cell-group {
          background: #f4f6f8;

          & > .van-cell {
            background: #f4f6f8;
            padding: 0;
            width: 100%;//rem(574);
            height: rem(58);

            /deep/ .van-cell__value {
              color: #333;

              .van-field__body {
                .van-field__control {
                  height: rem(58);
                  font-size: rem(22);
                  padding-left: rem(77);
                }
              }
            }
          }
        }

        & > .arrowhead {
          position: absolute;
          top: 0;
          left: rem(10);
          width: rem(58);
          height: rem(58);
          z-index: 1;

          & > img {
            display: block;
            width: rem(27);
            height: rem(29);
            margin-left: rem(15);
            margin-top: rem(15);
          }
        }
      }

      & > .dian {
        display: flex;
        margin-right: rem(30);

        & > div {
          width: rem(8);
          height: rem(8);
          border-radius: 50%;
          background: #ccc;
          margin-right: 6px;
        }
      }
    }

    & > .body {
      padding-top: rem(88);
      padding-bottom: rem(30);

      & > .banner {
        width: 100%;
        height: rem(200);
        background: #999;

        & > img {
          display: block;
          width: 100%;
          height: rem(200);
        }
      }

      & > .classifyList {
        padding: rem(33);
        box-sizing: border-box;
        & > ul {
          display: flex;
          flex-wrap: wrap;

          & > li {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 5.1%;//rem(36);
            width: 21%;///(144);

            & > img {
              width: rem(70);
              height: rem(70);
            }

            & > span {
              font-size: rem(24);
              color: #666;
              margin-top: rem(16);
            }
          }

          & > li:nth-child(5),
          & > li:nth-child(6),
          & > li:nth-child(7),
          & > li:nth-child(8) {
            margin-top: rem(34);
          }

          & > li:nth-child(4),
          & > li:nth-child(8) {
            margin-right: 0;
          }
        }
      }

      & > .releaseClues {
        padding: 0 20px;
        margin-top: rem(11);
        box-sizing: border-box;

        & > .releaseCon {
          height: rem(273);
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 10px 0px rgba(204, 204, 204, 0.5);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 0.1rem;
          & > span:nth-child(1) {
            font-size: rem(30);
            color: #333;
            font-weight: 600;
            margin-top: rem(30);
            line-height: rem(42);

            & > i {
              color: #f3262d;
            }
          }

          & > span:nth-child(2) {
            font-size: rem(24);
            margin-top: rem(20);
            line-height: rem(33);
            color: #666;

            & > i {
              color: #f3262d;
            }
          }

          & > div {
            height: rem(68);
            display: flex;
            margin-top: rem(40);
            width: 96%;

            & > .van-cell-group {
              width: 67%;//rem(450);
              height: rem(68);
              border: 0;

              & > .van-cell {
                background: #f4f6f8;
                padding: rem(10) rem(32);
                color: #333;
                border: 0;
              }
            }

            & > span {
              width: rem(200);
              height: rem(68);
              background: rgba(243, 38, 45, 1);
              border-radius: 4px;
              font-size: rem(28);
              color: #fff;
              text-align: center;
              line-height: rem(68);
              margin-left: rem(20);
            }
          }
        }
      }

      & > .categoryList {
        margin-top: rem(30);

        & > div {
          & > span {
            display: flex;
            font-size: rem(30);
            font-weight: 600;
            color: #333;
            padding: rem(20);

            & > img {
              width: rem(30);
              height: rem(30);
              margin-right: rem(10);
            }
          }

          & > ul {
            display: flex;
            flex-wrap: wrap;
            border-bottom: rem(1) solid #ddd;

            & > li {
              width: 33.2%;//rem(249);
              height: rem(86);
              text-align: center;
              line-height: rem(86);
              border-top: rem(1) solid #ddd;
              border-right: rem(1) solid #ddd;
              font-size: rem(26);
              color: #666;
            }

            & > li:nth-child(3n) {
              border-right: 0;
            }
          }
        }
      }

      & > .categoryTab {
        margin-top: rem(50);
        overflow: hidden;

        & > .tabList {
          border-bottom: 1px solid #eee;

          & > ul {
            display: flex;

            white-space: nowrap;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            overflow-x: auto;
            margin: 0 rem(20);

            & > li {
              font-size: rem(30);
              color: #333;
              padding-bottom: rem(17);
              margin-right: rem(50);
            }

            & > .tabActive {
              color: #f3262d;
              border-bottom: rem(3) solid #f3262d;
            }

            & > li:last-child {
              margin-right: 0;
            }
          }
        }

        /deep/ .van-list {
          & > .categoryCon {
            & > ul {
              padding: rem(30) rem(20) 0;
              -moz-column-count: 2; /* Firefox */
              -webkit-column-count: 2; /* Safari 和 Chrome */
              column-count: 2;
              -moz-column-gap: rem(20); /* Firefox */
              -webkit-column-gap: rem(20); /* Safari 和 Chrome */
              column-gap: rem(20);

              & > li {
                break-inside: avoid;
                display: flex;
                flex-direction: column;
                width: rem(345);
                height: rem(356);
                margin-bottom: rem(20);
                margin-right: rem(20);
                box-shadow: 0px 2px rem(7) 0px rgba(204, 204, 204, 0.5);
                border-radius: rem(8);
                overflow: hidden;

                & > img {
                  width: rem(345);
                  height: rem(207);
                }

                & > span {
                  display: block;
                  width: rem(335);
                  height: rem(66);
                  font-size: rem(24);
                  color: #333;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                  padding-left: rem(10);
                  margin: rem(14) 0 rem(16) 0;
                  line-height: rem(33);
                  font-weight: 600;
                }

                & > p {
                  font-size: rem(24);
                  color: #ff0027;
                  margin-left: rem(10);
                  font-weight: 600;
                }
              }

              & > .noClass {
                box-shadow: none;
                border-radius: 0;
                height: rem(346);
              }

              & > li:last-child {
                margin-bottom: 0;
              }

              & > .liHeight {
                height: rem(366);
              }
            }

            // &>.noMore{

            // }
          }
        }
      }
    }
  }
</style>
