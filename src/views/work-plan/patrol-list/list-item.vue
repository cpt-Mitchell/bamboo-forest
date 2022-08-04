<template>
  <div class="van-hairline--bottom" style="padding: 5px 10px" @click="click">
    <van-row>
      <van-col span="24" align="left">
        <span style="font-size:.4rem;">{{ item.title }}</span>
        <br />
      </van-col>
      <van-col span="24" align="left">
        <slot name="summary"></slot>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  props: ['item'],
  methods: {
    click() {
      if (this.item.status === '退回') {
        this.$router.push({
          name: '巡山计划表',
          query: {
            id: this.item.rowID || ''
          }
        })
      } else {
        this.$router.push({
          name: '巡山计划查看',
          params: {
            id: this.item.rowID || ''
          }
        })
      }
    }
  }
}
</script>

<style scoped></style>
