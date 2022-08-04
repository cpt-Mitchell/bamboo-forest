<template>
  <div class="card">
    <div class="card-header">
      <van-row>
        <van-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：巡山异常报到</span>
        </van-col>
      </van-row>
    </div>
    <div class="card-part">
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>姓名</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.userName}}({{approve.position}})</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>林场名称</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.orgName}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>巡山名称</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.patrolName}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>巡山地址</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.address}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>日期</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.dtDate}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>定点时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.locateTime}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>理由</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.reason}}</label>
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
