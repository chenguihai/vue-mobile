<template>
  <div class="container">
    <head-nav title="发布客户示例"></head-nav>
    <div class="company_name">
      <!--第一步-->
      <van-cell-group>
        <van-field v-model="form.case_name" clearable label="示例名称" placeholder="请输入示例名称"
                   input-align="right" @input="verificationForm"/>
        <van-cell title="示例分类" :value-class="{cell_item:formShow.cateName}" is-link :value="formShow.cateName ||'请选择'"
                  @click="routerJump('cate')"/>
        <van-field v-model="form.customer_name" clearable label="客户名称" placeholder="请输入客户名称" input-align="right"
                   @input="verificationForm"/>
        <van-cell title="客户所在领域" :value-class="{cell_item:formShow.realmName}" is-link
                  :value="formShow.realmName ||'请选择'"
                  @click="popupFlag = true"/>
        <van-field v-model="form.price" clearable label="合作费用(元)" placeholder="请输入合作费用" input-align="right"
                   type="number"
                   @input="verificationForm"/>
        <!--示例主图-->
        <div class="upload_wrap">
          <h4 class="title">示例主图</h4>
          <comUpload ref="comUpload" :max="1" v-model="fileLists">
            <div slot="tips" class="need-tip">
              <p>上传图片比例最佳为5:3</p>
            </div>
          </comUpload>
        </div>
        <ul class="jump_wrap">
          <li class="item" @click="routerJump('introduce')">
            <span class="name">示例详情介绍</span>
            <span class="text" v-if="form.desc">已填写</span>
            <span class="place" v-else></span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt="">
          </li>
        </ul>
        <fixed-btn name="确认发布" :disabled="!isDisabled" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
    </div>
    <!--弹出框-->
    <bottom-popup v-if="popupFlag" name="确定" title="客户领域" :list="realmList" :id="form.realm_id" @submit="emitSubmit"
                  @close="emitClose"/>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import BottomPopup from "@/components/common/BottomPopup";
  import {getRealm, caseAdd, caseEdit, getCaseInfo} from '@/api/customer'
  import comUpload from "@/components/service/comUpload";
  import {checkEmptyValue, regDaqo} from '@/utils/tool'
  import {commonRegs, commonToastRegs} from '@/utils/tool'
  import {getCategory} from '@/api/customer'

  const errMsgList = new Map([
    ['case_name', ['请输入示例名称', '', '示例名称为5-30字']],
    ['cate_id', ['请选择示例分类']],
    ['customer_name', ['请输入客户名称', '', '客户名称为5-30字']],
    ['realm_id', ['请选择客户所在领域']],
    ['price', ['请输入合作费用', '', '合作费用不能低于1']],
    ['image_url', ['请上传示例主图']],
    ['desc', ['请输入示例详情']],
  ])
  export default {
    name: "publishExample",
    components: {PopupPicker, FixedBtn, BottomPopup, comUpload},
    data() {
      return {
        popupFlag: false,
        fileLists: [],
        form: {
          case_name: '',//	是	string	客户合作示例名称
          cate_id: '',//	是	int	三级分类id
          customer_name: '',//	是	string	客户名称
          realm_id: '',//	是	int	领域id
          price: '',//	是	decimal(11,2)	价格，两位小数
          image_url: '',//	是	string	合作示例主图url
          desc: '',//	是	text	合作示例详情
        },
        formShow: {
          realmName: '',
          cateName: '',
        },
        formRules: [
          'case_name',
          'cate_id',
          'customer_name',
          'realm_id',
          'price',
          'image_url',
          'desc',
        ],
        realmList: [],
        isDisabled: false,
        dataList: [],
        categoryList: []
      }
    },
    created() {
      this.getRealmHttp();
      let query = this.$route.query,
        params = localStorage.getItem('publishExample'),
        nameObj = localStorage.getItem('formShow');
      if (query.id) {
        // this.form.id = query.id;
        this.getCase(query.id);
      }
      if (params) { //有参入传入，合并参数
        let data = JSON.parse(params);
        this.fileLists = data.image_url ? [{url: data.image_url}] : [];

        this.form = {...data, ...query};
        localStorage.setItem('publishExample', JSON.stringify(this.form));
      } else { //没有参入传入
        this.form = {...this.form, ...query};
      }
      if (nameObj) {
        this.formShow = {...this.formShow, ...JSON.parse(nameObj)};
        localStorage.setItem('formShow', JSON.stringify(this.formShow));
      }
      let categoryExample = localStorage.getItem('categoryExample');
      if (!categoryExample) {
        this.getCategoryHttp();
      } else {
        this.categoryList = JSON.parse(categoryExample);
      }
    },
    methods: {
      async getCategoryHttp() {
        const data = await getCategory();
        if (!data) return
        localStorage.setItem('categoryExample', JSON.stringify(data))
      },
      verificationForm() {
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      routerJump(type) {
        const [image = {}] = this.fileLists;
        this.form.image_url = image.url || '';
        localStorage.setItem('publishExample', JSON.stringify(this.form));
        localStorage.setItem('formShow', JSON.stringify(this.formShow));
        if (type === 'cate') {
          this.$router.push({path: "/customer/selectCate", query: {id: this.dataList.case_cate}});
        } else if (type === 'introduce') {
          this.$router.push({path: "/exampleIntroduce"});
        }
      },
      async getRealmHttp() {
        const data = await getRealm();
        if (!data) return
        this.realmList = data;
      },
      onSubmit() {
        this.isDisabled = commonToastRegs(this.formRules, this.form, errMsgList, this);
        if (!this.isDisabled) return
        if (this.form.id) {
          this.editCase()
        } else {
          this.addCase();
        }
      },
      emitSubmit(obj) {
        this.form.realm_id = obj.id;
        this.formShow.realmName = obj.name;
        this.emitClose();
        this.verificationForm();
      },
      emitClose() {
        this.popupFlag = false;
      },
      async getCase(id) {
        const data = await getCaseInfo(id);
        if (!data) return
        const {case_name, cate_id, customer_name, realm_id, price, image_url, desc} = data;
        let [item = {}] = this.realmList.filter(item => item.id === realm_id)
        const catName = this.catOptionCommonFun(+cate_id, this.categoryList);
        this.form = {
          id,
          case_name,//	是	string	客户合作示例名称
          cate_id,//	是	int	三级分类id
          customer_name,//	是	string	客户名称
          realm_id,//	是	int	领域id
          price,//	是	decimal(11,2)	价格，两位小数
          image_url,//	是	string	合作示例主图url
          desc,//	是	text	合作示例详情
        };
        this.fileLists = image_url ? [{url: image_url}] : [];
        this.formShow = {
          realmName: item.sr_name || '',
          cateName: catName || ''
        };
        localStorage.setItem('publishExample', JSON.stringify(this.form));
        localStorage.setItem('formShow', JSON.stringify(this.formShow));
        this.dataList = data;
      },
      async addCase() {
        const data = await caseAdd(this.form);
        if (data.code === 422) {
          this.$toast(data.message);
          return;
        }
        this.$toast('提交成功');
        this.$router.push({path: "/exampleManage"});

      },
      async editCase() {
        const data = await caseEdit(this.form.id, this.form);
        if (data.code === 422) {
          this.$toast(data.message);
          return;
        } else {
          this.$toast('提交成功');
          this.$router.push({path: "/exampleManage"});
        }
      },
      catOptionCommonFun(id, cate = []) {
        let item = []
        let subItem = []
        let oneCatename = ''
        let twoCatename = ''
        let threeCatename = ''
        for (let i = 0; i < cate.length; i++) {
          if (cate[i].children) { // 找出选中一级的id
            oneCatename = cate[i].cate_name
            item = cate[i].children
            for (let j = 0; j < item.length; j++) {
              if (item[j].children) { // 找出选中二级的id
                twoCatename = item[j].cate_name
                subItem = item[j].children || [];
                for (let k = 0; k < subItem.length; k++) {
                  if (subItem[k].id === id) { // 找出选中三级的id
                    threeCatename = subItem[k].cate_name
                    return oneCatename + '>' + twoCatename + '>' + threeCatename
                  }
                }
              }
            }
          }
        }
      },
    },
    watch: {
      fileLists(val) {
        const [image = {}] = this.fileLists;
        this.form.image_url = image.url || '';
        this.isDisabled = commonRegs(this.formRules, this.form);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../css/auth";

  .company_name {
    padding-bottom: 128px;
  }

  .upload_wrap {
    padding: $w_20 0;
    margin: 0 $w_30;
    border-bottom: 1px solid $c_ccc;

    .title {
      @include height(37px);
      font-size: 26px;
      margin-bottom: 23px;
    }

    .desc {
      @include height(28px);
      font-size: 20px;
      color: $c_999;
    }
  }
</style>
