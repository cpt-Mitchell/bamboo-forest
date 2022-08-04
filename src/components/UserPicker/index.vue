<template>
  <transition name="slideup">
    <div class="user-picker-container" v-show="pickerShow">
      <picker
        v-if="pickerDisplay"
        :currentCompany="currentCompany"
        :searchBelongCompany="searchBelongCompany"
        :searchAppointCompany="searchAppointCompany"
        :justWorker="justWorker"
        :selected="selected"
        :title="title"
        :multiple="multiple"
        @close="pickerShow = false"
        @submit="getResult"
      ></picker>
    </div>
  </transition>
</template>

<script>
import Picker from './picker'
export default {
  props: {
    currentCompany: {
      type: String,
      default: function () {
        return ''
      }
    },
    title: {
      type: String,
      default: function () {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 只查询本公司
    searchBelongCompany: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // searchBelongCompany=false的情况下，指定查询某公司
    searchAppointCompany: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    selected: {
      type: Array,
      default: function () {
        return []
      }
    },
    justWorker: {
      type: Boolean,
      default: function () {
        return false
      }
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
  watch: {
    pickerShow(val) {
      if (!val) {
        setTimeout(() => {
          this.pickerDisplay = false
          this.$emit('close')
        }, 50)
      }
    },
    display(val) {
      if (val) {
        this.pickerDisplay = val
        setTimeout(() => {
          this.pickerShow = true
        }, 150)
      }
    }
  },
  methods: {
    getResult(result) {
      this.$emit('result', result)
    }
  },
  components: {
    Picker
  },
  mounted() {
    this.pickerDisplay = this.display
  }
}
</script>

<style lang="less" scoped>
.user-picker-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: #fff;
  z-index: 8888;
}
</style>
