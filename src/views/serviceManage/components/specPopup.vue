<template>
  <van-popup v-model="show" round position="bottom" :style="{ height: 'auto' }">
    <div class="popup">
      <ul class="specs_popup">
        <li class="item" v-for="(item,index) in upList" :key="item.id">
          <h4 class="title">{{item.attr_name}}</h4>
          <ul class="specs_ul">
            <!--item.selectValue === subItem-->
            <li :class="['specs_li',selectArr[index].value ===subItem ?'active':'']"
                v-for="(subItem,subIndex) in item.input_select_val.split('|')"
                :key="subIndex" @click="clickSpecUp(index,subItem)">{{subItem}}
            </li>
          </ul>
        </li>
      </ul>
      <fixed-btn name="确定" :fixed="3" @submit="onSubmit"></fixed-btn>
      <i class="deleteIcon" @click="onClose"></i>
    </div>
  </van-popup>
</template>

<script>
    import FixedBtn from "@/components/common/FixedBtn";

    export default {
        name: "specPopup",
        components: {FixedBtn},
        props: {
            list: {
                type: Array,
                reqirue: true
            }
        },
        data() {
            return {
                show: true,
                upList: this.list,
                selectArr: new Array(this.list.length).fill({}),
                selectIndex: 0,
            }
        },
        created() {

        },
        methods: {
            clickSpecUp(index, value) {
                // val: "[{"33":"B","price":"10","m_price":"20","stock":"30","sale_attr":1},{"33":"A","price":"40","m_price":"50","stock":"60","sale_attr":1}]"
                let item = this.upList[index];
                let data = this.selectArr[index];
                let val = data.value === value ? '' : value;
                this.$set(this.selectArr, index, {key: item.id, value: val});
                this.selectIndex = index;
                this.$set(this.upList, index, item);
            },
            onSubmit() {
                let params = {}, ids = [];
                let param = this.selectArr.filter(item => item.key);
                for (let i = 0; i < param.length; i++) {
                    params[param[i].key] = param[i].value;
                    ids.push(param[i].key)
                }
                if (ids.length === 0) {
                    this.$toast('至少选择一项')
                    return
                }
                this.$emit('submit', params, ids);
            },
            onClose() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped lang="scss">
  .popup {
    position: relative;

    .deleteIcon {
      position: absolute;
      top: $w_20;
      right: $w_30;
      z-index: 10;
      width: 36px;
      height: 36px;
      background: url("/static/images/gray_delete.png") no-repeat center;
      background-size: 36px;
    }
  }

  .specs_popup {
    position: relative;
    padding: $w_30 $w_30 0;

    .item {
      padding: $w_20 0 $w_30;

      &:not(:last-child) {
        border-bottom: 1px solid $c_eee;
      }
    }

    .title {
      @include height(37px);
      font-size: 26px;
    }

    .specs_ul {
      display: flex;
      flex-wrap: wrap;
      font-size: 24px;

      .specs_li {
        width: 180px;
        @include height(56px);
        text-align: center;
        background-color: $c_bg;
        border: 1px solid $c_bg;
        color: $c_666;
        margin: $w_20 40px 0 0;

        &.active {
          background-clolor: $red_bg;
          border-color: $red;
          color: $red;
        }
      }
    }
  }

</style>
