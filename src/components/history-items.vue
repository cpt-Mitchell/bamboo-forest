<template>
  <div v-if="list" class="apv-hist">
    <template v-for="(stp,indx) in list">
      <div :key="indx" class="my-stepper" v-if="stp.datetime">
        <van-row class="m-step">
          <van-col span="2">
            <span class="done-icon">
              <svg viewBox="0 0 24 24" class="done-iocn-svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                ></path>
              </svg>
            </span>
          </van-col>
          <van-col span="14">
            <span style="color: #89cd30">{{stp.name}}【{{stp.type}}】</span>
          </van-col>
          <van-col span="8" class="time-col">
            <span>{{stp.datetime}}</span>
          </van-col>
        </van-row>
        <div class="m-cantain">
          <div class="cantain">
            <span>{{stp.content}}</span>
          </div>
        </div>
      </div>
    </template>
    <div v-if="list.length>0&&!list[list.length-1].datetime">
      <van-row class="m-step">
        <van-col span="2">
          <span class="todo-span">
            <div class="todo-icon">{{list.length}}</div>
          </span>
        </van-col>
        <van-col span="14">
          <span class="todo-label">等待审批【{{list[list.length-1].name || '未找到审批人'}}】</span>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      active: 0
    }
  },
  mounted() {
    this.active = this.list ? this.list.length : 0
  },
  methods: {}
}
</script>

<style scoped>
.apv-hist {
  margin: 10px 0px;
}

.my-stepper span {
  font-size: 13px;
}

.my-stepper .time-col {
  text-align: right;
  color: gray;
}

.done-icon {
  padding-top: 8px;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-right: 8px;
  margin-left: 2px;
  width: 18px;
}

.done-iocn-svg {
  display: block;
  font-size: 18px;
  width: 18px;
  height: 18px;
  color: #2196f3;
  fill: currentColor;
}

.m-step {
  padding: 0px 14px;
  line-height: 25px;
}

.m-cantain {
  margin-left: 25px;
  min-height: 30px;
  line-height: 18px;
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: #d2e070;
}

.m-cantain .cantain {
  padding: 0px 15px 10px 15px;
}

.todo-span {
  padding-top: 4px;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-right: 8px;
  margin-left: 2px;
  width: 18px;
}

.todo-icon {
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  overflow: hidden;
  border-radius: 100%;
  color: #fff;
  background-color: #cdbd2c;
}

.todo-label {
  color: #cdbd2c;
  font-size: 13px;
}
</style>
