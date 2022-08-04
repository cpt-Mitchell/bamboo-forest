<template>
  <div class="nav-bar-wrap">
    <!-- :class="{'hide-back':['/','/apps'].indexOf($route.path) !== -1}" -->
    <van-nav-bar
      :title="$route.name"
      :left-text="['/','/apps'].indexOf($route.path) !== -1 ? (($store.state.appUser?$store.state.appUser.userName:'')+'，您好！'):'返回'"
      :left-arrow="!(['/','/apps'].indexOf($route.path) !== -1)"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <a
        style="color:#0099ff"
        slot="right"
      >{{['/','/apps'].indexOf($route.path) === -1 ? '返回首页' : rightText}}</a>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    rightText: {
      type: String,
      default: ''
    },
    back: {
      type: Function
    },
    rightClick: {
      type: Function,
      default: () => null
    },
    rightIcon: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    onClickLeft() {
      if (['/', '/apps'].indexOf(this.$route.path) !== -1) {
        return false
      }
      console.log(this.$route.path, this.$route.meta.pRouteName)
      if (!this.back) {
        if (this.$route.meta.pRouteName) {
          this.$router.push({ name: this.$route.meta.pRouteName })
        } else {
          this.$router.back()
        }
      } else {
        this.$router.back()
      }
    },
    onClickRight() {
      if (['/', '/apps'].indexOf(this.$route.path) === -1) {
        this.$router.push('/apps')
      } else {
        this.rightClick && this.rightClick()
      }
    }
  },
  mounted() { }
}
</script>

<style lang="less">
.nav-bar-wrap {
  position: fixed;
  width: 100vw;
  z-index: 999;
  .van-nav-bar__title {
    position: absolute;
    left: 15px;
    right: 15px;
  }
  .hide-back {
    .van-nav-bar__left {
      display: none;
    }
  }
}
</style>
