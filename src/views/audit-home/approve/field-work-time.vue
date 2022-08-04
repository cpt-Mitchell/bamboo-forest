<template>
  <div class="card">
    <div class="card-header">
      <van-row>
        <van-col span="24">
          <span style="font-size: 15px;color: #1db5e6">审批类型：林班工作时间明细</span>
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
            <label>{{ approve['姓名'] }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作林班</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ approve['工作林班'] }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>进入林班时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ approve['进入林班时间'] }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>离开林班时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ approve['离开林班时间'] }}</label>
          </div>
        </van-col>
      </van-row>
      <van-row class="info-row">
        <van-col span="8" class="label-header">
          <span>工作时间</span>
        </van-col>
        <van-col span="16" class="label-content">
          <div>
            <label>{{ approve['工作时间'] }}</label>
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

<style></style>
