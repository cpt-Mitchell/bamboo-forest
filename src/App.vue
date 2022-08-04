<template>
  <div id="app">
    <!-- <div class="loading-box" v-if="$store.state.isLoading">
      <flower-spinner :animation-duration="2000" :size="60" :color="color"/>
      <div :style="{fontSize:'.32rem',color,marginTop:'15px'}">{{$store.state.loadingText || '加载中'}}</div>
    </div> -->
    <vue-element-loading
      :active="$store.state.isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{ fontSize: '.36rem' }"
      spinner="spinner"
      :text="$store.state.loadingText || '加载中'"
    />
    <router-view class="child-view" />
  </div>
</template>

<script>
// import { FlowerSpinner } from 'epic-spinners'
export default {
  name: 'App',
  data() {
    return {
      color: '#0099ff',
      transitionName: '',
      inClass: '',
      outClass: ''
    }
  },
  // components: {
  //   FlowerSpinner
  // },
  mounted() {}
}
</script>

<style>
#app {
  overflow-x: hidden;
  max-width: 100vw;
  min-height: 100vh;
  background: #fff;
}
.child-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  /* height: 100%; */
  /* height: calc(100vh - 46px); */
  overflow-y: auto;
  overflow-x: hidden;
}
.loading-box {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
  z-index: 10000;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
