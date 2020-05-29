<template>
  <van-popup v-model="showFlag" round position="bottom"
             @close="onClose" :style="{ height: 'auto' }">
    <div class="bottom_popup">
      <h4 class="title">{{titles}}</h4>
      <ul class="attr_ul">
        <li :class="['attr_li',(item.checked || selectIndex === index || selectId === item.id)?'active':'']"
            v-for="(item,index) in listData"
            :key="index"
            @click="clickType(index)">
          {{item.name || item.sr_name}}<i
          class="hookIcon"></i></li>
      </ul>
      <i class="deleteIcon" @click="onClose"></i>
    </div>
    <fixed-btn :name="btnNames" :fixed="3" @submit="onSubmit"></fixed-btn>
  </van-popup>
</template>

<script>
    import FixedBtn from "@/components/common/FixedBtn";

    export default {
        name: "BottomPopup",
        components: {FixedBtn},
        props: {
            name: {
                type: String,
                default: '保存'
            },
            flag: {
                type: Boolean,
                reqirue: false
            },
            list: {
                type: Array,
                reqirue: true
            },
            title: {
                type: String,
                default: '素材类型'
            },
            id: {
                type: Number,
                default: 0
            },
            type: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                showFlag: true,
                btnNames: this.name,
                listData: this.list,
                originalData: JSON.parse(JSON.stringify(this.list)),
                titles: this.title,
                selectType: this.type,
                selectIndex: -1,
                selectId: this.id
            }
        },
        created() {
                  // console.log(this.originalData)
        },
        methods: {
            onSubmit() {
                if (this.titles === '客户领域') {
                    let data = this.listData[this.selectIndex];
                    this.$emit('submit', {id: data.id, name: data.sr_name})
                } else if (this.selectType === 'service') {
                    this.$emit('submit', this.listData)
                } else {
                    let data = this.listData.filter(item => item.checked).map(item => item.name)
                    this.$emit('submit', data)
                }
            },
            onClose() {
              if (this.selectType === 'service') {
                let item = this.originalData;
              for(let i=0;i<item.length;i++){
                    this.$set(this.listData, i, item[i]);
              }
              }
                this.$emit('close');
            },
            clickType(index) {
                if (this.titles === '客户领域') {
                    this.selectIndex = index;
                    this.selectId = this.listData[index];
                } else {
                    let data = JSON.parse(JSON.stringify(this.listData[index]));
                    data.checked = +!data.checked;
                    this.$set(this.listData, index, data);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
  .bottom_popup {
    position: relative;

    .titlea {
      @include height(37px);
      font-size: 26px;
    }

    .attr_uls {
      display: flex;
      flex-wrap: wrap;
      font-size: 24px;
      padding: 56px 0 90px;

      .attr_li {
        width: 200px;
        height: 58px;
        border-radius: 4px;
        @include height(56px);
        background: $c_bg;
        border: 1px solid $c_bg;
        margin-top: 14px;

        &:not(:nth-child(3n+3)) {
          margin-right: 40px;
        }


      }

      .active {
        border-color: $red;
        background-color: #0f0;
        color: $red;
      }

    }

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

</style>
