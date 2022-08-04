<template>
  <transition name="slideup">
    <!-- <div class="check-user-picker-container" v-show="pickerShow"> -->
    <div class="small-area-dialog" v-if="display">
      <area-form @result="getResult" @closeDialog="close" :dataList="data" :title="title"></area-form>
    </div>
  </transition>
</template>

<script>
import AreaForm from './area'
export default {
  props: {
    title: {
      type: String,
      default: () => ''
    },
    data: {
      type: Array,
      required: true
    },
    display: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      pickerDisplay: false,
      pickerShow: false
    }
  },
  // watch: {
  //   pickerShow(val) {
  //     if (!val) {
  //       setTimeout(() => {
  //         this.$emit('close')
  //         this.pickerDisplay = false
  //       }, 50)
  //     }
  //   },
  //   display(val) {
  //     if (val) {
  //       this.pickerDisplay = val
  //       setTimeout(() => {
  //         this.pickerShow = true
  //       }, 50)
  //     }
  //   }
  // },
  methods: {
    close() {
      this.$emit('close')
    },
    getResult(result) {
      this.$emit('result', result)
    }
  },
  components: {
    AreaForm
  },
  mounted() {
    this.pickerDisplay = this.display
  }
}
</script>

<style lang="less" scoped>
.small-area-dialog {
  margin-top: 0px;
  padding-top: 0px;
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 10000;
  background: #fff;
}
// .check-user-picker-container {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   height: 100vh;
//   background: #fff;
//   z-index: 8888;
//   overflow: hidden;
// }
</style>
