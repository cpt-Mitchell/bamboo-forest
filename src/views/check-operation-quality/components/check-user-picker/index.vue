<template>
  <transition name="slideup">
    <div class="check-user-picker-container" v-show="pickerShow">
      <picker
        v-if="pickerDisplay"
        @result="getResult"
        @close="pickerShow = false"
        :lcId="lcId"
        :limit="limit"
        :selected="selected"
      ></picker>
    </div>
  </transition>
</template>

<script>
import Picker from './picker'
export default {
  props: {
    limit: {
      type: Number,
      default: () => 0
    },
    lcId: {
      type: Number,
      required: true
    },
    selected: {
      type: Array,
      default: function() {
        return []
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
          this.$emit('close')
          this.pickerDisplay = false
        }, 50)
      }
    },
    display(val) {
      if (val) {
        this.pickerDisplay = val
        setTimeout(() => {
          this.pickerShow = true
        }, 50)
      }
    }
  },
  methods: {
    getResult(result) {
      this.$emit('result', result)
      this.pickerShow = false
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
.check-user-picker-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: #fff;
  z-index: 8888;
  overflow: hidden;
}
</style>
