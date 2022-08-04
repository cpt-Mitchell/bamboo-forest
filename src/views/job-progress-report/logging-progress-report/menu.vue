<template>
  <div class="job-progress-report-menu-box">
    <div class="mu-paper">
      <van-list>
        <template v-for="(app,index) in routes">
          <van-row v-if="!app.hidden" :key="index" @click.native="$router.push({name:app.name})">
            <van-col>
              <p class="list-item-p van-hairline--bottom">{{app.name}}</p>
            </van-col>
          </van-row>
        </template>
      </van-list>
    </div>
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

    let pRoute1 = this.$router.options.routes.find(rts => rts.name === route[0].name)
    let pRoute2 = pRoute1.children.find(rts => rts.name === route[1].name)
    let pRoute3 = pRoute2.children.find(rts => rts.name === route[2].name)
    this.routes = pRoute3.children
    // this.$router.options.routes[0].children.forEach(r => {
    //   if (r.path === route[route.length - 1].parent.path) {
    //     this.routes = r.children
    //   }
    // })
    // DingTalkApi.biz.navigation.setTitle({
    //   title: '首页'
    // })
  }
}
</script>

<style lang="less">
.job-progress-report-menu-box {
  // background: #fff;
  // padding: 0.25rem 0;
  // width: 100%;
  // display: flex;
  // flex-wrap: wrap;
  // align-items: center;
  // padding: 15px;
  .list-item-p {
    line-height: 46px;
    padding: 0 20px;
    margin: 0;
    width: 100vw;
    box-sizing: border-box;
  }
}
</style>
