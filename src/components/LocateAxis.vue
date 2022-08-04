<template>
  <div style="padding:0 .42rem;">
    <p style="font-size:.36rem;padding:10px 0px 5px;margin:0;">{{title || ''}}</p>
    <div class="step-items">
      <div class="axis-line"></div>
      <div v-for="(step,index) in todo" :key="index" class="step-item">
        <van-row style="display:flex;align-items:center;">
          <van-col span="14">
            <span class="header-title" :class="{'actived': index == todo.length - 1 }">{{step}}</span>
          </van-col>
          <van-col span="10" v-if="todoTime[index]" style="text-align:right;">
            <span :class="{'actived': index == todo.length - 1 }">时间：{{todoTime[index]}}</span>
          </van-col>
        </van-row>
        <van-row>
          <van-col span="24" v-if="position.address&&index==todo.length-1">
            <span class="todo-label">{{position.address}}</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    position: {
      type: Object,
      required: true
    },
    todoTime: {
      type: Array,
      default: function () {
        return []
      }
    },
    title: {
      type: String,
      required: true
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
    top: 0.48rem;
  }

  .step-item {
    &:not(first-child) {
      margin-top: 10px;
    }

    .todo-label {
      font-size: 0.36rem;
      line-height: 0.72rem;
      line-height: 1.5;
    }

    .header-title {
      color: #000;
      position: relative;
      top: -3px;
      &::before {
        content: ' ';
        border-radius: 50%;
        height: 7px;
        width: 7px;
        background: #999;
        display: block;
        position: relative;
        left: -0.58rem;
        top: 16px;
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
