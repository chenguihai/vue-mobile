<template>
  <div class="container">
    <head-nav title="选择分类"></head-nav>
    <div class="three_wrap">
      <!--二级类目-->
      <ul class="left">
        <li :class="['left_item',item.id === selectTwoId?'active':'']" v-for="(item,index) in twoCate" :key="item.id"
            @click="clickTwoCate(index,item.id)">
          {{item.cate_name}}
        </li>
      </ul>
      <!--三级类目-->
      <ul class="right">
        <li class="right_item" v-for="(item,index) in threeCate" :key="item.id" @click="clickThreeCate(index,item.id)">
          <i
            :class="['circle',item.id === selectThreeId ? 'active':'']"></i><span>{{item.cate_name}}</span>
        </li>
      </ul>
    </div>
    <fixed-btn name="保存" @submit="onSubmit"></fixed-btn>
  </div>
</template>

<script>
    import FixedBtn from "@/components/common/FixedBtn";

    export default {
        name: "ChoiceCatethree",
        components: {FixedBtn},
        data() {
            return {
                selectTwo: 0,
                selectThree: 0,
                selectTwoId: 0,
                selectThreeId: 0,
                selectId: 0,
                oneCate: [],
                twoCate: [],
                threeCate: []
            }
        },
        created() {
            let {index = 0, id = ''} = this.$route.query;
            const [one, two = 0, three = 0] = id.split(',')
            this.selectTwoId = +two || 0;
            this.selectThreeId = +three || 0;
            let serviceCate = localStorage.getItem('serviceCate'), data = [];
            if (serviceCate) {
                data = JSON.parse(serviceCate)[index];
                this.selectId = data.id;
                this.oneCate = data;
                this.twoCate = data.child;
                for (let i = 0; i < data.child.length; i++) {
                    if (data.child[i].id === this.selectTwoId) {
                        this.selectTwo = i;
                        break;
                    }
                }
                this.threeCate = data.child[this.selectTwo].child;
            }
        },
        methods: {
            onSubmit() {
                let {id, cate_name} = this.twoCate[this.selectTwo];
                let three = this.threeCate[this.selectThree];
                let cateName = `${this.oneCate.cate_name}>${cate_name}>${three.cate_name}`;
                let formShow = localStorage.getItem('formShow');
                if(formShow){
                    let data = JSON.parse(formShow);
                    localStorage.setItem('formShow',JSON.stringify({...data,cateName}));
                }
                this.$router.push({path: "/publishService", query: {cat_id: `${this.selectId},${id},${three.id}`}});
            },
            clickTwoCate(index, id) {
                // if (index === this.selectTwo) {
                //     return
                // }
                this.selectTwo = index;
                this.selectTwoId = id;
                this.selectThree = 0;
                // this.selectThreeId = 0;
                this.threeCate = this.twoCate[index].child;
            },
            clickThreeCate(index, id) {
                // if (index === this.selectThree) {
                //     return
                // }
                this.selectThree = index;
                this.selectThreeId = id;
            }
        }
    }
</script>

<style scoped lang="scss">
  .three_wrap {
    display: flex;
    height: calc(100vh - 98px);

    .left {
      width: 200px;
      background: $c_bg;
      overflow-y: auto;

      .left_item {
        font-size: 26px;
        line-height: 90px;
        color: $black;
        text-align: center;

        &.active {
          background: $white;
          position: relative;

          &:before {
            position: absolute;
            content: '';
            left: $w_10;
            top: 34px;
            z-index: 10;
            width: 6px;
            height: 24px;
            background: $red;
          }
        }
      }

    }

    .right {
      flex: 1;
      overflow-y: auto;

      .right_item {
        font-size: 26px;
        height: 90px;
        display: flex;
        align-items: center;
        padding-left: 48px;

        &:not(:last-child) {
          border-bottom: 1px solid $c_eee;
        }
      }

      .circle {
        width: 26px;
        height: 26px;
        border: 2px solid $c_666;
        border-radius: 50%;
        margin-right: $w_20;
        position: relative;

        &.active:before {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background: $blue;
          left: 50%;
          top: 50%;
          z-index: 10;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
      }
    }
  }

</style>
