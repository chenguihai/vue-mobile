<template>
  <div class="m-clues-detail-wrap">
    <head-nav title="线索详情"></head-nav>
    <div ref="oHeader" class="m-nav-clues-tab" v-show="thisLocation>0">
      <div class="m-nav-clues-arrow" @click="leftArr"></div>
      <a href="javascript:void(0)" @click="scrollTo('top')" :class="{ active:thisLocation==1 }">
        <van-icon v-if="thisLocation === 1" name="location" color="#F3262D" size="0.26rem" />线索
      </a>
      <a href="javascript:void(0)" @click="scrollTo('content')" :class="{ active:thisLocation==2 }">
        <van-icon v-if="thisLocation === 2" name="location" color="#F3262D" size="0.26rem" />详情
      </a>
      <a href="javascript:void(0)" @click="scrollTo('buy')" :class="{ active:thisLocation==3 }">
        <van-icon v-if="thisLocation === 3" name="location" color="#F3262D" size="0.26rem" />购买人数
      </a>
      <a
        href="javascript:void(0)"
        @click="scrollTo('recommend')"
        :class="{ active:thisLocation==4 }"
      >
        <van-icon v-if="thisLocation === 4" name="location" color="#F3262D" size="0.26rem" />线索推荐
      </a>
      <div class="m-menu-btn" @click="showMenu = true">...</div>
      <MenuSlide @close="closeMenu" v-if="showMenu"></MenuSlide>
    </div>
    <div v-if="clueInfo" class="m-clues-detail-top" id="top">
      <div class="m-clues-detail-img">
        <img
          v-if="otherClue.bossInfo.avatar"
          :src="otherClue.bossInfo.avatar.indexOf('http')>-1?otherClue.bossInfo.avatar:$store.state.ali_api_host+otherClue.bossInfo.avatar"
          alt
        />
        <img v-else src="../../../static/images/avatar-default.png" />
      </div>
      <h3 class="m-clues-detail-name">{{otherClue.bossInfo.nick_name}}</h3>
      <div class="m-clues-detail-price">
        <div class="m-clues-price-left">线索费用</div>
        <div class="m-clues-price-right">¥{{clueInfo.budget_money}}</div>
      </div>
    </div>
    <div class="m-clues-item-wrap" v-if="clueInfo">
      <h2 class="m-clues-prod-name">{{clueInfo.title}}</h2>
      <div class="m-clues-time">
        <div v-if="clueInfo.status=='S' && clueInfo.clue_status != 'N'">
          距离线索截止：
          <span class="m-time">{{d}}天{{h}}时{{m}}分{{s}}秒</span>
        </div>
        <div class="m-time" v-else-if="clueInfo.status=='S' && clueInfo.clue_status == 'N'">线索已关闭</div>
        <div v-else-if="clueInfo.status=='N'">未审核</div>
        <div v-else-if="clueInfo.status=='Y'" class="reason">
          审核失败
          <span>原因：{{clueInfo.reason}}</span>
        </div>
        <div class="m-share-btn" @click="sharePage">分享</div>
      </div>
      <div class="m-share-box">
        <div v-show="cityName!=''" class="m-address">
          <div class="m-city">{{cityName}}</div>
          <p>地域限制</p>
        </div>
        <div class="m-service-limit" v-if="grade!=''">
          <div class="m-service-btn">{{grade}}</div>
          <p>等级限制</p>
        </div>
      </div>
    </div>
    <div class="m-clues-info" v-if="clueInfo">
      <div class="m-clues-info-title">
        <h3>线索信息</h3>
      </div>

      <ul class="m-clues-info-list">
        <li>
          投放时间：
          <span
            class="font333"
          >{{clueInfo.clue_start_time.slice(0,10)}}至{{clueInfo.clue_end_time.slice(0,10)}}</span>
        </li>
        <li>
          <div class="m-clues-info-left">
            投放预算：
            <span class="font333">{{clueInfo.budget_money}}元</span>
          </div>
          <div class="m-clues-info-right">
            联系人：
            <span class="font333">{{clueInfo.name}}</span>
          </div>
        </li>
        <li>
          <div class="m-clues-info-left">
            客户领域：
            <span class="font333">{{clueInfo.sr_name}}</span>
          </div>
          <div class="m-clues-info-right">
            客户类型：
            <span class="font333" v-if="clueInfo.type_id ==1">直客公司</span>
            <span class="font333" v-else-if="clueInfo.type_id ==3">4A公司</span>
            <span class="font333" v-else>中间商（非4A公司）</span>
          </div>
        </li>
        <li @click="showChoicedHand(1)">
          <div class="m-sort">
            媒体类型：
            <span class="font333">
              {{classW.cate_name}}>
              <span v-for="(item , index) in sort" :key="index">
                {{item.cate_name }}
                <span v-if="index<sort.length-1">、</span>
              </span>
            </span>
          </div>
          <span class="m-arrow-right"></span>
        </li>
        <li @click="showChoicedHand(2)">
          <div class="m-sort">
            投放区域：
            <span class="font333">{{regionSring}}</span>
          </div>
          <span class="m-arrow-right"></span>
        </li>
        <li class="m-contact-item">
          <div class="m-contact-title">联系方式：</div>
          <div class="m-contact-content" v-if=" message=='LoginBossOk' || message=='LoginPayOk'">
            <span v-if="clueInfo.mobile!='隐藏'">手机号：{{clueInfo.mobile}}</span>
            <span v-if="clueInfo.qq!= null&&clueInfo.qq!=''">QQ：{{clueInfo.qq}}</span>
            <span
              style="width:100%"
              v-if="clueInfo.wechat!= null&&clueInfo.wechat!=''"
            >微信：{{clueInfo.wechat}}</span>
            <span
              style="width:100%"
              v-if="clueInfo.email!= null&&clueInfo.email!=''"
            >邮箱：{{clueInfo.email}}</span>
          </div>
          <div class="m-contact-content font-red" v-else>
            <span>购买线索可见</span>
          </div>
        </li>
      </ul>
      <h3 class="m-clues-info-title" id="content">线索描述</h3>
      <p class="m-clues-content" v-html="clueInfo.content"></p>
      <div v-if="message=='LoginBossOk' && need != undefined && need.length >0">
        <h3 class="m-clues-info-title">线索补充</h3>
        <div v-for="(item , index) in need" :key="index">
          <div v-if="item.status == 1 && message=='LoginBossOk'">
            <div class="m-clues-pass">
              <span>{{item.created_at}}</span>
              <span>客服审核通过</span>
            </div>
            <p class="m-clues-content">{{item.content}}</p>
          </div>

          <div v-else-if="item.status == 0 && message=='LoginBossOk'">
            <div class="m-clues-no-pass">
              <span>{{item.created_at}}</span>
              <span>客服未审核</span>
            </div>
            <p class="m-clues-content">{{item.content}}</p>
          </div>
          <div v-else-if="item.status == 2 && message=='LoginBossOk'">
            <div class="m-clues-no-pass">
              <span>{{item.created_at}}</span>
              <span>客服审核未通过</span>
            </div>
            <p class="m-clues-content">原因：{{item.reason}}</p>
            <p class="m-clues-content">{{item.content}}</p>
          </div>
        </div>
      </div>
      <div
        v-if="message!='LoginBossOk' && otherClue.clueNeed != undefined && otherClue.clueNeed.length >0"
      >
        <h3 class="m-clues-info-title">线索补充</h3>
        <div v-for="(item , index) in otherClue.clueNeed" :key="index">
          <div v-if="item.status == 1">
            <div class="m-clues-pass">
              <span>{{item.created_at}}</span>
              <span>客服审核通过</span>
            </div>
            <p class="m-clues-content">{{item.content}}</p>
          </div>
          <div v-else-if="item.status == 2 && message=='LoginBossOk'">
            <div class="m-clues-no-pass">
              <span>{{item.created_at*1000}}</span>
              <span>客服审核未通过</span>
            </div>
            <p class="m-clues-content">原因：{{item.reason}}</p>
            <p class="m-clues-content">{{item.content}}</p>
          </div>
        </div>
      </div>
      <h3 class="m-clues-info-title">线索附件</h3>
      <p class="m-clues-content" v-for="(item , index) in annex" :key="index">
        <a
          class="m-clues-link"
          v-if="item.annex0 != null&& item.annex0!=''"
          :href="item.annex0"
          target="_blank"
          download="logo1.png"
        >附件1</a>
        <a v-else>暂无数据</a>
        <a
          class="m-clues-link"
          v-if="item.annex1 != null&& item.annex1!=''"
          :href="item.annex1"
          target="_blank"
          download="logo2.png"
        >附件2</a>
        <a
          class="m-clues-link"
          v-if="item.annex2 != null&& item.annex2!=''"
          :href="item.annex2"
          target="_blank"
          download="logo3.png"
        >附件3</a>
        <a
          class="m-clues-link"
          v-if="item.annex3 != null&& item.annex3!=''"
          :href="item.annex3"
          target="_blank"
          download="logo4.png"
        >附件4</a>
        <a
          class="m-clues-link"
          v-if="item.annex4 != null&& item.annex4!=''"
          :href="item.annex4"
          target="_blank"
          download="logo5.png"
        >附件5</a>
      </p>

      <div class="m-clues-num-wrap">
        <span class="icon-time">{{clueInfo.created_at.slice(0,10)}}</span>
        <span class="icon-num">线索编号：{{clueInfo.id}}</span>
      </div>
    </div>
    <div class="m-clues-info" id="buy" v-if="clueInfo">
      <h3 class="m-clues-info-title">
        线索购买
        <span class="font-red">({{clueInfo.pay_number}}人)</span>
        <div v-if="otherClue.payClueShop.length>10" @click="changeShowNum(0)" class="m-left-arrow"></div>
        <div v-if="otherClue.payClueShop.length>10" @click="changeShowNum(1)" class="m-right-arrow"></div>
      </h3>
      <ul
        class="m-clues-user-list"
        v-if="otherClue.payClueShop !==undefined && otherClue.payClueShop.length > 0  "
      >
        <li v-for="(item , index) in otherClue.payClueShop" :key="index">
          <a :href="'/shopDetail/'+item.id">
            <img v-if="item.logo" :src="$store.state.ali_api_host+item.logo" alt />
            <img v-else src="../../../static/images/home/store_default.png" />
          </a>
        </li>
      </ul>
      <div class="tbodyNone" v-else>
        <img class="noneImg" src="../../../static/images/icon_sign_mobile.png" alt />
        <p>暂无数据</p>
      </div>
    </div>
    <!--    <div class="m-clues-info">-->
    <!--      <h3 class="m-clues-info-title">-->
    <!--        服务推荐-->
    <!--        <a href="" class="more">更多 ></a>-->
    <!--      </h3>-->
    <!--      <div class="m-product-wrap">-->
    <!--        <ul>-->
    <!--          <ServiceProductItem v-for="i in 10" :key="i" :buyNumShow="1" />-->
    <!--        </ul>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="m-clues-list-bg" id="recommend" v-if="clueInfo">
      <div class="m-clues-list-title">
        <h3>线索推荐</h3>
      </div>
      <div class="m-clues-list-wrap">
        <ul v-if="otherClue.clueTen.length>0">
          <CluesProductItem
            v-for="(item , index) in otherClue.clueTen"
            :productInfo="item"
            :key="index"
            :buyNumShow="1"
          />
        </ul>
        <div class="tbodyNone" v-else>
          <img class="noneImg" src="../../../static/images/icon_sign_mobile.png" alt />
          <p>暂无数据</p>
        </div>
      </div>
    </div>
    <div
      class="m-bottom-btn-wrap"
      v-if="clueInfo && message=='LoginBossOk' && clueInfo.status!='Y'"
    >
      <div class="m-more" @click="showBottomSlide=true">更多</div>
      <span class="m-btn-service" @click="shopBuyCluesPop=true">置顶</span>
      <span class="m-btn-service" @click="shopBuyCluesPop=true">加急</span>
      <span class="m-btn-service" v-if="!clueInfo.city_id" @click="shopBuyCluesPop=true">地域选择</span>
      <span class="m-btn-service" v-if="clueInfo.grade==0" @click="shopBuyCluesPop=true">等级限制</span>
      <span class="m-btn-service" v-if="clueInfo.service=='N'" @click="shopBuyCluesPop=true">客服包办</span>
    </div>
    <div class="m-buy-btn-bottom" v-else>
      <div
        class="m-push-btn"
        style="width:50%"
        @click="lickClue"
        v-if="clueInfo && message !='LoginBossOk'"
      >发布类似需求</div>

      <!--div-- class="m-buy-btn-disabled" v-if="clueInfo && clueInfo.clue_status == 'N' && message !='LoginBossOk' ">
        线索关闭
      </!--div-->
      <div
        class="m-buy-btn"
        v-if="(clueInfo&& clueInfo.clue_status == 'Y' &&message!='LoginBossOk' && !this.intercept) || message=='notLoginOk'"
        @click="buyCule"
      >购买线索</div>
      <div
        class="m-buy-btn-disabled"
        v-else-if="clueInfo&&message!='LoginBossOk'"
        @click="buyCule"
      >购买线索</div>
      <div class="m-buy-btn-disabled" v-else-if="clueInfo&&this.intercept" @click="buyCule">购买线索</div>
      <upBack></upBack>
    </div>
    <van-popup v-model="shopBottomPop" closeable position="bottom">
      <div class="m-pop-wrap">
        <h3>操作提示</h3>
        <p class="m-pop-tips">抱歉，您因以下原因，暂不能参与此线索</p>
        <p class="m-pop-grey-tips">温馨提示：完成条件后可查看您的最新参与资格</p>
        <ul class="m-pop-list">
          <li v-for="(item , index) in intercept" :key="index">
            <a href="/newbieTask" v-if="index == 'shop'">
              <img src="../../../static/images/clues/icon-store.png" alt />
              <span class="m-pop-title">您还没开通店铺</span>
              <span class="m-pop-content">请提交资料申请开通店铺</span>
              <span class="m-btn-to">去提交</span>
            </a>
            <a href="/clues" v-else-if="index == 'city'">
              <img src="../../../static/images/clues/icon-city.png" alt />
              <span class="m-pop-title">您的地域不符合</span>
              <span class="m-pop-content">请选择符合地域线索</span>
              <span class="m-btn-to">去选择</span>
            </a>
            <a href="/skillManage" v-else-if="index == 'class'">
              <img src="../../../static/images/clues/icon-jn.png" alt />
              <span class="m-pop-title">您的技能标签不符</span>
              <span class="m-pop-content" v-if="classWe !=''">请加入{{classWe.cate_name}}类目</span>
              <span class="m-btn-to">去加入</span>
            </a>
            <a v-else href="/clues">
              <img src="../../../static/images/clues/icon-wait.png" alt />
              <span class="m-pop-title">您的等级不符合</span>
              <span class="m-pop-content">请参与更多的线索提升等级</span>
              <span class="m-btn-to">去参与</span>
            </a>
          </li>
        </ul>
      </div>
    </van-popup>
    <van-popup v-model="shopBuyCluesPop" position="bottom" :style="{ height: '100vh' }">
      <div class="m-clues-pop-wrap">
        <van-nav-bar title="增值服务" left-arrow @click-left="onCloseBuyCluesLeft" />
        <div class="m-panel" v-if="service.length > 0">
          <h3 class="m-panel-title">请选择需要的服务</h3>
          <div class="m-panel-item" v-for="(item,index) in service" :key="index">
            <div class="m-checkbox-flex1">
              <van-checkbox
                shape="square"
                @change="choose"
                @click="checkedHand(item)"
                v-model="item.checked"
              >{{item.inc_name}}</van-checkbox>
            </div>
            <div class="m-flex-txt">{{item.description}}</div>
            <div class="m-flex-price">¥{{item.price}}</div>
            <div class="m-flex-bottom" v-if="item.id==6" @click="showPickerLevel">
              <div class="m-city-box">选择等级</div>
              <div class="m-choice-city">
                <div class="m-service-v" v-if="levelName!='未选择'">{{levelName}}</div>
                <span v-if="levelName=='未选择'">{{levelName}}</span>
              </div>
              <div class="m-arrow-right"></div>
            </div>
            <div class="m-flex-bottom" v-if="item.id==4" @click="showAdd">
              <div class="m-city-box">选择地域</div>
              <div class="m-choice-city">{{addInfor}}</div>
              <div class="m-arrow-right"></div>
            </div>
          </div>
        </div>
        <div class="m-all-choice">
          <van-checkbox @click="chooseAll" v-model="checkAll" shape="square">全选</van-checkbox>
        </div>
        <div class="m-total-price">合计：{{priceTotal.toFixed(2)}}</div>
        <button class="m-btn-buy-clues" @click="servicesnClick">立即支付</button>
        <div class="m-tips-buy">
          <dl>
            <dt>注意事项</dt>
            <dd>(1)置顶／加急生效后不能退款。</dd>
            <dd>(2)购买完成后置顶未生效，请及时拨打客服电话400-688-6662， 联系客服人员处理。</dd>
          </dl>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="replenishCluesShow" position="bottom" :style="{ height: '100vh' }">
      <div class="m-clues-pop-wrap">
        <van-nav-bar title="线索补充" left-arrow @click-left="onCloseReplenishClues" />
        <h3 class="m-title">补充内容</h3>
        <textarea
          v-model="textarea"
          name="j-replenish-area"
          class="m-textarea"
          id="j-replenish-area"
          cols="30"
          rows="10"
          placeholder="请输入补充内容"
        ></textarea>
        <div class="m-tips">温馨提示：补充需求使凌客更加理解您的需求</div>
        <fixed-btn :fixed="1" name="保存" @submit="saveClick"></fixed-btn>
      </div>
    </van-popup>
    <!--弹框选择-->
    <van-popup v-model="showPicker" position="bottom">
      <van-picker show-toolbar :columns="columns" @confirm="_handleSubmit" @cancel="_handleClose"></van-picker>
    </van-popup>
    <van-popup class="bounced" v-model="showa" position="bottom">
      <van-area
        class="selected"
        :area-list="areaList"
        title="选择地区"
        :columns-num="2"
        @cancel="onCancelarea"
        @confirm="onConfirmarea"
      />
    </van-popup>
    <BottomSlide
      @replenishClues="replenishClues"
      :flagS="flagS"
      @close="closeBottomSlide"
      v-if="showBottomSlide"
    ></BottomSlide>
    <CategoryChoicedPop
      :isDetail="message!='LoginBossOk'"
      @close="showChoiced=false"
      :index="index"
      :showList="selectShowList"
      v-if="showChoiced"
    ></CategoryChoicedPop>
    <!-- <CityChoicedPop @close="showCityList=false" :cityList="cityList" v-if="showCityList"></CityChoicedPop> -->
  </div>
