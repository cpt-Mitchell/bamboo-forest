<template>
  <div class="card">
    <div class="card-header">
      <mu-row>
        <mu-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：上下班异常报到</span>
        </mu-col>
      </mu-row>
    </div>
    <div class="card-part">
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>姓名</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.userName}}({{approve.position}})</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>林场名称</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.orgName}}</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>定点地址</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.address}}</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>时段</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.period}}</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>日期</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.dtDate}}</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>定点时间</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.locateTime}}</label>
          </div>
        </mu-col>
      </mu-row>
      <mu-row class="info-row">
        <mu-col span="8" class="label-header">
          <span>理由</span>
        </mu-col>
        <mu-col span="16" class="label-content">
          <div>
            <label>{{approve.reason}}</label>
          </div>
        </mu-col>
      </mu-row>
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
