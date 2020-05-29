<template>
  <div class="allNewsData">
    <header>
      <div @click="histroyClick()">
        <img src="@/assets/arrowhead/zuo_nob.png" alt />
      </div>
      <h2>{{title}}</h2>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
      <div class="dian" @click="onClickRight">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
    <div class="allNewsTop">
      <div class="allNewsTop_l">
        <img src="@/assets/icon/tongzhi1.png" alt />
        <span>
          有
          <p>{{countNum}}条</p>
          {{newsTitle}}
        </span>
      </div>
      <div class="allNewsTop_r">
        <!-- <span @click="readAllClick()" v-if="countNum > 0">全部标记为已读</span> -->
      </div>
    </div>
    <listBox
      :refreshLoading.sync="isLoading"
      :listLoading.sync="listLoading"
      :dataArr="newsList"
      :dataObj="dataObj"
      @load="loadData"
    >
      <div class="allNewsCont">
        <ul>
          <li v-for="(item , index) in newsList" :key="index">
            <div class="tiemNews">
              <span v-if="item.time_status.date_status == 1">{{item.H[0]}}:{{item.H[1]}}</span>
              <span v-if="item.time_status.date_status == 2">昨天</span>
              <span v-if="item.time_status.date_status == 3">{{item.time_status.date}}</span>
              <span v-if="item.time_status.date_status == 4">{{item.time_status.date}}</span>
              <span v-if="item.time_status.date_status == 5">{{item.daye}}</span>
            </div>
            <div class="conNews">
              <div class="liTOP" :class="{'ready_news':item.status == 'Y'}">
                <div>
                  <!-- <img v-if="item.status == 'N'" src="@/assets/icon/weidu.png" alt /> -->
                  <span class="noRead" v-if="item.status == 'N'"></span>
                  <span class="allNewsDian" v-else></span>
                  <span>{{item.title}}</span>
                  <div @click="deletClick(item )">
                    <img src="../../../assets/arrowhead/deletNews.png" alt />
                  </div>
                </div>
                <div  @click="oneReadClick(item ,$event)">
                  <span>
                    {{item.content}}
                    <!-- <p>{{item.created_at}}</p> -->
                  </span>
                </div>
              </div>
              <div class="liBUT" @click="oneReadClick(item ,$event)">
                <!-- <span class="dele" @click="deletClick(item )">删除</span> -->
                <span class="ready">查看详情</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </listBox>
    <upBack></upBack>
    <div class="reminder" v-if="flageClose">
      <h4 class="reminderData">
        <h4>温馨提示</h4>
        <div class="spanD">
          <!-- <span v-if="flagDelet==1">您确定要全部标记为已读吗？</span> -->
          <span>您确定要删除这条消息吗？</span>
        </div>
        <div>
          <button @click="submitClick">确定</button>
          <!-- <button @click="closeBut">取消</button> -->
        </div>
      </h4>
      <div class="close" @click="closeBut">
        <img src="../../../assets/userContent/guanbi.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import MenuSlide from "@/components/common/MenuSlide";
import { msg, msgcount, msgupdate, updateOne, deleteNews } from "@/api/list";
import listBox from "@/components/service/listBox";
import upBack from "@/components/service/upBack";
export default {
  components: {
    MenuSlide,
    listBox,
    upBack
  },
  data() {
    return {
      newsTitle: "",
      flageClose: false,
      showMenu: false,
      // flagDelet: "",
      page: 1,
      type: this.$route.query.type,
      newsList: [],
      countNum: "",
      item: "",
      id: "",
      listLoading: false,
      isLoading: false,
      dataObj: {},
      title: "交易消息",
      num: 0
    };
  },
  created() {
    if (this.$route.query.type == "T") {
      this.newsTitle = "交易消息未读";
      this.title = "交易消息";
    } else if (this.$route.query.type == "S") {
      this.newsTitle = "系统消息未读";
      this.title = "系统消息";
    }
    this.init();
  },
  methods: {
    init() {
      //请求消息数据
      var type = this.type;
      msgcount(type)
        .then(res => {
          this.countNum = res.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 全部已读
    // readAllClick() {
    //   this.flageClose = true;
    //   this.flagDelet = 1;
    // },
    // 交易消息-删除
    deletClick(item) {
      this.flageClose = true;
      console.log("11");
      // this.flagDelet = 2;
      this.item = item;
      this.id = item.id;
    },
    // 确认
    submitClick() {
      // if (this.flagDelet == 1) {
      //   var type = this.type;
      //   msgupdate(type)
      //     .then(res => {
      //       this.flageClose = false;
      //       for (var i = 0; i < this.newsList.length; i++) {
      //         this.newsList[i].status = "Y";
      //         this.countNum = 0;
      //         this.$store.state.allNewsNum = this.countNum;
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // } else {
      var id = this.id;
      deleteNews(id)
        .then(res => {
          this.flageClose = false;
          var _this = this;
          var a = [];
          a = _this.newsList;
          // for (var i = 0; i < this.newsList.length; i++) {
          //   if (this.newsList[i].id == this.item.id) {
          //     this.newsList.splice(i, 1);
          //   }
          // }
          a.forEach((item, index) => {
            if (item.id == id) {
              a.splice(index, 1);
            }
          });
          this.init()
          this.num++;
          console.log(this.num);
        })
        .catch(err => {
          console.log(err);
        });
      // }
    },
    // 关闭弹窗
    closeBut() {
      this.flageClose = false;
    },
    // 设置一条为已读 跳转消息详情页，或对应的页面
    oneReadClick(item, e) {
      var id = item.id;
      updateOne(id)
        .then(res => {
          if (res != false) {
            // item.status = "Y";
            if(res.update == 1){
                if(this.countNum > 0){
              this.countNum = Number(this.countNum) - 1;
            }else{
              this.countNum = 0
            }
            this.$store.state.allNewsNum = this.countNum;
            }
          
            // e.target.className = "ready ready_delet";
            if(item.mobile_link != '' && item.mobile_link != null){
               this.$router.push({
                  path: item.mobile_link,
                });
            }else{
            this.$router.push({
              name: "newsPage",
              params:{data:item}
            });
            }
           
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 返回首页
    histroyClick() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.showMenu = true;
    },
    closeMenu() {
      this.showMenu = false;
    },
    // 下来刷新
    async loadData(page) {
      page === 1 ? await this.onRefresh() : await this.getList(page);
    },
    async onRefresh() {
      await this.getList(1);
      // this.$toast("刷新成功");
      this.isLoading = false;
    },
    async getList(page) {
      this.listLoading = true;
      let data = null;
      data = await msg(page, this.type);
      this.listLoading = false;
      if (!data) return;
      this.dataObj = {
        current_page: data.current_page,
        total: data.total - this.num,
        per_page: data.per_page
      };
      console.log(this.dataObj);
      this.newsList = page === 1 ? data.data : [...this.newsList, ...data.data];
      var time = ''
      var H = ''
      var daye
      for (var i = 0; i < this.newsList.length; i++) {
        daye = this.newsList[i].created_at
          .replace(/\ /g, " ")
          .split(" ")[0];
          time = this.newsList[i].created_at
          .replace(/\ /g, " ")
          .split(" ")[1];
          H = time
          .replace(/\ /g, ":")
          .split(":");
          this.newsList[i] = {...this.newsList[i],H,daye}
      }
      console.log(this.newsList)
    }
  }
};
</script>
<style lang="scss">
@import "@/css/common.scss";
@import "./allNewsDataScode";
</style>