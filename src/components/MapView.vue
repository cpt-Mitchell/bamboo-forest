<template>
  <div class="map-view-container">
    <div id="container"></div>
    <van-button
      style="position: absolute;bottom: 70px;left: 10px;"
      size="small"
      type="info"
      @click="initMap()"
    >重新定位</van-button>
    <div v-if="showAddress">
      <p style="line-height:1.5;">当前位置：{{geolocation.formattedAddress}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showAddress: {
      type: Boolean,
      default: function () {
        return true
      }
    }
  },
  data() {
    return {
      geolocation: {}
    }
  },
  methods: {
    initMap() {
      // const that = this
      this.$loadingState(true, 'GPS定位中')
      let that = this
      this.$catkicLocation('container', function (data) {
        that.$loadingState(false)
        that.geolocation = data
        that.$emit('result', data)
      }, function (err) {
        that.$loadingState(false)
        that.$dAlert(err)
        console.log(err)
      })
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>

<style lang="less" scoped>
.map-view-container {
  margin-top: 15px;
  position: relative;

  #container {
    width: 100%;
    height: 200px;
  }

  .option {
    padding: 0px 10px;
    position: relative;

    i {
      position: relative;
      right: 15px;
      top: 5px;
    }
  }
}
</style>
