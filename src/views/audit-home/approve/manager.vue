<template>
  <div class="card">
    <div class="card-header">
      <van-row>
        <van-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：协管记录详细内容</span>
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
            <label>{{approve.ranger}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>协管工种</span>
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
            <label>{{approve.workTimes}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>开始时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.startDate}}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>结束时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.endDate}}</label>
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
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>备注</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{approve.remark}}</label>
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
