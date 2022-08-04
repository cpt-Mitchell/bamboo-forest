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
  props: ['item', 'pathName'],
  methods: {
    // ovrTime(time) {
    //   if (!time) {
    //     return
    //   }
    //   let current = new Date()
    //   let addDate = new Date(time)
    //   let between = current.getTime() - time
    //   if (between <= 24 * 60 * 60 * 1000) {
    //     return addDate.getHours() + ':' + addDate.getMinutes()
    //   } else if (between <= 24 * 60 * 60 * 2 * 1000) {
    //     return '昨天'
    //   } else {
    //     return addDate.getMonth() + 1 + '-' + addDate.getDate()
    //   }
    // },
    click() {
      if (this.pathName) {
        this.$router.push({
          name: this.pathName,
          query: {
            node: this.item.node
          },
          params: {
            type: this.item.tableName || '',
            id: this.item.rowID || ''
          }
        })
      }
    }
  }
}
</script>

<style scoped></style>
