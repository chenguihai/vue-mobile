<template>
  <div class="container">
    <head-nav title="示例详情介绍"></head-nav>
    <quill-upload @chang="emitSubmit" :text="content"></quill-upload>
    <fixed-btn name="保存" :fixed="0" @submit="saveSubmit"></fixed-btn>
  </div>
</template>

<script>
    import QuillUpload from "@/components/common/QuillUpload";
    import FixedBtn from "@/components/common/FixedBtn";

    export default {
        name: "exampleIntroduce",
        components: {QuillUpload, FixedBtn},
        data() {
            return {
                value: '',
                content: '',
                exampleData: ''
            }
        },
        created() {
            let params = localStorage.getItem('publishExample');
            if (params) {
                let data = JSON.parse(params);
                this.content = data.desc;
                this.exampleData = data;
            }
        },
        methods: {
            emitSubmit(value) {
                this.value = value;
            },
            saveSubmit() {
                // let params = localStorage.getItem('publishExample');
                if (this.exampleData) {
                    let data = JSON.parse(JSON.stringify(this.exampleData));
                    data.desc = this.value;
                  localStorage.setItem('publishExample', JSON.stringify(data));
                }
                this.$router.push({path: "/publishExample"});
            },
        }
    }
</script>

<style scoped>

</style>
