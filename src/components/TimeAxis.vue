<template>
  <div style="padding:0 .42rem;">
    <p>{{title || ''}}</p>
    <div class="step-items">
      <div class="axis-line"></div>
      <div class="step-item" v-if="todo.length == 0">
        <van-row>
          <van-col span="24">
            <span class="actived header-title">{{enterOrLeaveNode.enter}}</span>
          </van-col>
        </van-row>
      </div>
      <div v-for="step in todo" :key="step.ID" class="step-item">
        <van-row>
          <van-col span="12" v-if="!step['操作']">
            <!-- :class="{'actived': step ==5 }" -->
            <span class="header-title">{{enterOrLeaveNode.enter}}</span>
          </van-col>
          <van-col span="12" v-if="step['操作']">
            <!-- :class="{'actived': step ==5 }" -->
            <span class="header-title">{{step['操作']}}</span>
          </van-col>
        </van-row>
        <van-row class="m-step" v-if="step['地址']">
          <van-col span="12">
            <span class="todo-label">{{step['地址']}}</span>
          </van-col>
        </van-row>
        <van-row class="m-step" v-if="step['录入时间']">
          <van-col span="12">
            <span class="todo-label">{{step['录入时间']}}</span>
          </van-col>
        </van-row>
      </div>
      <div class="step-item" v-if="nodeLength !== 0 &&todo.length == (nodeLength - 1)">
        <van-row>
          <van-col span="12">
            <span
              class="actived header-title"
            >{{enterOrLeaveNode.leave +(todo[0]?(todo[0].title||''): '')}}</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nodeLength: {
      type: Number,
      default: function () {
        return 0
      }
    },
    enterOrLeaveNode: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    step: {
      type: Object,
      default: function () {
        return {}
      }
    },
    todo: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.step-items {
  padding: 0 0.5rem;
  position: relative;

  .axis-line {
    border-left: 1px solid #999;
    height: calc(100% - 25px);
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0.32rem;
  }

  .step-item {
    &:not(first-child) {
      margin-top: 20px;
    }

    .todo-label {
      font-size: 0.36rem;
      line-height: 0.72rem;
      line-height: 1.5;
    }

    .header-title {
      color: #000;

      &::before {
        content: ' ';
        border-radius: 50%;
        height: 7px;
        width: 7px;
        background: #999;
        display: block;
        position: absolute;
        left: -0.58rem;
        top: 10px;
      }

      &.actived {
        color: #0588ff;

        &::before {
          background: #0588ff;
        }
      }
    }
  }
}
</style>
