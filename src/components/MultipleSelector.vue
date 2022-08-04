<template>
  <van-action-sheet
    class="multiple-select-c"
    v-model="display"
    :close-on-click-overlay="false"
    cancel-text="完成"
    @cancel="cancel"
  >
    <div
      style="padding: 0 0.25rem;max-height:220px;overflow:auto;-webkit-overflow-scrolling: touch;white-space:nowrap;"
    >
      <van-row v-for="(item, index) in data" :key="index" style="height:42px;line-height: 42px;">
        <van-col span="24">
          <van-checkbox v-model="item.checked">{{ item.qyNo }}</van-checkbox>
        </van-col>
      </van-row>
    </div>
  </van-action-sheet>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currSelect: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      display: false
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.display = val
      }
    },
    display(val) {
      if (!val) {
        this.$emit('submit', this.getCheckedItems())
      }
    }
  },
  methods: {
    getCheckedItems() {
      return this.data.filter(item => item.checked)
    },
    cancel() {
      // this.$emit('submit', this.getCheckedItems())
    }
  },
  mounted() {
    console.log(this.data)
  }
}
</script>

<style lang="less">
.multiple-select-c {
  padding: 0.25rem 0 0 0 !important;
  .van-action-sheet__content {
    max-height: 220px;
  }
  .van-action-sheet__cancel,
  .van-action-sheet__item {
    text-align: center;
    font-size: 16px;
    line-height: 42px;
    background-color: #0099ff;
    color: #fff;
  }
}
</style>
