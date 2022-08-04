<template>
  <div class="card">
    <div class="card-header">
      <van-row>
        <van-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：夜间工作时间明细</span>
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
            <label>{{approve.userName}}</label>
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
          <span>林场名称</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.orgName}} - {{approve.lbMc}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作类型</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.workType}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作时长</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.workHours}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>开始时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.startOffTime}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>到达时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.reachTime}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>离开时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.leaveOffTime}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>回到居住点时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.backToTime}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>是否异常</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.isAbnormal}}</label>
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
