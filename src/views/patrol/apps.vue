<template>
  <div class="attendance-app-box">
    <van-row style="margin: 0 auto;">
      <template v-for="(app, index) in routes">
        <van-col span="6" :key="index" v-if="!app.hidden">
          <div class="mu-paper" @click="$router.push({ name: app.name })">
            <span class="app-icon" :style="{ background: app.meta.background }">{{
              app.meta.iconTitle || app.name
            }}</span>
            <span style="position: relative;top: .12rem;">{{ app.name }}</span>
          </div>
        </van-col>
      </template>
    </van-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: []
    }
  },
  mounted() {
    let route = this.$route.matched
    this.$router.options.routes[0].children.forEach(r => {
      if (r.path === route[route.length - 1].parent.path) {
        this.routes = r.children
      }
    })
    this.$title('巡山协管')
  }
}
</script>

<style lang="less" scoped>
.attendance-app-box {
  background: #fff;
  padding-top: 10px;
  padding: 0.25rem;
  width: 100%;
  // display: flex;
  // flex-wrap: wrap;
  // align-items: center;
  box-sizing: border-box;
  // flex-grow: 1;
  // justify-content: flex-start;

  .mu-paper {
    height: 2.5rem;
    // width: 1.8rem;
    // width: 1.95rem;
    margin-right: 0.2rem;
    margin-bottom: 0.2rem;
    margin-left: 0.2rem;
    text-align: center;
    font-size: 0.3rem;

    .app-icon {
      width: 1.6rem;
      height: 1.6rem;
      margin: 0 auto;
      display: block;
      color: #fff;
      font-size: 0.4rem;
      padding: 0.26rem 0.28rem;
      box-sizing: border-box;
      border-radius: 5px;
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
</style>
