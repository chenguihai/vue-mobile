<template>
  <div class="container">
    <head-nav title="自传资质"></head-nav>
    <div class="company_name">
      <van-cell-group>
        <van-cell :value-class="{cell_item:formShow.type}" title="资质类型" is-link :value="formShow.type ||'请选择'"
                  @click="showPopup('type')"/>
        <van-cell :value-class="{cell_item:formShow.twoType}" title="资质证书" is-link :value="formShow.twoType ||'请选择'"
                  @click="showPopup('quality')"/>
        <van-cell :value-class="{cell_item:form.received_time}" title="资质获得时间" is-link
                  :value="form.received_time ||'请选择'" @click="showTimePopup"/>
        <div class="upload_wrap">
          <h4 class="title">附件图片</h4>
          <comUpload ref="comUpload" :max="1" v-model="fileLists">
            <div slot="tips" class="need-tip">
              <!--              <p>上传图片比例最佳为5:3</p>-->
            </div>
          </comUpload>
        </div>
      </van-cell-group>
    </div>
    <fixed-btn name="保存" :fixed="1" :disabled="!isDisabled" @submit="onSubmit"></fixed-btn>
    <!--弹框选择-->
    <popup-picker v-if="pickerFlag" :list="columns" @submit="emitSubmit" @close="emitClose"></popup-picker>
    <!--开始时间-->
    <datetime-picker v-if="timeFlag" type="max" :date="currentDate" @submit="emitTimePopup"
                     @close="emitClose"></datetime-picker>
  </div>
</template>

<script>
    import PopupPicker from '@/components/common/PopupPicker'
    import FixedBtn from "@/components/common/FixedBtn";
    import comUpload from "@/components/service/comUpload";
    import DatetimePicker from "@/components/common/DatetimePicker";
    import {selfhonorGetInfo, shopHonortype, selfhonorAdd, selfhonorEdit} from '@/api/storeInfo'
    import {commonRegs,commonToastRegs} from '@/utils/tool'

    const errMsgList = new Map([
        ['honor_type_id', ['请选择证书类型']],
        ['received_time', ['请选择资质日期']],
        ['honor_img', ['请上传资质图片']],
    ])
    export default {
        name: "addCertificate",
        components: {PopupPicker, FixedBtn, comUpload, DatetimePicker},
        data() {
            return {
                pickerFlag: false,
                timeFlag: false,
                formShow: {
                    type: '',
                    twoType: ''
                },
                form: {
                    honor_type_id: '',//	是	int	获得证书类型id，读取资质证书列表
                    received_time: '',//	是	date	获得资质日期
                    honor_img: '',//	是	string	图片路径
                },
                formRules: [
                    'honor_type_id',
                    'received_time',
                    'honor_img'
                ],
                columns: [],
                fileLists: [],
                currentDate: '',
                typeList: [],
                twoTypeList: [],
                selectId: 0,
                clickType: false,
                isDisabled: false,
              imgUrl: '?x-oss-process=image/resize,m_fill,h_120,w_120'
            }
        },
        created() {
            this.shopHonortypeHttp();
            const {id = 0} = this.$route.query;
            if (id) {
                this.selectId = id;
            }
        },
        methods: {
            showTimePopup() {
                this.timeFlag = true;
                this.currentDate = this.form.received_time;
            },
            showPopup(type) {
                if (this.typeList.length === 0) {
                    return
                }
                if (type === 'type') {
                    this.pickerFlag = true;
                    this.columns = this.typeList.map(item => item.type_name);
                } else if (type === 'quality') {
                    if (this.formShow.type && this.clickType === true) { //选择资质类型，才能选择资质证书
                        this.pickerFlag = true;
                        // this.columns = this.typeList[0].children.map(item => item.type_name);
                    } else {
                        this.$toast('请先选择资质类型');
                    }
                    this.clickType === false
                }
                this.selecetType = type;
            },
            onSubmit() {
                this.pickerFlag = false;
                this.isDisabled = commonToastRegs(this.formRules,this.form,errMsgList,this);
                if (!this.isDisabled) return
                this.selectId ? this.editSelfhonor() : this.addSelfhonor();
            },
            emitSubmit(val) {
                let type = this.selecetType;
                this.emitClose();
                if (type === 'type') {
                    if (val === this.formShow.type) {
                        return
                    }
                    this.clickType = true;
                    this.formShow.type = val;
                    this.formShow.twoType = '';
                    this.form.honor_type_id = '';
                    let [child] = this.typeList.filter(item => item.type_name === val);
                    this.columns = child.children.map(item => item.type_name);
                    this.twoTypeList = child.children;
                } else if (type === 'quality') {
                    this.formShow.twoType = val;
                    let [data] = this.twoTypeList.filter(item => item.type_name === val);
                    this.form.honor_type_id = data.id;
                }
                this.isDisabled = commonRegs(this.formRules,this.form);
            },
            emitTimePopup(value) {
                this.form.received_time = value
                this.emitClose();
                this.isDisabled =commonRegs(this.formRules,this.form);
            },
            emitClose() {
                this.pickerFlag = false;
                this.timeFlag = false;
            },
            async getInfo() {
                const data = await selfhonorGetInfo(this.selectId);
                if (!data) return
                let item = [];
                this.form = {
                    honor_type_id: data.honor_type_id,//	是	int	获得证书类型id，读取资质证书列表
                    received_time: data.received_time,//	是	date	获得资质日期
                    honor_img: data.honor_img,//	是	string	图片路径
                };
                this.fileLists = [
                    {url: data.honor_img+this.imgUrl}
                ]
                for (let i = 0; i < this.typeList.length; i++) {
                    item = this.typeList[i].children;
                    for (let j = 0; j < item.length; j++) {
                        if (item[j].id === data.honor_type_id) {
                            this.formShow = {
                                type: this.typeList[i].type_name,
                                twoType: item[j].type_name
                            };
                            return false;
                        }
                    }
                }
            },
            async addSelfhonor() {
                const data = await selfhonorAdd(this.form);
                if (!data) return
                this.$router.push({path: '/certificate'})
            },
            async editSelfhonor() {
              let param = this.handleImg();
                const data = await selfhonorEdit(this.selectId, param);
                if (!data) return
                this.$router.push({path: '/certificate'})
            },
          handleImg() {
            let data = JSON.parse(JSON.stringify(this.form));
            for (let key in data) {
              if (data[key] && (data[key]+'').indexOf('?') >= 0) {
                data[key] = data[key].split('?')[0];
              }
            }
            return data;
          },
            async shopHonortypeHttp() {
                const data = await shopHonortype();
                this.getInfo();
                if (!data) return
                this.typeList = data;
            },
        },
        watch: {
            fileLists(val) {
                const [img = {}] = this.fileLists;
                this.form.honor_img = img.url || '';
                this.isDisabled = commonRegs(this.formRules,this.form);
            },
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../css/auth";
</style>
