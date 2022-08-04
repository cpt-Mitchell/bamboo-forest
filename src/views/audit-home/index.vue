<template>
  <div class="audit-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {}
</script>
<style lang="less">
.audit-container {
  min-height: calc(100vh - 46px);
  .van-pull-refresh {
    min-height: calc(100vh - 46px);
  }
}
</style>
