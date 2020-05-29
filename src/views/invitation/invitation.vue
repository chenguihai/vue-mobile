<template>
  <div id="invitationId" class="container bg">
    <head-nav title="邀请有礼"></head-nav>
    <img class="firstImg" src="@/assets/invitation/1.png" alt="邀请好友入驻店铺" />
    <div class="main_box">
      <img class="flow" src="@/assets/invitation/2.png" alt="邀请流程" />
      <div class="invitation friend">
        <h4 class="title">
          <span>
            已邀请
            <span>{{count}}</span>位好友
          </span>
        </h4>
        <div class="table" v-if="dataArr.length > 0">
          <div class="table_th">
            <span>好友用户号</span>
            <span>状态</span>
            <span>注册时间</span>
          </div>
          <div class="table_td" v-for="(item) in dataArr" :key="item.id">
            <span>{{item.user_invite_list.mobile}}</span>
            <!-- 状态：状态：0 已注册，1 已完成 -->
            <span :class="{active:item.status ===1}">{{item.status ===1 ? '已完成':'已注册'}}</span>
            <span>{{item.user_invite_list.created_at}}</span>
          </div>
        </div>
        <noData v-else name="暂未邀请好友，现在就去邀请"></noData>
      </div>
      <div class="invitation active">
        <h4 class="activity">活动规则</h4>
        <p class="content">
          1、每成功邀请一位好友并入驻店铺成功，可奖励技术费率免费额度50元，以此类推；每成功邀请五十位好友并入驻店铺成功，可挑选平台店铺推荐位一周；每成功邀请一百位好友并入驻店铺成功，可免费投首页焦点大图广告位一周；
          <br />2、好友注册并入驻店铺成功后奖励即可入账；
          <br />3、领取记录查询：免费技术额度可到【服务商-我的-店铺工具】查询；
          <br />4、未开通店铺的新用户满足邀请资格，同一账号仅可被邀请一次；奖励不设上限，邀请越多，奖励越多；
          <br />5、本活动最终解释权归平台所有；
        </p>
      </div>
    </div>
    <fixed-btn name="邀请好友" @submit="sharePage"></fixed-btn>
    <invitation-cpn v-if="shareFlag" :url="shareUrl" @qrcode="qrcodeFun" />
  </div>
</template>

<script>
import FixedBtn from "@/components/common/FixedBtn";
import { reqInviteList } from "@/api/commonApi";
import invitationCpn from "@/components/common/invitationCpn";
import { bin2Hex } from "@/utils/util";
import noData from "@/components/noData";
import { wxShareCommon } from "@/utils/util";

