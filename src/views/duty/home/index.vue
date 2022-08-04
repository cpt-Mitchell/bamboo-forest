<template>
  <div>
    <van-tabs v-model="active">
      <van-tab title="发起申请"></van-tab>
      <van-tab title="我的申请"></van-tab>
    </van-tabs>
    <div class="demo-text" v-if="active === 0">
      <apply :form="form" @doneSubmit="submit"></apply>
    </div>
    <div class="demo-text" v-if="active === 1">
      <list-duty></list-duty>
    </div>
  </div>
</template>

<script>
import Apply from '../duty/apply'
import ListDuty from '../duty/list-duty'
export default {
  data() {
    return {
      active: 0,
      form: {}
    }
  },
  mounted() {
    this.listenStatus()
    this.$title('值班申请')
  },
  watch: {
    $route() {
      this.listenStatus()
    },
    active(val) {
      if (val === 0) {
        this.$router.push({
          name: '值班申请'
        })
      } else if (val === 1) {
        this.$router.push({
          name: '值班申请列表'
        })
      }
    }
  },
  methods: {
    listenStatus() {
      if (this.$route.name === '值班申请') {
        this.active = 0
      } else if (this.$route.name === '值班申请列表') {
        this.active = 1
      }
    },
    submit(result) {
      if (result.done) {
        this.active = 1
        this.$router.push({
          name: '值班申请列表'
        })
      }
    }
  },
  components: {
    Apply,
    ListDuty
  }
}
</script>

<style lang="less">
.van-tab {
  color: #272729;

  .van-tab-wrapper {
    padding: 10px;
    min-height: 36px;
  }
}

.van-tab-active {
  color: #fff;
  background-color: #458de2;
}
</style>
