<template>
  <div class="container">
    <head-nav title="发布服务"></head-nav>
    <div class="company_name">
      <!--第一步-->
      <van-cell-group>
        <van-field v-model="form.name" clearable label="服务名称" placeholder="请输入服务名称" maxlength="30"
                   input-align="right" @input="verificationForm"/>
        <van-cell title="分类" :value-class="{cell_item:formShow.cateName}" is-link :value="formShow.cateName ||'请选择'"
                  @click="routerJump('cate')"/>
        <van-cell title="服务领域" :value-class="{cell_item:form.realm}" is-link :value="(form.realm? '已选择':'') ||'请选择'"
                  @click="routerJump('realm')"/>
        <van-cell title="服务地区" :value-class="{cell_item:form.regions}" is-link :value="(form.regions? '已选择':'') ||'请选择'"
                  @click="routerJump('area')"/>
        <van-field v-model="form.price" clearable label="售价（元）" placeholder="请输入售价" input-align="right" type="number"
                   @input="verificationForm"
        />
        <van-field v-model="form.market_price" clearable label="市场价（元）" placeholder="请输入市场价" input-align="right" type="number"
                   @input="verificationForm"
        />
        <van-field label-width="110px" v-model="form.stock" clearable label="库存" placeholder="请输入库存" type="number"
                   input-align="right" @input="verificationForm"
        />
        <van-cell title="单位" :value-class="{cell_item:formShow.unit_name}" is-link :value="formShow.unit_name"
                  @click="showPopup('unit')"/>
        <van-cell title="店铺分类" :value-class="{cell_item:form.class}" is-link :value="(form.class? '已选择':'') ||'请选择'"
                  @click="routerJump('store_cate')"/>
        <!--主图-->
        <div class="upload_wrap">
          <h4 class="title">主图</h4>
          <comUpload ref="comUpload" :max="1" v-model="fileLists">
            <div slot="tips" class="need-tip">
              <p>上传图片比例最佳为5:3</p>
            </div>
          </comUpload>
        </div>
        <!--视频-->
        <div class="upload_wrap">
          <h4 class="title">视频（可选）</h4>
          <upload-video v-model="fileVideoList" :max="1"></upload-video>
        </div>
        <ul class="jump_wrap">
          <li class="item" @click="showPopup('aptitude')">
            <span class="name">所属媒介资质（可选）</span>
            <span class="text" v-if="formShow.intellName">{{formShow.intellName}}</span>
            <span class="place" v-else>请选择</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt="">
          </li>
          <li class="item" @click="routerJump('brand')">
            <span class="name">所属品牌（可选）</span>
            <span class="text" v-if="formShow.brandName">{{formShow.brandName}}</span>
            <span class="place" v-else>请选择</span>
            <img class="arrow" src="@/assets/auth/arrow_right_gray.png" alt=""></li>
        </ul>
        <fixed-btn name="下一步" :disabled="!isDisabled" @submit="onSubmit"></fixed-btn>
      </van-cell-group>
    </div>
    <!--弹框选择-->
    <popup-picker v-if="showPicker" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
  </div>
</template>

