<template>
  <div>
    <van-row>
      <van-col span="24">
        <nav-bar right-text="登出" :rightClick="logout"></nav-bar>
      </van-col>
    </van-row>
    <div :style="{ height: 'calc(100vh - 50px)', marginTop: '46px', WebkitOverflowScrolling: 'touch' }">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
// import store from '@/store'
import NavBar from '@/components/NavBar'
// import request from '@/utils/httpUtil'
// import { API } from '@/api'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      isLoading: false,
      loadingText: ''
    }
  },
  methods: {
    logout() {
      this.$dConfirm('确定登出吗？', () => {
        this.$loadingState(true, '正在登出')
        setTimeout(() => {
          this.$loadingState(false)
          this.loadingText = ''
          this.$store.commit('clearUser', () => {
            this.$router.push('/login')
          })
        }, 1000)
      })
    }
  }
}
</script>

<style></style>
