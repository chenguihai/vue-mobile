<template>
  <div class="contain bg">
    <head-nav title="客户合作示例管理"></head-nav>
    <div class="service_list">
      <listBox :refreshLoading.sync="isLoading" :listLoading.sync="listLoading" :dataArr="dataArr" :dataObj="dataObj"
               @load="loadData">
        <example-item :item="item" v-for="(item,index) in dataArr" :index="index" :key="item.id"
                      @refresh="handleRefresh"></example-item>
      </listBox>
    </div>
    <fixed-btn name="发布客户示例" :fixed="0" @submit="handleSubmit"/>
    <upBack/>
  </div>
</template>

<script>
    import listBox from '@/components/service/listBox'
    import ExampleItem from "./components/exampleItem";
    import FixedBtn from "@/components/common/FixedBtn";
    import {caseList} from '@/api/customer'
    import upBack from "@/components/service/upBack";

    export default {
        name: "exampleManage",
        components: {ExampleItem, listBox, FixedBtn, upBack},
        data() {
            return {
                listLoading: false,
                isLoading: false,
                error: false,
                dataArr: [],
                dataObj: {},
            }
        },
        created() {
          localStorage.removeItem("publishExample");
            localStorage.removeItem("formShow");
        },
        methods: {
            handleSubmit() {
                this.$router.push({path: "/publishExample"});
            },
            handleRefresh(type, value) {
                const {is_added = 0, index = 0} = value;
                let data = this.dataArr[index];
                if (type === 'shelf') {
                    data.is_added = is_added;
                    this.$set(this.dataArr, index, data);
                } else if (type === 'delete') {
                    this.getData(1);
                }
            },
            async loadData(page) {
                page === 1 ? await this.onRefresh() : await this.getData(page)
            },
            async onRefresh() {
                await this.getData(1)
                this.isLoading = false
            },
            async getData(page) {
                this.listLoading = true
                const data = await caseList(page)
                this.listLoading = false
                if (!data) return
                this.dataObj = {
                    current_page: data.current_page,
                    total: data.total,
                    per_page: data.per_page
                }
                this.dataArr = page === 1 ? data.data : [...this.dataArr, ...data.data]
            }
        },
    }
</script>

<style scoped lang="scss">

</style>
