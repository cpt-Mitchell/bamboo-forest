<template>
  <div class="application-app-box">
    <van-row style="margin: 0 auto;">
      <template v-for="(app, index) in $router.options.routes[0].children">
        <van-col span="6" :key="index" v-if="!app.hidden">
          <div class="mu-paper" @click="goRoute(app.name)">
            <i :class="'app-icon app-' + app.meta.background + '-icon'"></i>
            <span style="position: relative;top: .12rem;">{{ app.name }}</span>
          </div>
        </van-col>
      </template>
    </van-row>
    <p class="version-text">当前版本号：{{ version }}</p>
  </div>
</template>

<script>
export default {
  name: 'application-apps',
  data() {
    return {
      version: ''
    }
  },
  methods: {
    goRoute(name) {
      this.$router.push({
        name: name
      })
    },
    getVersion() {
      window.ZLAPP.postMessage(
        JSON.stringify({
          method: 'getVersion',
          getResult: 'window.App_Version'
        })
      )
      let interval = setInterval(() => {
        if (window.App_Version !== undefined && window.App_Version !== null) {
          // 返回空字符串表示获取失败
          if (window.App_Version.length === 0) {
            clearInterval(interval)
          } else {
            try {
              this.version = window.App_Version
            } catch (e) {
              dAlert('获取版本号失败')
            }
            clearInterval(interval)
          }
        }
      }, 800)
    }
  },
  mounted() {
    this.getVersion()
  }
}
</script>

<style lang="less" scoped>
.application-app-box {
  background: #fff;
  padding-top: 10px;

  & > div {
    padding: 0.25rem;
    width: 100%;
    // display: flex;
    // flex-wrap: wrap;
    // align-items: center;
    // justify-content: center;
    // flex-grow: 1;
    // justify-content: flex-start;
    box-sizing: border-box;

    .mu-paper {
      height: 2.5rem;
      margin-bottom: 0.2rem;
      text-align: center;
      font-size: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      word-break: break-word;

      .app-icon {
        width: 1.6rem;
        height: 1.6rem;
        margin: 0 auto;
        display: block;
      }
    }
  }
}

.img-items {
  padding: 10px;
  margin: 0 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

#container {
  width: 100%;
  height: 200px;
}

.option {
  padding: 0px 5px;
}
.version-text {
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 10px;
  font-size: 0.36rem;
  text-align: center;
  margin: 0;
  color: #666;
}
</style>
