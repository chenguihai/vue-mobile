<template>
  <div class="container">
    <head-nav :title="titles"></head-nav>
    <quill-upload @chang="emitSubmit" :text="content"></quill-upload>
    <fixed-btn name="保存" :fixed="0" @submit="saveSubmit"></fixed-btn>
  </div>
</template>

<script>
    import QuillUpload from "@/components/common/QuillUpload";
    import FixedBtn from "@/components/common/FixedBtn";
    import {serviceEdit} from '@/api/serviceManage'

    export default {
        name: "serviceIntroduce",
        components: {QuillUpload, FixedBtn},
        data() {
            return {
                form: {
                    action: 2,//	是	integer	编辑页面: 1基础信息,2详细介绍,3图库,4规格属性
                    id: '',//	是	integer	服务id
                    pc: '',//	是	string	服务PC详情
                    // keywords: '',//	否	string	关键词
                    // desc: '',//	否	string	简单描述
                    case: '',//	否	string	相关案例介绍
                    biography: '',//	否	string	相关传记介绍
                },
                afferentType: '',
                content: '',
                titles: '',
            }
        },
        created() {
            let {id = 0, type = ''} = this.$route.query;
            this.form.id = +id;
            this.afferentType = type;
            let serviceData = localStorage.getItem('serviceData');
            let serviceInfo = {};
            if (serviceData) {
                serviceInfo = JSON.parse(serviceData).service_info;
            }
            const {pc = '', biography = ''} = serviceInfo;
            if (type === 'pc') {
                this.content = pc;
                this.titles = '详细描述';
            } else if (type === 'biography') {
                this.content = biography;
                this.titles = '相关传记介绍';
            } else {
                this.content = serviceInfo.case;
                this.titles = '相关案例介绍';
            }
            this.form.pc = pc;
            this.form.case = serviceInfo.case;
            this.form.biography = biography;
        },
        methods: {
            saveSubmit() {
                if (this.afferentType) {
                    this.editService();
                } else {
                    this.$router.push({path: "/perfectService", query: {id: this.form.id}});
                }
            },
            emitSubmit(value) {
                let type = this.afferentType;
                if (type === 'pc') {
                    this.form.pc = value;
                } else if (type === 'biography') {
                    this.form.biography = value;
                } else {
                    this.form.case = value;
                }
            },
            async editService() {
                const data = await serviceEdit(this.form);
                if (!data) return
                this.$router.push({path: "/perfectService", query: {id: this.form.id}});
            },
        }
    }
</script>

<style scoped lang="scss">
</style>
