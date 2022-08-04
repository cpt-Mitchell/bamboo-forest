<template>
  <div class="check-operation-quality-approve_list" style="height: 100%;">
    <div>
      <list-items :data-list="dataList" route-name="验收区域录入表单"></list-items>
      <div v-if="dataList.length == 0 && !$store.state.isLoading">
        <p class="no-data-text">暂无记录</p>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
import ListItems from '../components/list-items'
export default {
  data() {
    return {
      dataList: []
    }
  },
  components: {
    ListItems
  },
  methods: {
    findList() {
      this.$loadingState(true, '数据加载中')
      request.get(API.DINGTALK_QUALITY_VERIFY_PEDDING_LIST + 1).then(res => {
        this.$loadingState(false)
        let errorCode = res.data.errorCode
        if (errorCode) {
          this.dataList = res.data.data || []
        }
      }).catch(err => this.$loadingState(false))
    }
  },
  mounted() {
    this.findList()
    this.$title('待验收区域')
  }
}
</script>

<style lang="less">
.check-operation-quality-approve_list {
  .mu-list-two-line .mu-item {
    height: 60px;
  }
}
</style>
