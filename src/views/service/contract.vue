<template>
  <div class="service-contract">
    <HeadNav title="合同详情"></HeadNav>
    <!-- 说明 -->
    <div class="overview">
      <img src="@/assets/service/contract1.png" />
      <p class="sub-title">合同说明：</p>
      <p>以下合同内容由双方沟通商议后在线发起并签订，请仔细阅读合同内容，任何一方点击接受本合同，即意味着其已 阅读本合同所有条款，并对本合同条款的含义及相应的法律后果已全部知晓并充分认可，交易过程中如双方发生争议，合同将 作为官方仲裁的重要依据。 本合同由《专用条款》、《通用条款》组成，其效力按照由高到低排列，条款冲突时，以效力较高者优先适用。</p>
      <!-- <p>本合同由《专用条款》、《参考条款》（如有）、《通用条款》组成，其效力按照由高到低排列，条款冲突时，以效力较高者优先适用。</p> -->
      <h1 class="title">《专用条款》</h1>
    </div>
    <!-- 工期 -->
    <div class="con-title">工期</div>
    <div class="day-box center-box">
      <p class="sub-title">
        该需求完成时间为
        <span>{{allDay}}</span> 天
      </p>
      <van-cell
        class="contract-cell"
        :class="{f33:orderType !== 0}"
        title="开始时间"
        :is-link="orderType === 0"
        :value="startDate || '请选择开始时间'"
        @click="showStartTime = orderType === 0"
      />
      <van-cell
        class="contract-cell"
        :class="{f33:orderType !== 0}"
        title="结束时间"
        :is-link="orderType === 0"
        :value="endDate || '请选择结束时间'"
        @click="showEndTime = orderType === 0"
      />
    </div>
    <div class="con-title">项目阶段及支付方式-无定金</div>
    <div class="center-box price">
      <p>需求金额：</p>
      <p>￥{{orderInfo.price}}</p>
    </div>
    <!-- 阶段 -->
    <div class="center-box stage-box" v-for="(item,idx) in stageList" :key="idx">
      <van-cell class="contract-cell">
        <van-field
          label-width="3.3rem"
          :readonly="orderType > 0"
          maxlength="10"
          input-align="right"
          v-model="item.ProjectPhaseName"
          :label="`项目阶段`"
          placeholder="例：方案确定"
        />
      </van-cell>
      <van-cell class="contract-cell">
        <van-field
          label-width="3.3rem"
          :readonly="orderType > 0"
          maxlength="20"
          input-align="right"
          v-model="item.ProjectPhaseGain"
          label="具体内容及交付成果"
          placeholder="例：需求沟通及方案输出"
        />
      </van-cell>
      <van-cell class="contract-cell">
        <van-field
          label-width="3.3rem"
          :readonly="orderType > 0"
          maxlength="12"
          input-align="right"
          v-model="item.ProjectPhasePrice"
          label="付款金额（元）"
          type="number"
          placeholder="此阶段付款金额"
        />
      </van-cell>
      <van-cell class="contract-cell">
        <van-field
          label-width="3.3rem"
          :readonly="orderType > 0"
          maxlength="5"
          input-align="right"
          v-model="item.ProjectPhaseDay"
          label="工时（天）"
          type="number"
          placeholder="此阶段工时"
        />
      </van-cell>
      <p class="oper" v-if="orderType === 0">
        <span @click="delStage(idx)">删除此项目阶段</span>
        <span v-if="idx === stageList.length - 1 && stageList.length < 5" @click="addStage">添加新的项目阶段</span>
      </p>
    </div>
    <div class="con-title">项目描述</div>
    <!-- 需求 -->
    <div class="center-box tips">提示：雇主与服务商应当充分沟通，并明确服务项目的具体内容,如项目描述、产品功能描述、服务要求等</div>
    <textarea
      class="need-inp"
      :disabled="orderType > 0"
      maxlength="500"
      v-model="demand"
      placeholder="请填写项目描述"
    ></textarea>
    <!-- <div class="center-box upload-box">
      <comUpload></comUpload>
    </div>-->
    <div class="TY-title">《通用条款》</div>
    <div class="con-title">一、定义</div>
    <div class="center-box agree-tip">
      <p>除非本合同另有约定，在本合同中所用下列术语定义如下:</p>
      <p>1.1 服务平台：指深圳市凌天众媒网，网址：www.zhongmei66.com及以后可能使用的新网址。</p>
      <p>1.2 用户：指在服务平台合法注册，接受并认可服务平台相关协议、规则、规范、制度等的自然人、法人或其他组织。</p>
      <p>1.3 雇主：指在服务平台上发布服务需求并支付赏金的用户。</p>
      <p>1.4 服务商：指在服务平台上提供服务并收取赏金的用户。</p>
      <p>1.5 服务需求：指雇主发布的需要服务商完成的服务内容。</p>
      <p>1.6 赏金：指雇主和服务商的交易金额，即本合同金额。</p>
      <p>1.7 平台账户：指用户在服务平台注册的帐号，用户只能通过该帐户登录服务平台进行交易。</p>
    </div>
    <div class="con-title">二、双方责任</div>
    <div class="center-box agree-tip">
      <p>2.1 雇主应当根据服务需求主动或者应服务商要求向服务商提交本项目所需的相关资料，并保证该资料的真实性、合法性、 准确性、完整性，如因雇主未按照前述标准提供资料导致服务商无法履行合同义务，由此产生的责任由雇主自行承担。</p>
      <p>2.2 服务商应当在交易开始前，根据本项目服务需求提醒并引导雇主提交本项目所需的相关资料。如因服务商基于经验优势故 意或过失未提醒雇主提供必要资料导致项目无法继续进行的，由服务商承担相应责任。</p>
      <p>2.3 雇主与服务商因当在《专用条款》中明确服务需求的具体内容，包括服务事项、期限、赏金等项。</p>
      <p>2.4 雇主未按照约定托管或支付赏金的，服务商有权拒绝或顺延提供服务。</p>
      <p>2.5 服务商在服务平台开设店铺或出售服务中所公示的条款中，免除或者限制其责任的条款服务商有义务采取合理的方式提请 雇主注意，或按照雇主的要求对该条款予以说明。否则，以有利于雇主的解释为准。</p>
      <p>2.6 服务商未在本合同约定期限（含变更期限）内完成工作（含变更内容）的，雇主有权拒绝支付未确认部分的赏金。期限届 满后，如在雇主催告要求交付服务成果或申请退款之时起48小时内，服务商仍无法交付工作成果，服务商同意全额退款给雇 主，但雇主与服务商另有约定的除外。</p>
      <p>2.7 雇主与服务商明确约定工作期限，工作期限（含变更期限）届满，工作（含变更内容）未完成的：双方有约定的，按照约 定办理；如没有约定的，将按照工作未完成返还雇主所有支付款项（见2.6条），但是雇主与服务商继续就需求继续磋商，服务 商继续完成工作的，将视为双方变更工作期限，该变更工作期限双方未有明确约定的，雇主有权随时要求服务商在合理时间</p>
      <p>（合理时间应以雇主主张时起算，不得少于3个工作日）内完成工作，最终工作期限以雇主要求为准。</p>
      <p>2.8 雇主与服务商约定分阶段工作的，服务商完成阶段性工作，雇主应在3个工作日内予以验收确认，如验收合格应支付已完成 阶段的赏金；如雇主在3个工作日内未予以验收的，视为验收合格，服务商有权要求雇主支付已完成阶段赏金。经雇主验收合格 并确认支付赏金后产生纠纷的，已支付赏金不予退回，但雇主与服务商另有约定的除外。</p>
      <p>2.9 雇主与服务商未约定分阶段工作的，如工作未按期完成，雇主前期支付的款项应予以返还并按照双方约定承担违约责任， 但雇主与服务商另有约定的除外。</p>
      <p>2.10 雇主与服务商应按照法律规定自行缴纳相应税费。</p>
      <p>2.11 雇主与服务商均应充分了解且同意遵守服务平台公布的所有协议、规则、制度等文件，并按照服务平台的相关规定处理相 关交易事项。</p>
    </div>
    <div class="con-title">三、赏金</div>
    <div class="center-box agree-tip">
      <p>3.1 雇主与服务商应当根据服务平台公布的《凌天众媒网交易规则》完成赏金的托管及支付。</p>
      <p>3.2 服务商应当按照雇主最终实际支付的赏金金额向雇主开具合法有效的发票。</p>
    </div>
    <div class="con-title">四、服务保障</div>
    <div class="center-box agree-tip">
      <p>4.1 服务商应按照服务平台的规定及服务商自行作出的承诺承担服务保障责任。</p>
    </div>
    <div class="con-title">五、权利保证</div>
    <div class="center-box agree-tip">
      <p>5.1 本合同所产生成果的知识产权在雇主支付完全部赏金后，归雇主所有，但服务商享有署名权并保留用于参展、评选的权利。 但雇主与服务商另有约定的除外。</p>
      <p>5.2 服务商应当保证服务成果符合国家法律法规的规定，不存在任何侵犯第三方的所有权、知识产权、名誉权、肖像权等侵权行</p>
    </div>
    <div class="con-title">六、保密责任</div>
    <div class="center-box agree-tip">
      <p>6.1 服务商承诺，对在为雇主提供服务期间所知悉的雇主的商业秘密承担保密义务。</p>
    </div>
    <div class="con-title">七、不可抗力</div>
    <div class="center-box agree-tip">
      <p>7.1 因不可抗力导致本合同无法按照约定期限或是内容履行时，双方应及时协商解决。因不可抗力导致合同延迟履行或不能履行 的，均不构成违约责任。不可抗力是指不能预见、不能避免并无法克服的情况，包含地震、洪水等自然灾害以及战争等人力无 法抗拒的情形。</p>
    </div>
    <div class="con-title">八、争议解决</div>
    <div class="center-box agree-tip">
      <p>8.1 因本合同及与本合同有关的争议、解释等，均适用中华人民共和国法律。</p>
      <p>8.2 本合同签订或履行过程中，如有争议，双方应当友好协商解决；协商不成，双方一致同意任何一方可提交服务平台由服务平 台按照平台相关规则进行调解。</p>
      <p>8.3 双方也可不经服务平台进行调解，直接向人民法院提起诉讼。</p>
    </div>
    <div class="con-title">九、其他</div>
    <div class="center-box agree-tip">
      <p>9.1 本合同以电子文本形式生成，雇主与服务商完成合同订立手续后，即具有与手写签名同等的法律效力。</p>
      <p>9.2 本合同中的任何约定如违反法律法规的规定而无效的，该无效条款不影响本合同其他条款的效力，雇主与服务商仍因履行其他条 款所约定的权利义务。</p>
      <p>9.3 任何一方通过服务平台点击确认或以其他方式选择接受本合同，即表示该方已理解且同意本合同全部内容，本合同经双方点击确 认后立即生效。</p>
    </div>

    <!-- 签名 -->
    <div class="center-box sign" v-if="signUserInfo">
      <div class="sign-item">
        <img class="sign-img" :src="signImgA" />
        <p class="title">甲方（雇主）：</p>
        <div class="info">
          <p>雇主{{signUserInfo.usera.status ? '已完成实名认证' : '未完成实名认证'}}</p>
          <p v-if="orderInfo.employer">甲方（雇主）：{{signUserInfo.usera.name}}</p>
          <p
            v-if="signUserInfo.usera.status"
          >{{signUserInfo.usera.status === 2 ? '企业名称' : '姓名'}}：{{signUserInfo.usera.realname}}</p>
          <p v-if="signAtime">签署日期：{{signAtime}}</p>
        </div>
      </div>
      <div class="sign-item">
        <img class="sign-img" :src="signImgB" />
        <p class="title">乙方（服务商）：</p>
        <div class="info">
          <p>服务商{{signUserInfo.userb.status ? '已完成实名认证' : '未完成实名认证'}}</p>
          <p v-if="orderInfo.employee">乙方（服务商）：{{orderInfo.employee.store_name}}</p>
          <p
            v-if="signUserInfo.userb.status"
          >{{signUserInfo.userb.status === 2 ? '企业名称' : '姓名'}}：{{signUserInfo.userb.realname}}</p>
          <p v-if="signBtime">签署日期：{{signBtime}}</p>
        </div>
      </div>
    </div>
    <div
      class="fixed-btn"
      :style="!hidshow?'position:static':'position:fixed'"
      v-if="orderType !== 2"
      @click="sureCon"
    >确定</div>
    <!-- 时间 -->
    <selTime v-model="startDate" :show.sync="showStartTime"></selTime>
    <selTime v-model="endDate" :show.sync="showEndTime" :min="1"></selTime>
    <!-- 弹框 -->
    <skyPop v-model="showPop">
      <!-- 发送合同 -->
      <template v-if="nowPop === 0">
        <h5 class="pop-title">发送合同</h5>
        <p class="pop-tip">
          请确保合同内容已经双方协商达成一致，如未协商，请先协商之后再发起。合同将作为交易过程
          中的执行标准以及纠纷仲裁的唯一依据。
        </p>
        <p class="pop-qs">确定发送合同吗？</p>
        <div class="contract-btn send-btn" @click="sendFill">确定</div>
      </template>
      <!-- 发送短信 -->
      <template v-if="nowPop === 1">
        <h5 class="pop-title">短信验证</h5>
        <p class="tel pop-tip">接收手机号码：{{mobile}}</p>
        <van-field v-model="code" placeholder="短信验证码" class="code-box" type="number">
          <div
            class="code-btn"
            @click="sendCode"
            :class="{'dis-btn':!canCountDownDo}"
            slot="button"
          >{{countDownUIText}}</div>
        </van-field>
        <p class="tel">如已更换手机号请联系客服 400-688-6662</p>
        <div class="contract-btn send-btn" @click="codeSign">确定</div>
      </template>
    </skyPop>
  </div>
