<template>
  <div class="container bg">
    <head-nav title="选择品牌"></head-nav>
    <div class="brand_wrap" v-if="brandList.length > 0">
      <van-index-bar :index-list="indexList" highlight-color="#f3262d">
        <div v-for="(item,index) in brandList" :key="index">
          <van-index-anchor :index="item.letter">{{item.letter}}</van-index-anchor>
          <ul class="brand_ul">
            <!--            subItem.checked-->
            <li :class="['brand_item',selectId === subItem.id  ?'active':'']" v-for="(subItem,subIndex) in item.list"
                :key="subIndex" @click="clickBrand(subItem.id,subItem.brand_name)">
              <!--              index,subIndex-->
              <van-image class="logo" :noOss="false" :src="subItem.brand_logo" lazy-load/>
              <i class="mark"></i>
            </li>
          </ul>
        </div>
      </van-index-bar>
    </div>
    <no-data v-else></no-data>
    <fixed-btn name="确认" :fixed="0" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
    import FixedBtn from "@/components/common/FixedBtn";
    import {serviceBrand} from '@/api/serviceManage'
    import NoData from "@/components/noData";

    export default {
        name: "selectBrand",
        components: {FixedBtn, NoData},
        data() {
            return {
                indexList: [],
                form: {
                    one: '',//	是	integer	一级分类id
                    two: '',//	是	integer	二级分类id
                    three: '',//是	integer	三级分类id
                },
                brandList: [],
                selectId: 0,
                currentId: 0,
                selectName: '',
                oldOne: 0,
                oldTwo: -1,
            }
        },
        created() {
            let {id = '', brandId = ''} = this.$route.query;
            this.currentId = +brandId;
            this.selectId = +brandId;
            const [one = 0, two = 0, three = 0] = id.split(',');
            if (three) {
                this.form = {
                    one: one,//	是	integer	一级分类id
                    two: two,//	是	integer	二级分类id
                    three: three,//是	integer	三级分类id
                }
                this.getBrand();
            }
        },
        methods: {
            onSubmit() {
                // let data = [], itemList = this.brandList, params = '';
                // for (let i = 0; i < itemList.length; i++) {
                //     data = data.concat(itemList[i].list.filter(item => item.checked));
                // }
                // if (data.length > 0) {
                //     params = data.map(item => item.id).toString();
                // }
                // this.$router.push({path: "/publishService", query: {brand: params}});
                if (this.selectId === 0 || this.currentId === this.selectId) {
                    this.$router.push({path: "/publishService"});
                } else {
                // , brandName: this.selectName
                    let formShow = localStorage.getItem('formShow');
                    if(formShow){
                        let data = JSON.parse(formShow)
                        localStorage.setItem('formShow',JSON.stringify({...data,brandName:this.selectName}));
                    }
                    this.$router.push({
                        path: "/publishService",
                        query: {brand: this.selectId}
                    });

                }
            },
            // clickBrand(index, subIndex) {
            clickBrand(id, name) {
                console.log(id, name)
                this.selectId = id;
                this.selectName = name;
                // if (this.oldTwo > -1) {
                //     let oldData = this.brandList[this.oldOne];
                //     oldData.list[this.oldTwo].checked = !oldData.list[this.oldTwo].checked;
                //     this.$set(this.brandList, this.oldOne, oldData);
                // }
                //
                // let data = this.brandList[index];
                // data.list[subIndex].checked = !data.list[subIndex].checked;
                // this.oldOne = index;
                // this.oldTwo = subIndex;
                // this.$set(this.brandList, index, data);
            },
            async getBrand() {
                const data = await serviceBrand(this.form);
                if (!data) return
                let indexList = [], dataArr = [], brandList = [], itemObj = {};
                for (var key in data) {
                    indexList = indexList.concat(Array.from(new Set(data[key].map(item => item.first_letter))));
                    dataArr = dataArr.concat(data[key])
                }
                indexList = indexList.sort();
                for (let i = 0; i < indexList.length; i++) {
                    itemObj = {
                        letter: indexList[i],
                        list: []
                    };
                    for (let j = 0; j < dataArr.length; j++) {
                        if (indexList[i] === dataArr[j].first_letter) {
                            if (this.selectId === dataArr[j].id) {
                                dataArr[j].checked = true;
                            }
                            itemObj.list.push(dataArr[j]);
                        }
                    }
                    brandList.push(itemObj)
                }
                this.indexList = indexList;
                this.brandList = brandList;
                console.log(JSON.parse(JSON.stringify(brandList)))
            }
        }
    }
</script>

<style scoped lang="scss">
  .brand_wrap {
    padding-bottom: 98px;
  }

  .brand_ul {
    display: flex;
    flex-wrap: wrap;
    padding: $w_20 25px 0;
    background: $white;

    .brand_item {
      margin: 0 5px $w_20;
      width: 130px;
      height: 58px;
      overflow: hidden;
      border: 1px solid transparent;

      &.active {
        border-color: $red;
        position: relative;

        .mark {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 10;
          width: 26px;
          height: 26px;
          background: url("/static/images/bottom_hook.png") no-repeat center;
          background-size: 26px 26px;
        }
      }

      .logo {
        width: 130px;
        height: 58px;
      }
    }
  }

</style>
<style lang="scss">
  .brand_wrap {
    .van-index-anchor {
      height: rem(40);
      line-height: rem(40);
      font-size: rem(30);
      background: $c_bg;
    }
  }


</style>
