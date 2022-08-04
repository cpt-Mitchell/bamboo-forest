<template>
  <van-action-sheet :round="false" v-model="show" :close-on-click-overlay="false">
    <van-datetime-picker
      v-model="currentDate"
      :type="type"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirm"
      @cancel="cancel"
      :formatter="formatter"
    />
  </van-action-sheet>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    currDate: {
      type: Date,
      default: () => new Date()
    },
    type: {
      type: String,
      default: () => 'datetime'
    },
    minDate: {
      type: Date,
      default: () => new Date(1970, 1, 1)
    },
    maxDate: {
      type: Date,
      default: () => new Date(new Date().getFullYear() + 30, 12, 31)
    }
  },
  data() {
    return {
      currentDate: new Date()
    }
  },
  methods: {
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}时`
      } else if (type === 'minute') {
        return `${value}分`
      } else if (type === 'seconds') {
        return `${value}秒`
      }
      return value
    },
    confirm(value) {
      this.$emit('result', value)
    },
    cancel() {
      this.$emit('close')
    }
  },
  mounted() {
    if (this.currDate) {
      this.currentDate = this.currDate
    }
  }
}
</script>

<style></style>