</template>

<script>
import comUpload from "@/components/service/comUpload";
import selTime from "@/components/service/selTime";
import skyPop from "@/components/service/order/skyPop";
import {
  getOrderDetail,
  isCert,
  fillContract,
  getContract,
  getUserInfo,
  eSignUserCode,
  getCAndP,
  contractSign,
  eSignUserGet,
  contractQrCode
} from "@/api/service";
import { countDownMixin } from "@/utils/mixins";
const noSign = require("@/assets/service/no-sign.png");
export default {
  name: "serviceContract",
  components: { comUpload, selTime, skyPop },
  mixins: [countDownMixin()],
  data() {
    return {
      docmHeight: "0",
      showHeight: "0",
      hidshow: true,
      loading: false,
      mobile: null,
      orderSn: this.$route.query.sn,
      orderType: +(this.$route.query.type || 0), // 0 发起 1 签署 2 查看
      orderInfo: {},
      contractDetail: null,
      code: "",
      demand: "",
      stageList: [
        {
          ProjectPhaseName: "",
          ProjectPhaseGain: "",
          ProjectPhasePrice: "",
          ProjectPhaseDay: ""
        }
      ],
      startDate: "",
      endDate: "",
      showStartTime: false,
      showEndTime: false,
      showPop: false,
      nowPop: 0, // 0发送合同 1发送短信
      CAndP: null, // C企业 P个人
      CAndPInfo: null,
      isDraw: !!this.$route.query.draw,
      signImgA: noSign,
      signImgB: noSign,
      signAtime: "",
      signBtime: "",
      signUserInfo: null
    };
  },
  computed: {
    allDay() {
      let res = Math.floor(
        (Date.parse(this.endDate) - Date.parse(this.startDate)) /
          (1000 * 60 * 60 * 24)
      );
      return isNaN(res) ? 0 : res;
    },
    sumMoney() {
      return this.stageList.reduce(
        (pre, cur) => pre + +cur.ProjectPhasePrice,
        0
      );
    },
    sumDays() {
      return this.stageList.reduce(
        (pre, cur) => pre + Math.floor(cur.ProjectPhaseDay),
        0
      );
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    CAndPName() {
      return this.CAndP === "P"
        ? `姓名：${this.CAndPInfo.name}`
        : `企业名称：${this.orderInfo.employee.company_name}`;
    }
  },
  beforeRouteUpdate(to, form, next) {
    const { query } = to;
    if (query.type) {
      this.orderType = query.type;
    }
    this.checkContract();
    next();
  },
  created() {
    this.userInit();
    this.dataInit();
    if ([0, 1].includes(this.orderType)) {
      this.checkSelfCert();
      this.checkCAndP();
    }
    if (this.orderType === 1 && this.isDraw) {
      this.checkDraw();
    }
    if ([1, 2].includes(this.orderType)) {
      this.checkContract();
    }
  },
  mounted() {
    this.docmHeight = document.documentElement.clientHeight;
    window.onresize = () => {
      return (() => {
        // 实时屏幕高度
        this.showHeight = document.documentElement.clientHeight;
      })();
    };
  },
  watch: {
    showHeight: function() {
      if (this.docmHeight > this.showHeight) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    },
    showStartTime: function() {
      if (this.showStartTime) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    },
    showEndTime: function() {
      if (this.showEndTime) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    }
  },
  methods: {
    addStage() {
      // 添加新阶段
      this.stageList.length < 5 &&
        this.stageList.push({
          ProjectPhaseName: "",
          ProjectPhaseGain: "",
          ProjectPhasePrice: "",
          ProjectPhaseDay: ""
        });
    },
    delStage(idx) {
      // 删除阶段
      if (this.stageList.length > 1) {
        this.stageList.splice(idx, 1);
      } else {
        this.$toast("至少保留一个阶段");
      }
    },
    async dataInit() {
      const order = await getOrderDetail(this.orderSn);
      if (!order) return;
      this.orderInfo = order;
    },
    checkSelfCert() {
      // 检查自身实名认证获取姓名
      const cert = isCert();
      if (!cert) {
        return this.$router.replace({
          path: "/serviceOrder",
          query: {
            sn: this.orderSn,
            doing: "noCert"
          }
        });
      }
    },
    async checkContract() {
      // 获取合同内容
      const data = await getContract(this.orderSn);
      if (!data) return;
      this.contractDetail = data.data;
      const {
        StuffData,
        signA,
        signB,
        signATime,
        signBTime,
        contractData
      } = this.contractDetail;
      this.stageList = StuffData.map(item => ({
        ProjectPhaseName: item.name,
        ProjectPhaseGain: item.stage,
        ProjectPhasePrice: item.moneys,
        ProjectPhaseDay: item.days
      }));
      this.demand = StuffData[0].content;
      this.startDate = StuffData[0].begin_time
        ? StuffData[0].begin_time.split(" ")[0]
        : "";
      this.endDate = StuffData[0].end_time
        ? StuffData[0].end_time.split(" ")[0]
        : "";
      if (signA) this.signImgA = `data:image/png;base64,${signA}`;
      if (signB) this.signImgB = `data:image/png;base64,${signB}`;
      this.signAtime = signATime;
      this.signBtime = signBTime;
      this.signUserInfo = contractData;
    },
    async checkDraw() {
      const data = await eSignUserGet(this.orderSn);
      data && this.popTip(1);
    },
    async userInit() {
      if (this.userInfo) return;
      const data = await getUserInfo();
      if (!data) return;
      this.$store.commit("CHANGE_USER_INFO", data);
    },
    async checkCAndP() {
      const data = await getCAndP();
      if (!data) return;
      let tel = "" + data.mobile;
      var ary = tel.split("");
      ary.splice(3, 4, "****");
      var tel1 = ary.join("");
      console.log(tel1);
      this.mobile = tel1;
      this.CAndP = data.status === 2 ? "C" : "P";
      this.CAndPInfo = data;
    },
    popTip(type) {
      this.nowPop = type;
      this.showPop = true;
    },
    sureCon() {
      if (this.orderType === 0) {
        if (this.allDay < 1) return this.$toast("项目工期最少一天");
        if (this.sumMoney !== +this.orderInfo.price)
          return this.$toast("阶段金额总和与项目金额不符");
        if (this.sumDays !== this.allDay)
          return this.$toast("阶段工期总和与项目工期不符");
        if (this.demand.length < 20) return this.$toast("需求描述最少20个字");
        if (!this.stageList.every(item => item.ProjectPhaseName.length >= 2))
          return this.$toast("阶段名称最少2个字");
        if (!this.stageList.every(item => item.ProjectPhaseGain.length >= 2))
          return this.$toast("阶段内容最少2个字");
        this.popTip(0);
      } else {
        this.goSign();
      }
    },
    async sendFill() {
      if (this.loading) return;
      this.loading = true;
      const opts = {
        begin_time: this.startDate,
        end_time: this.endDate,
        day_count: this.allDay,
        ProjectPhasePrice: this.orderInfo.price,
        content: this.demand,
        ordersn: this.orderSn,
        project: this.stageList
      };
      const data = await fillContract(opts);
      this.loading = false;
      if (!data) return;
      this.$toast("合同发送成功");
      this.goSign();
    },
    async goSign() {
      if (this.CAndP === "P") {
        const data = await contractQrCode({ order_sn : this.orderSn });
        console.log('6666666666', data)
        // 个人
        this.$router.push({
          path: "/serviceMsign",
          query: { order_sn: this.orderSn, token: data.data.token, type: 'mobile' }
        });
      } else {
        // 企业
        this.popTip(1);
      }
    },
    async sendCode() {
      const unlock = this.canCountDownDo;
      if (!unlock) return;
      const data = await eSignUserCode();
      if (!data) return;
      this.countDownInit();
      this.$toast("验证码已发送");
    },
    async codeSign() {
      if (this.loading) return;
      this.loading = true;
      const opts = {
        ordersn: this.orderSn,
        code: this.code
      };
      const data = await contractSign(opts);
      this.loading = false;
      if (!data) return;
      this.$toast("签约成功");
      this.showPop = false;
      // 再次读取合同
      this.$router.replace({
        path: "/serviceContract",
        query: { sn: this.orderSn, type: 2 }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/css/sky-pop.scss";
.code-box {
  width: 100%;
  padding: 0;
  margin-top: -15px;
  /deep/ .van-field__body {
    height: 100%;
    .van-field__control {
      font-family: $font;
      font-weight: 400;
      line-height: 0.493rem;
      font-size: rem(26);
      border: 1px solid #ccc;
      @include round(0.05rem 0px 0px 0.05rem);
      padding: 0 0.266rem;
      border-right: none;
      align-self: stretch;
    }
    .van-field__button {
      padding-left: 0;
    }
  }
  .code-btn {
    font-size: 30px;
    font-family: $font;
    font-weight: 400;
    @include round(0 4px 4px 0);
    padding: 15px 23px;
    color: $red;
    line-height: 37px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(243, 38, 45, 1);

    &.dis-btn {
      background: #cccccc;
      color: #fff;
      cursor: not-allowed;
      pointer-events: none;
      border: none;
    }
  }
}
.tel {
  font-size: 26px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 37px;
  margin-top: 20px;
  align-self: flex-start;
}

.service-contract {
  @include borderBox;
  padding-bottom: 148px;
  background: #fff8f8;

  /* 合同说明 */

  .overview {
    @include borderBox;
    padding: 30px 30px 40px 30px;
    font-family: $font;
    color: #333;
    img {
      width: 350px;
      height: 67px;
      display: block;
      margin: auto;
    }
    p {
      font-size: 24px;
      font-weight: 400;
      line-height: 33px;
      &.sub-title {
        font-size: 26px;
        font-weight: 500;
        margin-top: 50px;
        margin-bottom: 10px;
      }
    }
    .title {
      font-size: 34px;
      font-weight: 500;
      text-align: center;
      margin-top: 50px;
    }
  }
.TY-title{
  font-size: rem(34);
  color: #333;
  text-align: center;
  margin: rem(50) 0 rem(40);
  font-weight: 600;
}
  /* 段 */
  .con-title {
    height: 80px;
    background: rgba(255, 226, 227, 1);
    line-height: 80px;
    padding-left: 30px;
    @include borderBox;
    width: 100%;
    font-size: 28px;
    font-family: $font;
    font-weight: 500;
    color: #333;
  }

  /* 中间盒子 */
  .center-box {
    width: 710px;
    margin: 20px auto;
    background: #fff;
    @include round(4px);
    @include borderBox;
    padding: 20px;
    font-family: $font;
    font-weight: 400;
    /deep/ .contract-cell {
      padding: rem(30) 0;
      &::after {
        left: 0;
      }
      .van-cell {
        padding: 0;
        font-size: rem(26);
        font-family: $font;
        font-weight: 400;
        color: #333;
      }
      &.f33 {
        .van-cell__title,
        .van-cell__value {
          span {
            color: #333;
          }
        }
      }
    }
  }

  /* 工期 */
  .day-box {
    padding: 1px 20px;
    .sub-title {
      font-size: 24px;
      margin-top: 20px;
    }
    .day-check {
      @include borderBox;
      padding: 30px 0;
      font-size: 26px;
      font-weight: 400;
      color: #333;
      @include flex;
      &:last-child {
        border-top: 1px solid #ccc;
      }
      p:last-child {
        @include flex(flex-start);
        font-size: 24px;
        color: #999;
        span {
          margin-right: 10px;
        }
      }
    }
  }

  /* 阶段 */
  .price {
    @include flex;
    font-size: 26px;
    color: #333;
    p:last-child {
      color: $red;
    }
  }
  .stage-box {
    padding: 0 20px;
    .oper {
      @include flex;
      height: 37px;
      font-size: 26px;
      font-weight: 400;
      margin-top: 30px;
      padding-bottom: 30px;
      width: 100%;
      color: #0066cc;
    }
  }

  /* 需求 */
  .tips {
    background: none;
    color: $red;
    font-size: 22px;
    font-weight: 400;
    line-height: 30px;
    padding: 0;
    margin-bottom: 0;
  }
  .upload-box {
    margin-top: 0;
    .need-tip {
      margin-bottom: 0;
    }
  }
  .need-inp {
    width: 710px;
    height: 280px;
    background: rgba(255, 255, 255, 1);
    @include round(4px);
    overflow-y: auto;
    padding: 20px;
    @include borderBox;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    line-height: 33px;
    margin: 20px auto;
    display: block;
    border: none;
  }

  /* 定义 */
  .agree-tip {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 40px;
  }

  /* 签约 */
  .sign {
    margin-top: 50px;
    padding: 0;
    .sign-item {
      @include borderBox;
      width: 100%;
      height: 260px;
      // @include flex;
      padding: 20px 30px;
      position: relative;
      &:first-child {
        border-bottom: 1px solid #ccc;
      }
      .title {
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999;
      }
      .info {
        @include flex(flex-end, flex-end);
        flex-direction: column;
        position: absolute;
        right: 30px;
        bottom: 20px;
        p {
          font-size: 24px;
          font-family: $font;
          font-weight: 400;
          line-height: 33px;
        }
      }
      .sign-img {
        position: absolute;
        width: 198px;
        height: 144px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 10;
      }
    }
  }
}
.fixed-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 98px;
  line-height: 98px;
  text-align: center;
  font-size: 30px;
  font-family: $font;
  font-weight: 400;
  background: $red;
  color: #fff;
  z-index: 10;
}
.pop-tip {
  line-height: 37px;
}
</style>
