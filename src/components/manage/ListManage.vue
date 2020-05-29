<template>
  <div class="service_item">
    <div class="top_wrap" @click="handleService('edit')">
      <div class="clearFix">
        <van-image class="logo" :src="itemData.img+'?x-oss-process=image/resize,m_fill,h_150,w_250'" :noOss="false"
                   :lazy-load="true"></van-image>
        <h4 class="name">{{itemData.name}}</h4>
        <p class="cate">{{itemData.cate_name}}</p>
        <p class="price">￥{{itemData.price}}/{{itemData.unit_name}}</p>
      </div>
      <div class="reason" v-if="itemData.reason"><span>未通过原因：</span><span class="reason_text">{{itemData.reason}}</span>
      </div>
    </div>
    <div class="btn_wrap" :key="selectIndex">
      <van-button plain class="btn"
                  @click="handleService('edit')">编辑
      </van-button>
      <van-button v-if="itemData.status === 1 && itemData.shelf_status ===1" plain class="btn"
                  @click="handleService('shelf',0)">下架
      </van-button>
      <van-button plain class="btn active" v-if="itemData.status === 1 && itemData.shelf_status ===0"
                  @click="handleService('shelf',1)">上架
      </van-button>
      <van-button v-if="itemData.status === 1 && itemData.shelf_status === 1" plain class="btn active"
                  @click="handleService('set')">设置
      </van-button>
      <van-button plain class="btn active" @click="handleService('delete')">删除</van-button>
    </div>
    <!--弹出框-->
    <bottom-popup name="确定" title="设置" v-if="showFlag" :list="setList" @submit="onSubmit" type="service"
                  @close="onClose"/>
  </div>
</template>

<script>
  import BottomPopup from "@/components/common/BottomPopup";
  import {serviceShelf, serviceDelete, serviceLabel} from '@/api/serviceManage'

  export default {
    name: "ListManage",
    components: {BottomPopup},
    props: {
      item: {
        type: Object,
        reqirue: true
      },
      index: {
        type: Number,
        reqirue: true
      }
    },
    data() {
      const {hot_status = 0, qua_status = 0, new_status = 0} = this.item;
      return {
        showFlag: false,
        itemData: this.item,
        selectIndex: this.index,
        form: {
          id: this.item.id + '',//	是	integer	服务id,多个值用逗号隔开
          status: '',//	是	integer	上架状态:0下架，1上架
        },
        setList: [
          {name: '热门', checked: hot_status, type: 'hot_status'},
          {name: '精品', checked: qua_status, type: 'qua_status'},
          {name: '新品', checked: new_status, type: 'new_status'},
        ],
        labelForm: {
          id: this.item.id + '',//	是	integer	服务id,多个值用逗号隔开
          hot_status: hot_status,//	否	integer	店内热门状态:0关闭，1开启
          qua_status: qua_status,//	否	integer	店内精品状态:0关闭，1开启
          new_status: new_status,//	否	integer	店内新品状态:0关闭，1开启
        }
      }
    },
    created() {
      // console.log('created', this.selectIndex)
    },
    methods: {
      handleService(type, value) {
        if (type === 'shelf') {
          this.form.status = value
          this.handleShelf();
        } else if (type === 'delete') {
          this.delete();
        } else if (type === 'set') {
          this.showFlag = true
        } else if (type === 'edit') {
          this.$router.push({path: '/publishService', query: {id: this.itemData.id}})
        }

      },
      onSubmit(value) {
        let item = {};
        for (let i = 0; i < value.length; i++) {
          item[value[i].type] = value[i].checked ? 1 : 0;
        }
        this.setlabel(item);
      },
      onClose() {
        this.showFlag = false;
      },
      async handleShelf() {
        const data = await serviceShelf(this.form)
        if (!data) return
        this.$emit('refresh')
      },
      async delete() {
        let params = {id: this.itemData.id + ''}
        const data = await serviceDelete(params);
        if (!data) return
        this.$emit('refresh')
      },
      async setlabel(param) {
        let params = {...this.labelForm, ...param}
        const data = await serviceLabel(params);
        if (!data) return
        this.showFlag = false
        this.$emit('refresh')
      }
    }
  }
</script>

<style scoped lang="scss">
  .service_item {
    padding: 0 $w_30;
    margin: $w_20 0;
    background: $white;
    border-radius: $w_20;

    .top_wrap {
      padding: $w_20 0;
      border-bottom: 1px solid $c_eee;

      .logo {
        float: left;
        width: 250px;
        height: 150px;
        margin-right: $w_20;
      }

      .name {
        height: 66px;
        line-height: 33px;
        font-size: 24px;
        @include ellipsis(2);
      }

      .cate {
        @include height(30px);
        font-size: 22px;
        color: $c_999;
        margin: $w_10 0;
        @include ellipsis();
      }

      .price {
        @include height(33px);
        font-size: 24px;
        font-weight: 500;
        color: $price;
      }
    }

    .reason {
      line-height: 30px;
      font-size: 22px;
      color: $c_999;
      margin-top: 10px;
    }

    .reason_text {
      color: $c_666;
    }
  }

  .btn_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 90px;

    .btn {
      margin-left: $w_20;
      width: 135px;
      height: 50px;
      font-size: 24px;
      border-radius: 25px;
      text-align: center;
      line-height: 50px;
      color: $c_666;
      background: $white;
      border: 1px solid $c_ccc;
    }

    .active {
      color: $red;
      background: $white;
      border: 1px solid $red;
    }
  }
</style>
