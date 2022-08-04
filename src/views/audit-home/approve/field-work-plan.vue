<template>
  <div class="card">
    <div class="card-header">
      <van-row>
        <van-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：林地工作计划</span>
        </van-col>
      </van-row>
    </div>
    <div class="card-part">
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>林班名称</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.lbName}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作日期</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.workDate}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作内容</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.workContent}}</label>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    approve: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.$title(this.$parent.formName + '申请')
  }
}
</script>

<style>
</style>