<script>
  import PopupPicker from '@/components/common/PopupPicker'
  import FixedBtn from "@/components/common/FixedBtn";
  import comUpload from "@/components/service/comUpload";
  import {serviceShowAdd, serviceAdd, serviceEdit, showEdit} from '@/api/serviceManage'
  import {checkEmptyValue} from '@/utils/tool'
  import {mapMutations, mapState} from 'vuex'
  import UploadVideo from "@/components/common/UploadVideo";
  import {commonRegs, commonToastRegs} from '@/utils/tool'

  // type 0 空值  1 不等值  2 正则不匹配
  const errMsgList = new Map([
    ['name', ['请输入服务名称', '', '服务名称为5-30字']],
    ['cat_id', ['请选择服务分类']],
    ['realm', ['请选择服务领域']],
    ['regions', ['请选择服务地区']],
    ['class', ['请选择店铺分类']],
    ['stock', ['请输入库存', '', '库存不能低于1']],
    ['unit', ['请选择单位']],
    ['price', ['请输入售价', '', '售价不能低于1']],
    ['market_price', ['请输入市场价', '', '市场价不能低于1']],
    ['img', ['请上传一张图片']],
  ])
  export default {
    name: "publishService",
    components: {PopupPicker, FixedBtn, comUpload, UploadVideo},
    data() {
      return {
        showPicker: false,
        fileLists: [],
        fileVideoList: [
          // {url: '/uploads/videos/201912/11/201912110514238144.mp4'}
        ],
        formShow: {
          unit_name: '',
          intellName: '',
          cateName: '',
          brandName: ''
        },
        form: {
          name: '',//	是	string	服务名称,例:山东省青岛市城阳区流亭国际机场T1航站楼LED显示屏
          cat_id: '',//	是	string	一二三级分类类目id，逗号隔开,例:8,20,22
          realm: '',//	是	string	服务领域id ,逗号隔开,例:1,2,3
          regions: '',//	是	string	地区编码,逗号隔开,例:110000,120104,130121
          price: '',//	是	decimal(10,2)	售价,例:1.99或1
          market_price: '',//	是	decimal(10,2)	市场价,例:10.99
          stock: '',//	是	int	库存,例:11
          unit: '',//	是	int	服务单位id,例:1
          class: '',//	是	string	店铺分类id，逗号隔开,例:1,2,3
          img: '',//	是	string	主图,例:uploads/images/201909/03/201909031021073155.jpg
          sort: 1,//	是	int	排序,例:1

          brand: '',//	否	string	品牌数据id ,逗号隔开,例:1,2,3
          video: '',//	否	string	服务视频url,例:uploads/images/201909/03/201909031021073155.mp4
          intell: '',//	否	int	服务媒介资质id,例:1
        },
        formRules: [
          {
            name: 'name',
            custom(val) {
              return /.{5,30}/.test(val)
            }
          },
          'cat_id',
          'realm',
          'regions',
          {
            name: 'price',
            custom(val) {
              return val >= 1
            }
          },
          {
            name: 'market_price',
            custom(val) {
              return val >= 1
            }
          },
          {
            name: 'stock',
            custom(val) {
              return val >= 1
            }
          },
          'unit',
          'class',
          'img'
        ],
        searchResult: [],
        columns: [],
        selecetType: '',
        aptitudeList: [], //所属媒介资质
        cateList: [], //分类
        realmList: [], //领域
        store_cateList: [],
        unitList: [],
        brandList: [],
        isDisabled: false
      }
    },
    created() {
      let query = this.$route.query;
      let params = localStorage.getItem('publishService'),
        nameObj = localStorage.getItem('formShow');
      if (query.id) {
        this.form.id = query.id;
        this.getList(query.id);
      }
      if (params) { //有参入传入，合并参数
        let data = JSON.parse(params);
        this.form = {...data, ...query};
        if (query.regions) {
          this.form.regions = query.regions;
        }
        this.fileLists = data.img ? [{url: data.img}] : [];
        this.fileVideoList = data.video ? [{url: data.video}] : [];
        // data.id && this.getList(data.id);
      } else { //没有参入传入
        this.form = {...this.form, ...query};
      }
      if (nameObj) {
        this.formShow = {...this.formShow, ...JSON.parse(nameObj)};
      }
      localStorage.setItem('publishService', JSON.stringify(this.form));
      localStorage.setItem('formShow', JSON.stringify(this.formShow));
      this.baseInfo();
    },
    computed: mapState({
      ali_api_host: state => state.ali_api_host,
    }),
    methods: {
      ...mapMutations(['SERVICE_SHOW_ADD']),
      verificationForm() {
        this.isDisabled = commonRegs(this.formRules, this.form);
      },
      routerJump(type) {
        const [img = {}] = this.fileLists;
        const [video = {}] = this.fileVideoList;
        this.form.img = img.url || '';
        this.form.video = video.url || '';
        localStorage.setItem('publishService', JSON.stringify(this.form));
        localStorage.setItem('formShow', JSON.stringify(this.formShow));
        if (type === 'cate') {
          let length = this.cateList.length;
          if (length === 1) {
            this.$router.push({path: '/choiceCatethree', query: {id: this.form.cat_id}})
          } else if (length > 1) {
            this.$router.push({path: "/selectCate", query: {id: this.form.cat_id}});
          }
        } else if (type === 'realm') {
          this.$router.push({path: '/addFieldService', query: {id: this.form.realm}})
        } else if (type === 'store_cate') {
          this.$router.push({path: '/storeClassify', query: {id: this.form.class}})
        } else if (type === 'brand') { //品牌
          const {cat_id, brand} = this.form;
          this.$router.push({path: '/selectBrand', query: {id: cat_id, brandId: brand}})
        } else if (type === 'area') { //地区
          this.$router.push({path: '/choiceAreas', query: {id: this.form.regions}})
        }
      },
      showPopup(type) {
        let data = [];
        if (type === 'unit') {
          data = this.unitList.map(item => item.unit_name);
        } else if (type === 'aptitude') {
          if (this.aptitudeList.length === 0) {
            this.$toast('你还没有添加媒介资质');
            return
          }
          data = this.aptitudeList.map(item => item.name);
        }
        this.showPicker = true;
        this.selecetType = type;
        this.columns = data;
      },
      onChange(picker, value, index) {
        Toast(`当前值：${value}, 当前索引：${index}`);
      },
      onConfirm() {
        this.showPicker = false;
      },
      emitSubmit(val) {
        let type = this.selecetType;
        if (type === 'aptitude') { //媒介资质
          let [data = {}] = this.aptitudeList.filter(item => item.name === val)
          this.formShow.intellName = data.name;
          this.form.intell = data.id;
          localStorage.setItem('formShow', JSON.stringify(this.formShow));
        } else if (type === 'realm') { //服务领域
          let [data = {}] = this.realmList.filter(item => item.sr_name === val)
          this.form.realm = data.id || ''
        } else if (type === 'store_cate') { //店铺分类
          let [data = {}] = this.store_cateList.filter(item => item.cat_name === val)
          this.form.class = data.cat_id || ''
        } else if (type === 'unit') { //单位
          let [data = {}] = this.unitList.filter(item => item.unit_name === val)
          this.form.unit = data.id || ''
          this.formShow.unit_name = data.unit_name || ''
          localStorage.setItem('formShow', JSON.stringify(this.formShow));
        }
        this.showPicker = false;
        this.verificationForm();
      },
      emitClose(val) {
        this.showPicker = false;
      },
      onSubmit() {
        if (this.fileVideoList.length > 0) {
          this.form.video = this.fileVideoList[0].url;
        }
        // const unlock = this.formRules.every(item => checkEmptyValue(item, this.form, (type, name) => this.$toast(errMsgList.get(name)[type])))
        // if (!unlock) return
        this.isDisabled = commonToastRegs(this.formRules, this.form, errMsgList, this);
        if (!this.isDisabled) return
        if (this.form.id) {
          this.editService();
        } else {
          this.addService();
        }
      },
      async baseInfo() {
        const data = await serviceShowAdd();
        if (!data) return
        const {aptitude, cate, realm, store_cate, unit, brand} = data;
        this.SERVICE_SHOW_ADD(data);
        this.aptitudeList = aptitude;
        this.cateList = cate;
        this.realmList = realm;
        this.store_cateList = store_cate;

        this.unitList = unit;
        this.brandList = brand;
        this.verificationForm();
        localStorage.setItem('publishServiceData', JSON.stringify(data));
        localStorage.setItem('serviceCate', JSON.stringify(cate));
      },
      async addService() {
        const data = await serviceAdd(this.form);
        if (!data) {
          this.$toast('提交失败，请重新提交');
        } else {
          if (data.code === 422) {
            this.$toast(data.message);
          } else {
            this.$toast('提交成功');
            this.$router.push({path: "/perfectService", query: {id: this.form.id || data.data.sid}});
          }
        }
      },
      async editService() {
        const data = await serviceEdit({...this.form, action: 1});
        if (!data) {
          this.$toast('提交失败，请重新提交');
          return
        }
        this.$router.push({path: "/perfectService", query: {id: this.form.id}});
      },
      async getList(id) {
        let params = {
          id,//	是	integer	服务id
          action: 1,//	是	integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性
        }
        const data = await showEdit(params);
        if (!data) return
        const {name, img, video, sort, price, market_price, stock, cate, unit, aptitude, brand, realm, store_cate, regions} = data
        // this.$router.push({path: "/perfectService"});
        const [catId = '', catName = ''] = this.catOptionCommonFun(cate)
        const [unitItem = {}] = unit.filter(item => item.checked)
        const [aptitudeItem = {}] = aptitude.filter(item => item.checked)
        this.formShow = {
          unit_name: unitItem.unit_name || '',
          intellName: aptitudeItem.name || '',
          cateName: catName,
          brandName: brand.brand_name || ''
        };
        this.form = {
          id: this.form.id,
          name: name,//	是	string	服务名称,例:山东省青岛市城阳区流亭国际机场T1航站楼LED显示屏
          cat_id: catId,//	是	string	一二三级分类类目id，逗号隔开,例:8,20,22
          realm: realm.filter(item => item.checked).map(item => item.id).toString(),//	是	string	服务领域id ,逗号隔开,例:1,2,3
          regions: regions.toString(),//	是	string	地区编码,逗号隔开,例:110000,120104,130121
          class: store_cate.filter(item => item.checked).map(item => item.cat_id).toString(),//	是	string	店铺分类id，逗号隔开,例:1,2,3
          stock: stock + '',//	是	int	库存,例:11
          unit: unitItem.id,//	是	int	服务单位id,例:1
          price: price,//	是	decimal(10,2)	售价,例:1.99或1
          market_price: market_price,//	是	decimal(10,2)	市场价,例:10.99
          img: img,//	是	string	主图,例:uploads/images/201909/03/201909031021073155.jpg
          sort: sort,//	是	int	排序,例:1

          brand: brand.id,//	否	string	品牌数据id ,逗号隔开,例:1,2,3
          video: video,//	否	string	服务视频url,例:uploads/images/201909/03/201909031021073155.mp4
          intell: aptitudeItem.id,//	否	int	服务媒介资质id,例:1
        };
        this.fileLists = [{url: img}];
        this.fileVideoList = video ? [{url: video}] : [];
        // localStorage.setItem('serviceCate', JSON.stringify(cate));
      },
      catOptionCommonFun(cate = []) {
        let item = []
        let subItem = []
        let onevalue = ''
        let twovalue = ''
        let threevalue = ''
        let oneCatename = ''
        let twoCatename = ''
        let threeCatename = ''
        const catOption = []
        for (let i = 0; i < cate.length; i++) {
          if (cate[i].checked === 1) { // 找出选中一级的id
            catOption.push(cate[i].id)
            onevalue = cate[i].id
            oneCatename = cate[i].cate_name
            item = cate[i].child
            for (let j = 0; j < item.length; j++) {
              if (item[j].checked === 1) { // 找出选中二级的id
                catOption.push(item[j].id)
                twovalue = item[j].id
                twoCatename = item[j].cate_name
                subItem = item[j].child
                for (let k = 0; k < subItem.length; k++) {
                  if (subItem[k].checked === 1) { // 找出选中三级的id
                    catOption.push(subItem[k].id)
                    threevalue = subItem[k].id
                    threeCatename = subItem[k].cate_name
                    break
                  }
                }
              }
            }
          }
        }
        const objer = {
          one: onevalue,
          two: twovalue,
          three: threevalue
        }
        const catId = onevalue + ',' + twovalue + ',' + threevalue
        const catName = oneCatename + '>' + twoCatename + '>' + threeCatename
        // return [catOption, objer, catId]
        return [catId, catName]
      },
    },
    watch: {
      fileLists(val) {
        const [img = {}] = this.fileLists;
        this.form.img = img.url || '';
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
