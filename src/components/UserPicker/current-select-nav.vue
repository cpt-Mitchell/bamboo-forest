<template>
  <div class="current-select-nav">
    <span v-if="!searchBelongCompany && !searchAppointCompany">
      <span
        :class="[data.length>0 ? 'jump-depart' : '']"
        @click="data.length>0?navLinkHandle(-1):null"
      >华劲集团股份有限公司&nbsp;</span>
      {{data.length>0 ? '&gt;': '' }}
    </span>
    <template v-for="(item,index) in data">
      <!-- <span v-if="data.length == 1" :key="index">{{item.descShort}}&nbsp;</span> -->
      <span
        :key="index"
        :class="[index!= data.length - 1 ? 'jump-depart' : '']"
        @click="navLinkHandle(index)"
      >{{index >0 ? '>' : ''}}&nbsp;{{item.descShort}}&nbsp;</span>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    searchBelongCompany: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    searchAppointCompany: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    navLinkHandle(index) {
      this.$emit('navClick', index)
    }
  }
}
</script>

<style lang="less" scoped>
.current-select-nav {
  display: block;
  width: 100%;
  overflow: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  span {
    font-size: 0.36rem;
  }
  .jump-depart {
    color: #2196f3;
  }
}
</style>