</template>

<script>
import { EventUtil } from "@/utils/tool";
import FixedBtn from "@/components/common/FixedBtn";
import moment from "moment";
import CategoryChoicedPop from "@/components/clues/CategoryChoicedPop";
import CityChoicedPop from "@/components/clues/CityChoicedPop";
import HeadNav from "@/components/common/HeadNav";
import MenuSlide from "@/components/common/MenuSlide";
import BottomSlide from "@/components/common/BottomSlide";
import ServiceProductItem from "@/components/common/ServiceProductItem";
import CluesProductItem from "@/components/common/CluesProductItem";
import { clueShopShow, servicesn, clueAppend, cluepaysn } from "@/api/clues";
import { Toast } from "vant";
import upBack from "@/components/service/upBack";
import area from "@/assets/js/area";
import { wxShareCommon } from "@/utils/util";

export default {
  name: "cluesDetail",
  data() {
    return {
      showNum: 0,
      index: 1,
      shopBottomPop: false,
      pos: 0,
      showMenu: false,
      showChoiced: false,
      showCityList: false,
      showBottomSlide: false,
      showa: false,
      addInfor: "请选择",
      showPicker: false,
      areaList: area,
      levelName: "未选择",
      priceTotal: 0,
      shopBuyCluesPop: false,
      annex: [],
      sort: [],
      classW: [],
      region: [],
      regionSring: "",
      grade: "",
      cityName: "",
      selectShowList: {
        cate_name: "",
        child: [
          {
            child: []
          }
        ]
      },
      area,
      d: 0,
      h: 0,
      m: 0,
      s: 0,
      role: 1,
      cluesDataList: {},
      messages: "",
      clueInfo: null,
      cluesData: "",
      otherClue: "",
      message: "",
      intercept: null,
      textarea: "",
      service: [],
      flagR: false,
      flagB: false,
      flagC: false,
      checkAll: false,
      checkedCities: [],
      clueList: [],
      clueListflit: [],
      isIndeterminate: true,
      selectArea: [],
      prosDatas: {
        value: "id",
        label: "name",
        children: "child"
      },
      province: "",
      city: "",
      district: "",
      gradeLevel: "",
      levelData: "",
      id: 0,
      columns: [],
      replenishCluesShow: false,
      selfHeight: 0,
      topDom: null,
      contentDom: null,
      recommendDom: null,
      buyDom: null,
      topTop: null,
      contentTop: null,
      buyTop: null,
      recommendTop: null,
      cityList: [],
      need: [],
      classWe: "",
      flagS: "0"
    };
  },
  components: {
    ServiceProductItem,
    HeadNav,
    BottomSlide,
    FixedBtn,
    CluesProductItem,
    CategoryChoicedPop,
    CityChoicedPop,
    upBack,
    MenuSlide
  },

  methods: {
    showChoicedHand(type) {
      // showChoiced=true
      if (type == 1) {
        sessionStorage.setItem(
          "selectShowList",
          JSON.stringify(this.selectShowList)
        );
      } else {
        sessionStorage.setItem("selectShowList", JSON.stringify(this.cityList));
      }

      this.$router.push({
        path: "/clues/tmed",
        query: { isDetail: this.message != "LoginBossOk", type: type }
      });
    },
    changeShowNum(type) {
      if (type == 0) {
        if (this.showNum == 0) return;
        this.showNum -= 10;
      } else if (type == 1) {
        if (this.showNum >= this.otherClue.payClueShop.length - 10) return;
        this.showNum += 10;
      }
    },
    scrollTo(id) {
      document.getElementById(id).scrollIntoView();
    },
    closeMenu() {
      this.showMenu = false;
    },
    leftArr() {
      this.$router.go(-1);
    },
    sharePage() {
      let obj = {
        title: this.clueInfo.title,
        link: window.location.href, // 网址，默认使用window.location.href
        desc: "我在凌天众媒网发现一条不错的广告投放需求，赶快来看看",
        imgUrl: "https://m.zhongmei66.com/static/bitbug_favicon.ico",
        infoMap: {
          wx: {
            title: this.clueInfo.title,
            desc: "我在凌天众媒网发现一条不错的广告投放需求，赶快来看看",
            link: window.location.href,
            imgUrl: "https://m.zhongmei66.com/static/bitbug_favicon.ico"
          }
        },

        fnDoShare: function(type) {
          console.log(1);
        }

      };
      console.log(obj)
      Mshare.popup(obj);
    },
    replenishClues() {
      this.replenishCluesShow = true;
    },
    onCloseReplenishClues() {
      this.replenishCluesShow = false;
    },
    _handleSubmit(e) {
      let idx = this.checkedCities.findIndex(res => {
        return res.id == 6;
      });
      this.checkedCities[idx].grade = e.id;
      this.levelName = e.text;
      this.showPicker = false;
    },
    _handleClose() {
      this.showPicker = false;
    },
    chooseAll() {
      let e = !this.checkAll;
      this.service = this.service.map(res => {
        res.checked = e;
        return res;
      });
      this.handleCheckedCitiesChange();
    },
    choose(e) {
      if (e) {
        let a = true;
        this.service.forEach(res => {
          if (!res.checked) {
            a = false;
          }
        });
        this.checkAll = a;
      } else {
        this.checkAll = false;
      }
    },
    checkedHand(row) {
      this.service.map((item, i) => {
        if (row.id == item.id) {
          row.checked = !row.checked;
          this.service.item = row;
        }
      });
      this.handleCheckedCitiesChange();
    },
    // 地址选择
    showAdd() {
      let value = this.service;
      let prosDatasOtherFlag = value.find(selectItem => {
        return selectItem.id == 4 && selectItem.checked == true;
      });
      if (!prosDatasOtherFlag) return;
      this.showa = true;
    },
    onCancelarea() {
      var _this = this;
      _this.showa = false;
    },
    onConfirmarea(val) {
      var _this = this;
      _this.showa = false;
      this.addInfor = val[0].name + "" + val[1].name;
      // this.province = val[0].code;
      // this.city = val[1].code;
      let idx = this.checkedCities.findIndex(res => {
        return res.id == 4;
      });
      this.checkedCities[idx].city_id = val[1].code;
    },
    handleCheckedCitiesChange() {
      let _this = this;
      let value = _this.service;
      _this.checkedCities = [];
      let flagInc = value.find(incItem => {
        return incItem.id == 4 && incItem.checked == true;
      });
      let selectFlag = value.find(selectItem => {
        return selectItem.id == 6 && selectItem.checked == true;
      });
      if (flagInc) {
        _this.prosDatasOtherFlag = false;
      } else {
        _this.prosDatasOtherFlag = true;
      }
      if (selectFlag) {
        _this.selectFlag = false;
      } else {
        _this.selectFlag = true;
      }
      _this.priceTotal = 0;
      value.forEach((res, index) => {
        if (res.checked == true) {
          let itemPrice = res.price - 0;
          _this.priceTotal = _this.priceTotal + itemPrice;
          _this.checkedCities.push(res);
        }
      });
    },
    // 增值服务下单
    servicesnClick() {
      let flag = false;
      this.service.forEach(res => {
        if (res.checked) {
          flag = true;
        }
      });
      if (!flag) {
        Toast("请至少选择一项需要的服务");
        return;
      }
      let idC = this.checkedCities.findIndex(res => {
        return res.id == 4;
      });
      if (idC > -1) {
        if (!this.checkedCities[idC].city_id) {
          Toast("请选择地域");
          return;
        }
      }
      let idx = this.checkedCities.findIndex(res => {
        return res.id == 6;
      });
      if (idx > -1) {
        if (!this.checkedCities[idx].grade) {
          Toast("请选择服务商等级");
          return;
        }
      }
      this.buyClue();
    },
    async buyClue() {
      var data = { inc: this.checkedCities, clueid: this.clueInfo.id };
      const res = await servicesn(data);
      if (!res) return;
      const orderSn = res;
      this.$router.push(`/payment?order_sn=${orderSn}&type=2`);
    },
    // 确认补充
    async saveClick() {
      if (this.textarea.length > 500) {
        Toast("补充内容不能超过500字");
        return;
      }
      if (this.textarea.length < 10) {
        Toast("补充内容不少于10字");
        return;
      }
      var data = {
        clueId: this.clueInfo.id,
        append: this.textarea
      };
      const res = await clueAppend(data);
      if (res.code === 200) {
        this.textarea = "";
        this.replenishCluesShow = false;
        Toast("补充成功");
        this.init(this.$route.params.id);
      }
    },
    // base64ToFile(urlData, fileName) {
    //     let arr = urlData.split(',');
    //     let mime = arr[0].match(/:(.*?);/)[1];
    //     let bytes = atob(arr[1]); // 解码base64
    //     let n = bytes.length
    //     let ia = new Uint8Array(n);
    //     while (n--) {
    //         ia[n] = bytes.charCodeAt(n);
    //     }
    //     return new File([ia], fileName, { type: mime });
    // },
    async init(id) {
      let _this = this;
      const res = await clueShopShow(id);
      const { data } = res;
      if (!data) {
        this.$router.push({
          path: "/closeData", query: { type: 4 }
        });
        return;
      }
      this.cluesDataList = data;
      this.cluesData = this.cluesDataList;
      this.clueInfo = this.cluesData.clueInfo;
      document.title = this.clueInfo.title;
      this.need = this.cluesData.need;
      this.otherClue = this.cluesData.otherClue;
      //  this.base64ToFile(this.otherClue.bossInfo.avatar, fileName)

      // let title = this.clueInfo.title + this.titleSuffix;
      // localStorage.setItem('shareItem',JSON.stringify({title,imgUrl:''}));
      console.log("wxShareCommon================");
      wxShareCommon(
        this.clueInfo.title,
        "",
        "我在凌天众媒网发现一条不错的广告投放需求，赶快来看看"
      );
      this.message = res.message;
      this.classWe = this.cluesData.last.class[0];
      if (this.message === "LoginBossOk" && this.clueInfo.status === "S") {
        this.flagS = "1";
      }
      if (this.cluesData.service) {
        let serviceData = this.cluesData.service;
        for (let i = 0; i < serviceData.length; i++) {
          serviceData[i].checked = false;
        }
        this.service = serviceData;

        if (this.clueInfo.service === "Y") {
          this.service.splice(
            this.service.findIndex(item => item.id === 5),
            1
          );
        }
        if (this.clueInfo.city_id) {
          this.service.splice(
            this.service.findIndex(item => item.id === 4),
            1
          );
        }

        if (this.clueInfo.grade > 0) {
          this.service.splice(
            this.service.findIndex(item => item.id === 6),
            1
          );
        }
      }
      if (
        typeof this.cluesData.intercept === "object" &&
        typeof this.cluesData.intercept.length === "undefined"
      ) {
        this.intercept = this.cluesData.intercept;
      }
      this.clueList = this.service;
      this.level = this.cluesData.level;
      this.classW = this.cluesData.last.class[0];
      this.sort = this.cluesData.last.sort;
      this.sort.forEach(res => {
        res.selected = true;
        _this.selectShowList.child[0].child.push(res);
      });
      this.selectShowList.cate_name = this.cluesData.last.class[0].cate_name;
      this.region = this.cluesData.last.region;
      this.annex = this.otherClue.annex;
      this.level.forEach(res => {
        this.columns.push({
          text: res.bl_name,
          id: res.id
        });
      });
      for (var j in this.areaList.city_list) {
        if (this.clueInfo.city_id != 0) {
          if (this.clueInfo.city_id == j) {
            this.cityName = this.areaList.city_list[j];
          }
        }
      }
      // if (this.clueInfo.city_id) {
      //   // let cityName = this.getCityName(this.clueInfo.city_id);
      //   // this.cityName = cityName;
      // }
      this.funfor();
      this.countTime();
      this.filtservices();
    },
    funfor() {
      if (this.level) {
        for (var i = 0; i < this.level.length; i++) {
          if (this.level[i].id == this.clueInfo.grade) {
            this.grade = this.level[i].bl_name;
          }
        }
      }
      for (var i = 0; i < this.region.length; i++) {
        var a = this.region[i];
        if (a.city_id == 100000) {
          this.regionSring = "全国";
          this.cityList.push("全国");
          return;
        }
        for (var j in this.areaList.city_list) {
          // console.log(j);
          if (j == a.city_id) {
            this.regionSring += this.areaList.city_list[j];
            this.cityList.push(this.areaList.city_list[j]);
          }
        }
        for (var k in this.areaList.province_list) {
          // console.log(k);
          if (k == a.city_id) {
            this.regionSring += this.areaList.province_list[k];
            this.cityList.push(this.areaList.province_list[k]);
          }
        }
        if (this.region.length > 1 && i < this.region.length - 1) {
          this.regionSring += "，";
        }
      }
    },
    //  getCityName (num) {
    //   if (num == 100000) return '全国'
    //   let areaString = JSON.stringify(area)
    //   var re = new RegExp('("' + num + '":").*?(?=",)')
    //   let cityName = areaString.match(re)
    //   let strName = cityName[0].slice(10)
    //   return strName
    // },

    onCloseBuyCluesLeft() {
      this.shopBuyCluesPop = false;
    },
    lickClue() {
      this.clueData = [];
      this.clueData.push(
        { content: this.clueInfo.content },
        { title: this.clueInfo.title }
      );
      window.localStorage.setItem("clueData", JSON.stringify(this.clueData));
      this.$router.push({ path: "/clues/release" });
    },
    showPickerLevel() {
      let value = this.service;
      let selectFlag = value.find(selectItem => {
        return selectItem.id == 6 && selectItem.checked == true;
      });
      if (!selectFlag) return;
      this.showPicker = true;
    },
    countTime: function() {
      let _this = this;
      var nowdate = moment().format("x");
      let formatTime = this.clueInfo.end_time.replace(/-/g, "/");
      var endDate = moment(formatTime).format("x");

      if (nowdate > endDate) {
        _this.countFlag = false;
        return false;
      }
      var leftTime = endDate - nowdate;

      _this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      _this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
      _this.m = Math.floor((leftTime / 1000 / 60) % 60);
      _this.s = Math.floor((leftTime / 1000) % 60);
      if (_this.h < 10) {
        _this.h = "0" + _this.h;
      }
      if (_this.m < 10) {
        _this.m = "0" + _this.m;
      }
      if (_this.s < 10) {
        _this.s = "0" + _this.s;
      }
      setTimeout(_this.countTime, 1000);
    },
    // 去除相同的增值服务
    filtservices() {
      if (this.clueList) {
        var a = [];
        for (var i = 0; i < this.clueList.length; i++) {
          if (this.clueInfo.city_id == null) {
            if (this.clueList[i].id == 4) {
              // console.log(this.clueList[i])
              // this.clueList[i] = selectArea
              a.push(this.clueList[i]);
            }
          }

          if (this.clueList[i].id == 2) {
            // console.log(this.clueList[i])
            a.push(this.clueList[i]);
          }

          if (this.clueInfo.service == "N") {
            if (this.clueList[i].id == 5) {
              // console.log(this.clueList[i])
              a.push(this.clueList[i]);
            }
          }
          if (this.clueInfo.grade == 0) {
            if (this.clueList[i].id == 6) {
              // console.log(this.clueList[i])
              a.push(this.clueList[i]);
            }
          }
          if (this.clueList[i].id == 3) {
            // console.log(this.clueList[i])
            a.push(this.clueList[i]);
          }
        }
        this.clueListflit = a;
      }
    },
    closeBottomSlide() {
      this.showBottomSlide = false;
    },
    // 购买线索
    async buyCule() {
      if (this.clueInfo.clue_status == "N") {
        Toast("线索已关闭，无法购买");
        return;
      }
      if (this.message == "LoginPayOk") {
        Toast("您已购买线索了，可以进行联系雇主");
        return;
      }

      var data = {
        clueid: this.clueInfo.id,
        cluename: this.clueInfo.title
      };
      if (this.intercept) {
        this.shopBottomPop = true;
        return false;
      }
      const cluePayCallback = await cluepaysn(data);
      if (cluePayCallback.code === 200) {
        let orderSn = cluePayCallback.data.order_sn;
        this.$router.push("/payment?order_sn=" + orderSn + "&type=1");
      } else {
        console.log("login");
        // Toast(cluePayCallback.message)
      }
    },
    scrollEvent() {
      this.topDom = document.querySelector("#top");
      this.contentDom = document.querySelector("#content");
      this.buyDom = document.querySelector("#buy");
      this.recommendDom = document.querySelector("#recommend");
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.topTop = this.topDom.getBoundingClientRect().top;
      this.contentTop = this.contentDom.getBoundingClientRect().top;
      this.buyTop = this.buyDom.getBoundingClientRect().top;
      this.recommendTop = this.recommendDom.getBoundingClientRect().top;
    }
  },
  beforeDestroy() {
    EventUtil.removeHandler(window, "scroll", this.scrollEvent, true);
  },
  watch: {
    $route(to, from) {
      this.$router.go(0);
    }
  },
  mounted() {
    EventUtil.addHandler(window, "scroll", this.scrollEvent, true);
    this.selfHeight = this.$refs.oHeader.offsetHeight;
    const { id = 0 } = this.$route.params;
    this.id = id;
    this.init(id);
    localStorage.setItem("clueId", this.id);
  },
  computed: {
    thisLocation() {
      // 区域定位
      if (!this.recommendTop) return 0;
      if (this.recommendTop - this.selfHeight - 40 < 0) return 4;
      if (this.buyTop - this.selfHeight - 40 < 0) return 3;
      if (this.contentTop - this.selfHeight - 40 < 0) return 2;
      if (this.topTop - this.selfHeight - 40 < 0) return 1;
      return 0;
    },
    payClueShop() {
      if (this.otherClue.payClueShop.length > 0) {
        return this.otherClue.payClueShop.slice(
          this.showNum,
          this.showNum + 10
        );
      }
    }
  }
};
</script>

