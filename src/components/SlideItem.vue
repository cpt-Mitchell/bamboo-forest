<template>
  <div class="container">
    <div class="list-item" data-type="0" :class="{'is-last-item':isLast}">
      <div
        class="list-box"
        @touchstart.capture="touchStart"
        @touchend.capture="touchEnd"
        @click="skip"
      >
        <div class="list-content">
          <slot name="content"></slot>
        </div>
      </div>
      <div class="opt" style="z-index:1000">
        <slot name="options"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlideItem',
  props: ['disableSlider', 'pathName', 'paramId', 'isLast'],
  data() {
    return {
      startX: 0,
      endX: 0
    }
  },
  methods: {
    // 跳转
    skip() {
      if (this.checkSlide()) {
        this.restSlide()
      } else {
        this.$router.push({
          name: this.pathName,
          params: {
            id: this.paramId
          }
        })
      }
    },
    // 滑动开始
    touchStart(e) {
      // 记录初始位置
      this.startX = e.touches[0].clientX
    },
    // 滑动结束
    touchEnd(e) {
      if (this.disableSlider) {
        // 当前滑动的父级元素
        let parentElement = e.currentTarget.parentElement
        // 记录结束位置
        this.endX = e.changedTouches[0].clientX
        // 左滑
        if (parentElement.dataset.type === '0' && this.startX - this.endX > 30) {
          this.restSlide()
          parentElement.dataset.type = '1'
        }
        // 右滑
        if (parentElement.dataset.type === '1' && this.startX - this.endX < -30) {
          this.restSlide()
          parentElement.dataset.type = '0'
        }
        this.startX = 0
        this.endX = 0
      }
    },
    // 判断当前是否有滑块处于滑动状态
    checkSlide() {
      let listItems = document.querySelectorAll('.list-item')
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type === '1') {
          return true
        }
      }
      console.log(12)
      return false
    },
    // 复位滑动状态
    restSlide() {
      let listItems = document.querySelectorAll('.list-item')
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = '0'
      }
    },
    // 删除
    deleteItem(e) {
      // 当前索引
      let index = e.currentTarget.dataset.index
      // 复位
      this.restSlide()
      // 删除
      this.list.splice(index, 1)
    }
  },
  mounted() {
    this.$on('resetSlide', this.restSlide)
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  overflow: hidden;
  padding: 0px;
}

.container ul {
  padding: 0px;
}

.container div {
  font-size: 14px;
}

.list-item {
  position: relative;
  height: 1.6rem;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}

.list-item[data-type='0'] {
  transform: translate3d(0, 0, 0);
}

.list-item[data-type='1'] {
  transform: translate3d(-4rem, 0, 0);
}

.list-item {
  &:not(.is-last-item) {
    &:after {
      content: ' ';
      position: absolute;
      left: 0.2rem;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #ccc;
      color: #ccc;
      -webkit-transform-origin: 0 100%;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
  }
}

.list-box {
  padding: 0.2rem 0;
  background: #fff;
  display: flex;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 0;
}

.list-item .list-img {
  display: block;
  width: 1rem;
  height: 1rem;
}

.list-item .list-content {
  padding: 0.1rem 0 0.1rem 0.1rem;
  position: relative;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
}

.list-item .title {
  display: block;
  color: #333;
  overflow: hidden;
  font-size: 15px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item .tips {
  display: block;
  overflow: hidden;
  font-size: 12px;
  color: #999;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item .time {
  display: block;
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 0.1rem;
  color: #666;
}

.list-item .opt {
  width: 4rem;
  height: 1.6rem;
  background: #ff4949;
  font-size: 17px;
  color: #fff;
  text-align: center;
  line-height: 1.6rem;
  position: absolute;
  top: 0;
  right: -4rem;
  display: block;
}

.list-item .opt div {
  line-height: 1.6rem;
}
</style>