export default {
  name: "invitation",
  components: { FixedBtn, invitationCpn, noData },
  data() {
    return {
      dataArr: [],
      dataObj: {},
      qrcodeImg: "",
      count: 0,
      notStore: 0,
      userInfo: "",
      shareUrl: sessionStorage.getItem("shareUrl") || window.location.href,
      shareFlag: false,
      page: 1,
      total: 0,
      httpFlag: false
    };
  },
  mounted() {
    let userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo) || "";
      let {
        original: { id }
      } = this.userInfo;
      let encrypt = window.btoa(bin2Hex(id + ""));
      this.shareUrl = `${location.origin}/settleIntroduce?inviteUserId=${encrypt}`;
      this.shareFlag = true;
      sessionStorage.setItem("shareUrl", this.shareUrl);
    }
    let title = "众媒时代 强势来袭！";
    wxShareCommon(
      title,
      "",
      "入驻凌天众媒店铺，开启赚钱之旅 ~ 更多广告位等你来选，先到先得哦！"
    );
    document.title = "邀请有礼";
    this.getList();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll() {
      let inviDom = document.getElementById("invitationId");
      if (this.httpFlag) {
        return;
      }
      if (
        inviDom.scrollHeight === inviDom.clientHeight + inviDom.scrollTop &&
        this.allArr.length < this.total
      ) {
        this.page++;
        this.getList();
      }
    },
    async getList() {
      if (!this.userInfo) {
        return;
      }
      const res = await reqInviteList(this.page);
      if (!res) return;
      if (this.dataArr.length >= this.dataObj.total) {
        this.finished = true;
      }

      const { current_page, total, per_page, data } = res.list;
      this.dataObj = {
        current_page: current_page,
        total: total,
        per_page: per_page
      };
      this.total = total;
      this.count = res.count;
      this.notStore = res.notStore;
      let dataFilter = data.filter(item => item.user_invite_list);
      this.dataArr = this.page === 1 ? dataFilter : [...this.dataArr, ...dataFilter];
      this.allArr = this.page === 1 ? data : [...this.allArr, ...data];
      if (this.total === this.allArr.length) {
        this.httpFlag = true;
      }
    },
    qrcodeFun(val) {
      this.qrcodeImg = val;
      this.shareFlag = false;
    },
    sharePage() {
      let token = localStorage.getItem("token");
      if (!token) {
        // this.$toast("未登录或登录已失效");
        let redirect = this.$router.currentRoute.fullPath;
        this.$router.replace({
          path: "/login",
          query: { redirect,type:1 }
        });
        return;
      }
      // if (!this.qrcodeImg) {
      //   this.$toast("加载中...");
      //   return;
      // }
      let favicon = "https://m.zhongmei66.com/static/bitbug_favicon.ico",
        inviTitle =
          "众媒时代 强势来袭！",
        inviDesc =
          "入驻凌天众媒店铺，开启赚钱之旅 ~ 更多广告位等你来选，先到先得哦！";
      let obj = {
        title: inviTitle,
        link: this.shareUrl, // 网址，默认使用
        desc: inviDesc,
        imgUrl: favicon,
        infoMap: {
          wx: {
            title: inviTitle,
            desc: inviDesc,
            link: this.shareUrl,
            imgUrl: favicon
          }
        },
        qrcode: this.qrcodeImg,
        fnDoShare: function(type) {
          // console.log(1)
        }
      };
      Mshare.popup(obj);
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("shareUrl");
  },
  destroyed: function() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style scoped lang="scss">
@import "@/css/common.scss";
$c_fff: #fff;
$c_border: #ffa947;
.bg {
  background: $invitation;
}
.firstImg {
  display: block;
  width: 100%;
}
.main_box {
  padding: 30px 20px 50px;
  margin-bottom: 98px;
  .flow {
    display: block;
    width: 100%;
  }
}
.invitation {
  margin: 30px 0;
  border-radius: 20px;
  &.friend {
    background-color: $c_fff;
    padding: 50px 55px 60px;
  }
  &.active {
    background-color: #fd5600;
    padding: 50px 30px;
  }
  .title,
  .activity {
    height: 50px;
    line-height: 50px;
    font-size: 36px;
    font-weight: 500;
    margin: 0 auto 50px;
    text-align: center;
    background: no-repeat bottom center;
    background-size: 100%;
  }
  .title {
    color: #000;
    width: 395px;
    background-image: url("/static/images/invitation/3.png");
  }
  .activity {
    color: $c_fff;
    width: 250px;
    background-image: url("/static/images/invitation/4.png");
  }
  .content {
    color: $c_fff;
    font-size: 24px;
    line-height: 33px;
  }
}
.table {
  width: 100%;
  font-size: 24px;
  border: 1px solid $c_border;
  span {
    height: 100%;
    // flex: 1;
    text-align: center;
    &:not(:last-child) {
      border-right: 1px solid $c_border;
    }
  }
  .table_th {
    display: flex;
    align-items: center;
    color: #a2470a;
    height: 88px;
    line-height: 88px;
    background-color: #ffbd69;
    border-bottom: 1px solid $c_border;
  }
  .table_td {
    display: flex;
    align-items: center;
    color: #d07339;
    height: 80px;
    line-height: 80px;
    text-align: center;
    &:not(:last-child) {
      border-bottom: 1px solid $c_border;
    }
    .active {
      color: #cd0d00;
    }
  }
  .table_th,
  .table_td {
    width: 100%;
    > span:first-child {
      width: 30%;
    }
    > span:nth-child(2) {
      width: 25%;
    }
    > span:last-child {
      width: 45%;
    }
  }
  .completed {
    color: #cd0d00;
  }
}
</style>
