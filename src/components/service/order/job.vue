<template>
  <div class="order-job">
    <p>验收文件（{{whoCanDown}}可以直接查看或下载）</p>
    <div class="file-box">
      <div class="file-items" v-for="item in acceptFiles" :key="item.id" @click="viewFile(item.file_path, item.file_name, item.id)">
        <img src="@/assets/service/file.png" class="file-icon" />
        <p class="van-ellipsis name-box"><span>{{item.file_name}}</span> </p>
        <p>{{item.created_at}}</p>
        <van-icon :name="canDel" color="#999" @click.stop="delFile(item)" />
      </div>
      <p class="no-files" v-if="acceptFiles.length <= 0">文件柜是空的，{{saidForSer}}还未上传任何文件</p>
    </div>
    <jobUpload v-if="[4,5].includes(orderInfo.order_status) && role === 1" :type="1" @update="$emit('update')"></jobUpload>
    <p class="job-tip">源文件（{{whoCanDown}}验收通过后可下载）</p>
    <div class="file-box">
      <div class="file-items" v-for="item in sourceFiles" :key="item.id" @click="viewFile(item.file_path, item.file_name, item.id)">
        <img src="@/assets/service/file.png" class="file-icon" />
        <p class="van-ellipsis name-box"><span>{{item.file_name}}</span></p>
        <p>{{item.created_at}}</p>
        <van-icon :name="canDel" color="#999" @click.stop="delFile(item)" />
      </div>
      <p class="no-files" v-if="sourceFiles.length <= 0">文件柜是空的，{{saidForSer}}还未上传任何文件</p>
    </div>
    <jobUpload v-if="[4,5].includes(orderInfo.order_status) && role === 1" :type="2" @update="$emit('update')"></jobUpload>
    <div class="stage-tip" v-if="phaseData && phaseData.length>0 && orderInfo.order_status >= 4">
      <template v-if="phaseData.payOrderStage">
        <p>当前项目阶段“<span>{{phaseData.payOrderStage.name}}</span>”，已验收付款<span>{{payedStage}}</span>个，剩余<span>{{phaseData.orderStageList.length - payedStage}}</span>个。</p>
        <p>具体内容及交付成果：需求沟通及投放方案制定</p>
        <p>工期：{{phaseData.payOrderStage.days}}天 付款金额：<span>￥{{phaseData.payOrderStage.moneys}}</span></p>
      </template>
      <p v-if="phaseData.orderStageList.length - payedStage === 0 && orderInfo.order_status >= 5 && ![8,9].includes(orderInfo.order_status)">
        {{role === 2 ? '您' : '雇主' }}已完成所有项目阶段的验收付款。
      </p>
    </div>
    <p class="oth-tip" v-if="orderInfo.order_status >= 4">工作出现问题，您可以联系<span><a style="color:#0066cc" href="https://url.cn/59IhwSe?_type=wpa&qidian=true" target="_blank">官方客服</a></span>进行维权</p>
    <span class="contract-btn" :class="{'dis-btn':role === 2 ? orderInfo.order_status !== 5 : ![4,5].includes(orderInfo.order_status)}" v-if="orderInfo.order_status <= 5" @click="gotoNext()">{{btnText}}验收付款</span>

  </div>
</template>

<script>
import jobUpload from './jobUpload'
import { downloadMixin } from '@/utils/mixins'
import { regDaqo } from '@/utils/tool'
import { ImagePreview } from '@/components/nvan'
import { delFile } from '@/api/service'

export default {
  name: 'orderJob',
  // role 1 服务商 2雇主
  props: ['role', 'orderInfo', 'phaseData'],
  mixins: [downloadMixin()],
  data () {
    return {
    }
  },
  computed: {
    whoCanDown () {
      // 称呼谁可以下载
      return this.role === 1 ? '雇主' : '您'
    },
    saidForSer () {
      // 对服务商的称呼
      return this.role === 1 ? '您' : '服务商'
    },
    canDel () {
      // 显示删除图标
      return this.role === 1 && this.orderInfo.order_status <= 5 ? 'cross' : 'arrow'
    },
    btnText () {
      return this.role === 1 ? '申请' : '确认'
    },
    payedStage () {
      if (this.phaseData) {
        return this.phaseData.orderStageList.filter(item => item.status === 1).length
      } else {
        return 0
      }
    },
    acceptFiles () {
      return this.orderInfo.workFiles.filter(item => item.type === 1)
    },
    sourceFiles () {
      return this.orderInfo.workFiles.filter(item => item.type === 2)
    }
  },
  components: {
    jobUpload
  },
  methods: {
    gotoNext () {
      if (this.role === 1 && ![4, 5].includes(this.orderInfo.order_status)) return
      if (this.role === 1 && this.acceptFiles.length == 0) {
        this.$toast('请先上传验收文件')
        return
      }
      if (this.role === 2 && this.orderInfo.order_status !== 5) return
      this.$router.push({
        path: '/serviceStage',
        query: {
          sn: this.orderInfo.order_sn,
          role: this.role
        }
      })
    },
    async viewFile (path, name, id) {
      if (regDaqo.image.test(path)) {
        const url = await this.getFileForId(id)
        ImagePreview({
          images: [url]
        })
      } else {
        this.download(path, name, id)
      }
    },
    delFile (item) {
      this.$dialog
        .confirm({
          message: `确定移除附件${item.file_name}？`
        })
        .then(async () => {
          const data = await delFile(item.id)
          if (!data) return
          this.$toast('删除成功')
          this.$emit('update')
        })
    }
  }
}
</script>

<style scoped lang="scss">
/* 工作 */
.order-job {
  .job-tip {
    margin-top: 20px;
  }
  .file-box {
    height: 280px;
    background: #fff;
    @include round(4px);
    border: 1px solid #ddd;
    margin-top: 10px;
    padding: 27px 30px;
    overflow-y: auto;
    @include borderBox;
    .file-items {
      @include flex;
      color:#999;
      margin-bottom: 23px;
      &:last-child {
        margin-bottom: 0;
      }
      .file-icon {
        @include square(40);
        margin-right: 20px;
      }
      p {
        font-size: 22px;
        font-family: $font;
        font-weight: 400;
        margin-right:20px;
        &.name-box {
          flex: 1;
        }
        span {
          margin-right: 10px;
          color: #0066cc;
        }
      }
    }
    .no-files {
      width: 100%;
      height: 100%;
      @include flex(center);
      font-size: 22px;
      font-family: $font;
      font-weight: 400;
      color: #999;
    }
  }
  .stage-tip,
  .oth-tip {
    color: #666;
    font-size: 24px;
    font-family: $font;
    font-weight: 400;
    margin-top: 10px;
  }
  .stage-tip {
    padding: 12px 10px;
    background: #fff8f8;
    line-height: 33px;
    span {
      color: $red;
    }
  }
  .oth-tip {
    span, a {
      color: #0066cc;
    }
  }
}
</style>