<style scoped lang="scss">
.m-clues-detail-wrap {
  padding-bottom: rem(100);

  .m-clues-list-bg {
    background: #f4f6f8 !important;
    margin-top: 20px;

    .m-clues-info-title {
      background: #fff;
    }
  }

  .m-clues-detail-top {
    background: #fff;
    display: flex;
    padding: rem(25) rem(20) rem(25) rem(20);
    height: rem(120);
    justify-content: flex-start;
    border-bottom: 1px solid #eee;

    .m-clues-detail-img {
      width: rem(120);
      height: rem(120);
      border: 1px solid #eee;

      img {
        width: 120px;
        height: 120px;
        display: block;
      }
    }

    .m-clues-detail-name {
      width: rem(330);
      font-size: rem(28);
      padding-left: rem(6);
      line-height: 1.3em;
    }

    .m-clues-detail-price {
      height: 46px;
      width: auto;
      display: flex;
      justify-content: flex-start;
      font-size: rem(22);

      .m-clues-price-left {
        background: $red;
        white-space: nowrap;
        -webkit-border-top-left-radius: rem(23);
        -moz-border-top-left-radius: rem(23);
        border-top-left-radius: rem(23);
        -webkit-border-bottom-left-radius: rem(23);
        -moz-border-bottom-left-radius: rem(23);
        border-bottom-left-radius: rem(23);
        color: #fff;
        height: rem(47);
        line-height: 47px;
        padding: 0 20px;
      }

      .m-clues-price-right {
        background: #fff;
        border: 1px solid $red;
        -webkit-top-right-border-radius: rem(22);
        -moz-border-top-right-radius: rem(22);
        border-top-right-radius: rem(22);
        -webkit-bottom-right-border-radius: rem(22);
        -moz-border-bottom-right-radius: rem(22);
        border-bottom-right-radius: rem(22);
        height: rem(44);
        line-height: rem(44);
        color: $red;
        padding-left: rem(10);
        padding-right: rem(10);
      }
    }
  }

  .m-clues-item-wrap {
    background: #fff;
    padding: rem(28) rem(30) rem(34) rem(20);

    .m-clues-prod-name {
      font-size: rem(26);
      line-height: 1.2em;
      font-weight: bold;
      padding-bottom: rem(20);
    }

    .m-clues-time {
      font-size: rem(24);
      color: #666;
      position: relative;

      & > .reason {
        width: rem(580);
        display: flex;
        flex-direction: column;
        margin-top: rem(10);
        line-height: rem(30);
        color: #f3262d;

        & > span {
          color: #666;
        }
      }

      .m-time {
        color: $red;
      }

      .m-share-btn {
        position: absolute;
        right: rem(0);
        font-size: rem(24);
        top: rem(0);
        color: $red;
        display: inline-block;
        padding-left: rem(30);
        height: rem(30);
        line-height: rem(30);
        background: url("../../../static/images/clues/icon-share.png") no-repeat
          left top;
        -webkit-background-size: rem(26) rem(26);
        background-size: rem(26) rem(26);
      }
    }
  }

  .m-share-box {
    display: flex;
    justify-content: flex-start;
    padding-top: rem(20);
    position: relative;

    .m-address {
      color: #666;
      font-size: rem(24);
      padding-right: rem(39);

      p {
        display: inline-block;
      }

      .m-city {
        padding: rem(6);
        background: #f60;
        display: inline-block;
        height: rem(28);
        font-size: rem(24);
        color: #fff;
        line-height: rem(28);
        -webkit-border-radius: rem(4);
        -moz-border-radius: rem(4);
        border-radius: rem(4);
      }
    }

    .m-service-limit {
      width: rem(400);
      font-size: rem(24);
      color: #666;

      .m-service-btn {
        display: inline-block;
        background: #79e290;
        -webkit-border-radius: rem(4);
        -moz-border-radius: rem(4);
        border-radius: rem(4);
        padding: rem(6);
        color: #fff;
      }

      p {
        display: inline-block;
      }
    }
  }

  .m-clues-list-title {
    height: rem(77);
    line-height: rem(77);
    font-weight: bold;
    font-size: rem(26);
    color: #333;
    padding: 0 rem(27);
    position: relative;
    background: #fff;

    h3 {
      border-bottom: 1px solid #eee;
    }
  }

  .m-clues-info-title {
    height: rem(77);
    line-height: rem(77);
    font-weight: bold;
    font-size: rem(26);
    color: #333;
    padding-left: rem(20);
    position: relative;

    .more {
      position: absolute;
      font-size: rem(24);
      color: #666;
      right: rem(20);
      top: 0;
    }
  }

  .m-clues-info {
    margin-top: rem(20);
    background: #fff;
    padding: 0 rem(7);

    .m-clues-info-list {
      border-top: 1px solid #eee;

      li {
        display: flex;
        position: relative;
        line-height: rem(80);
        color: #666;
        font-size: rem(24);
        padding-left: rem(20);
        justify-content: flex-start;
        flex-wrap: wrap;
        border-bottom: 1px solid #eee;

        .m-clues-info-left {
          width: rem(340);
        }

        .m-clues-info-right {
        }

        .m-arrow-right {
          width: rem(15);
          height: rem(15);
          border-top: 1px solid #666;
          border-right: 1px solid #666;
          transform: rotate(45deg);
          position: absolute;
          top: 50%;
          margin-top: rem(-10);
          right: rem(30);
        }
      }

      li.m-contact-item {
        max-height: rem(240);
        min-height: rem(80);
        line-height: rem(80);
        overflow: hidden;

        .m-contact-title {
          width: 120px;
          white-space: nowrap;
        }

        .m-contact-content {
          width: 580px;
          max-height: 180px;
          display: flex;
          padding-top: 10px;
          flex-wrap: wrap;

          span {
            margin: 0;
            padding: 0;
            height: 60px;
            line-height: 60px;
            display: inline-block;
            width: 280px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }

    .m-clues-content {
      color: #666;
      font-size: rem(24);
      padding: 0 rem(20);
      line-height: 1.4em;
      padding-bottom: rem(37);

      .m-clues-link {
        color: $blue;
        margin-right: rem(33);
      }
    }

    .m-clues-no-pass {
      color: $red;
      display: flex;
      padding-left: rem(20);
      font-size: rem(22);
      justify-content: flex-start;
      padding-bottom: rem(12);

      span:nth-child(2) {
        margin-right: rem(54);
      }

      span:first-child {
        margin-right: rem(20);
      }
    }

    .m-clues-pass {
      color: #30960c;
      padding-bottom: rem(12);
      display: flex;
      padding-left: rem(20);
      font-size: rem(22);
      justify-content: flex-start;

      span:nth-child(2) {
        margin-right: rem(54);
      }

      span:first-child {
        margin-right: rem(20);
      }
    }
  }

  .m-clues-num-wrap {
    padding-left: rem(20);
    padding-bottom: rem(18);
    display: flex;
    justify-content: flex-start;
    font-size: rem(24);
    color: #666;

    span {
      margin-right: rem(73);
      display: inline-block;
      padding-left: rem(30);
    }

    .icon-num {
      background: url("../../../static/images/clues/icon-num.png") no-repeat
        left center;
      -webkit-background-size: rem(20) rem(24);
      background-size: rem(20) rem(24);
    }

    .icon-time {
      background: url("../../../static/images/clues/icon-time.png") no-repeat
        left center;
      -webkit-background-size: rem(24) rem(24);
      background-size: rem(24) rem(24);
    }
  }

  .m-clues-user-list {
    display: flex;
    flex-wrap: wrap;
    padding: rem(22) 0 rem(22) rem(30);

    li {
      width: rem(50);
      height: rem(50);
      margin-right: rem(20);
      margin-bottom: rem(20);

      img {
        width: rem(50);
        height: rem(50);
        -webkit-border-radius: rem(25);
        -moz-border-radius: rem(25);
        border-radius: rem(25);
        background: #ccc;
        display: block;
      }
    }
  }

  .m-product-wrap {
    & > ul {
      display: flex;
      padding: 0 25px;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }

  .m-bottom-btn-wrap {
    position: fixed;
    display: flex;
    padding-top: rem(22);
    padding-left: rem(28);
    justify-content: flex-start;
    height: rem(78);
    width: rem(722);
    background: #fff;
    box-shadow: 0px 0px 6px 2px rgba(225, 225, 225, 0.5);
    left: 0;
    bottom: 0;
    font-size: rem(26);

    .m-more {
      color: #333;
      line-height: rem(56);
      margin-right: rem(10);
      white-space: nowrap;
    }

    .m-btn-service {
      height: rem(56);
      width: rem(118);
      display: inline-block;
      border: 1px solid #ccc;
      color: #666;
      -webkit-border-radius: rem(8);
      -moz-border-radius: rem(8);
      border-radius: rem(8);
      line-height: rem(56);
      text-align: center;
      margin-right: rem(10);
    }
  }

  .m-buy-btn-bottom {
    height: rem(98);
    line-height: rem(98);
    display: flex;
    position: fixed;
    z-index: 3000;
    bottom: 0;
    left: 0;
    font-size: rem(30);
    color: #fff;
    width: 100%;
    text-align: center;
    justify-content: space-between;

    .m-push-btn {
      height: rem(98);
      width: 100%;
      background: #ffb437;
    }

    .m-buy-btn {
      height: rem(98);
      width: 50%;
      background: #f3262d;
    }

    .m-buy-btn-disabled {
      height: rem(98);
      width: 50%;
      background: #ddd;
    }
  }

  .m-left-arrow {
    width: rem(26);
    height: rem(26);
    background: #d8d8d8;
    position: absolute;
    right: rem(114);
    top: rem(20);
    color: #fff;

    &:after {
      content: "";
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;
      transform: rotate(-45deg);
      width: rem(14);
      height: rem(14);
      position: absolute;
      left: rem(10);
      top: rem(5);
    }
  }

  .m-right-arrow {
    width: rem(26);
    height: rem(26);
    background: #d8d8d8;
    position: absolute;
    right: rem(53);
    top: rem(20);
    color: #fff;

    &:after {
      content: "";
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;
      transform: rotate(45deg);
      width: rem(14);
      height: rem(14);
      position: absolute;
      left: rem(0);
      top: rem(5);
    }
  }

  .m-nav-clues-tab {
    height: rem(80);
    border-bottom: 1px solid #eee;
    background: #fff;
    line-height: 80px;
    z-index: 100;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding-left: rem(75);
    display: flex;
    justify-content: space-between;
    padding-right: rem(110);
    font-size: rem(28);
    align-items: center;

    .m-menu-btn {
      color: #999;
      font-size: rem(60);
      position: absolute;
      right: rem(20);
      top: 0;
      height: rem(45);
      line-height: rem(45);
    }

    .active {
      color: $red;
    }

    .m-nav-clues-arrow {
      color: #999;
      min-width: 1em;
      position: absolute;
      left: rem(28);
      top: 50%;
      margin-top: rem(-16);
      font: 14px/1 "vant-icon";
      font-size: rem(32);
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;

      &:before {
        content: "\F008";
        display: inline-block;
      }
    }
  }

  .m-pop-wrap {
    text-align: center;
    font-size: rem(24);

    h3 {
      font-size: rem(30);
      color: #333;
      padding-top: rem(33);
      font-weight: bold;
    }

    .m-pop-tips {
      padding-top: rem(33);
      font-size: rem(30);
    }

    .m-pop-grey-tips {
      padding-top: rem(8);
      color: #999;
    }

    .m-pop-list {
      padding-top: rem(18);
      padding-bottom: rem(120);
      display: flex;
      width: rem(610);
      margin: 0 auto;
      flex-wrap: wrap;
      justify-content: space-between;

      li {
        width: rem(298);
        height: rem(315);
        margin-bottom: rem(20);

        a {
          display: block;
          padding-top: rem(44);
          width: rem(296);
          height: rem(266);
          border: 1px solid #eee;
          background: #fbfbfb;

          img {
            width: rem(48);
            height: rem(48);
          }

          span {
            display: block;
          }

          .m-pop-title {
            font-size: rem(26);
            margin-top: rem(22);
            color: #333;
          }

          .m-pop-content {
            color: #999;
            margin-top: rem(8);
            font-size: rem(24);
            white-space: nowrap;
            transform: scale(0.8);
          }

          .m-btn-to {
            width: rem(200);
            height: rem(56);
            margin: 0 auto;
            margin-top: rem(40);
            line-height: rem(56);
            color: #666;
            font-size: rem(26);
            border: 1px solid #ccc;
            -webkit-border-radius: rem(8);
            -moz-border-radius: rem(8);
            border-radius: rem(8);
          }
        }
      }
    }
  }

  .m-sort {
    width: 85%; //rem(640);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tbodyNone {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    font-size: rem(24);
    color: #666;
    background: #fff;

    .noneImg {
      width: 90px;
      height: 115px;
      margin-right: 24px;
    }
  }

  .m-panel {
    background: #fff;

    .m-panel-title {
      padding: rem(28);
      color: #333;
      font-size: rem(28);
    }

    .m-panel-item {
      border-top: 1px solid #eee;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: rem(28) 0 rem(28) rem(28);

      .m-checkbox-flex1 {
        width: rem(188);
        font-size: rem(24);
      }

      .m-flex-txt {
        width: rem(427);
        font-size: rem(24);
        color: #666;
      }

      .m-flex-price {
        color: $red;
        font-size: rem(24);
      }

      .m-flex-bottom {
        padding-top: rem(36);
        width: 100%;
        padding-left: rem(56);
        display: flex;
        font-size: rem(24);
        height: rem(40);
        line-height: rem(40);

        .m-city-box {
          width: rem(135);
          color: $blue;
        }

        .m-service-v {
          border: 1px solid $red;
          border-radius: rem(4);
          color: $red;
          text-align: center;
          width: rem(100);
          height: rem(40);
          line-height: rem(40);
        }

        .m-choice-city {
          color: #666;
          width: rem(460);
        }

        .m-arrow-right {
          width: rem(20);
          height: rem(20);
          border-top: 1px solid #999;
          border-right: 1px solid #999;
          transform: rotate(45deg);
        }
      }
    }
  }

  .m-all-choice {
    padding-top: rem(24);
    height: rem(60);
    background: #fff;
    font-size: rem(24);
    padding-left: rem(28);
    margin-bottom: rem(4);
  }

  .m-btn-buy-clues {
    display: block;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    width: 660px;
    height: 88px;
    line-height: 88px;
    background: #f3262d;
    color: #fff;
    margin: 0 auto;
    margin-top: 112px;
    font-size: 32px;
    text-align: center;
  }

  .m-tips-buy {
    margin-top: 34px;
    padding-left: 34px;
    color: #999;
    font-size: 24px;
    line-height: 1.5em;

    dt {
      color: #666;
    }
  }

  .m-total-price {
    color: #f43c42;
    font-size: 30px;
    text-align: right;
    padding-right: 50px;
  }

  .m-clues-pop-wrap {
    .m-title {
      color: #333;
      text-align: center;
      padding-top: 28px;
      font-size: 32px;
    }

    .m-textarea {
      border: 1px solid #eee;
      font-size: 24px;
      padding: 14px;
      width: 682px;
      display: block;
      margin: 0 auto;
      margin-top: 34px;
      height: 639px;
    }

    .m-tips {
      color: #f3262d;
      font-size: 24px;
      text-align: left;
      margin-top: 24px;
      padding-left: 14px;
    }
  }

  .font333 {
    color: #333;
  }

  .m-clues-prod-item {
    padding: 25px 27px;
  }
}
</style>
