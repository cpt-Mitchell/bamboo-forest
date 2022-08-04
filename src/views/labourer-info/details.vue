<template>
  <div class="labourer-details">
    <h3 class="head-title">基本信息</h3>
    <van-cell-group>
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.民工姓名" label="姓名：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.身份证" label="身份证号码：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.年龄" label="年龄：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.籍贯" label="籍贯：" readonly />
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.通讯地址"
        type="textarea"
        label="通讯地址："
        readonly
      />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.联系电话" label="联系电话：" readonly />
    </van-cell-group>
    <h3 class="head-title">合同信息</h3>
    <van-cell-group>
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.所属承揽商"
        label="归属承揽商："
        readonly
      />
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.是否签订劳动合同"
        label="是否签订劳动合同："
        readonly
      >
        <van-button v-if="attachFile" slot="button" size="small" type="primary" @click="show = true"
          >合同扫描件</van-button
        >
      </van-field>
    </van-cell-group>
    <h3 class="head-title">投保信息</h3>
    <van-cell-group>
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.保险单号" label="保险单号：" readonly />
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.个人或团体"
        label="个人或团体险："
        readonly
      />
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.投保起始日期"
        label="投保起始日期："
        readonly
      />
      <van-field
        label-align="right"
        class="no-disabled_bgcolor"
        v-model="form.投保结束日期"
        label="投保结束日期："
        readonly
      />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.有效状态" label="有效状态：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.保险公司" label="保险公司：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.保险费" label="保费：" readonly />
      <van-field label-align="right" class="no-disabled_bgcolor" v-model="form.保额" label="保额：" readonly />
    </van-cell-group>
    <van-dialog class="picture-view" v-model="show" :showConfirmButton="false" closeOnClickOverlay>
      <img style="width:100%;height:102%;" :src="'data:image/jpg;base64,' + this.attachFile" />
    </van-dialog>
  </div>
</template>

<script>
import request from '@/utils/httpUtil'
import { API } from '@/api'
export default {
  data() {
    return {
      show: false,
      form: {},
      attachFile: ''
    }
  },
  methods: {
    findDetail() {
      let params = {
        formid: this.$route.query.id || '',
        apvResult: '同意',
        module: '民工信息查询',
        task: '详情',
        payload: {}
      }
      this.$loadingState(true, '数据查询中')
      request
        .post(API.APP_COMMON_TRANSACTION_SUBMIT, params)
        .then(res => {
          this.$loadingState(false)
          let data = res.data || {}
          if (data.errorCode !== 0) {
            this.$dAlert(data.msg || '')
            return false
          }
          if (data.data) {
            let result = data.data || {}
            if (result.attachments && result.attachments.length > 0) {
              this.attachFile = result.attachments[0]['文件']
            }
            this.form = result.detail || {}
            this.form['投保起始日期'] = (this.form['投保起始日期'] || '').substring(0, 10)
            this.form['投保结束日期'] = (this.form['投保结束日期'] || '').substring(0, 10)
            this.form['有效状态'] = this.form['是否到期'] === '是' ? '无效' : '有效'
          } else {
            this.$dAlert('未查询到数据')
            return false
          }
        })
        .catch(err => {
          console.error(err)
          this.$loadingState(false)
        })
    }
  },
  mounted() {
    this.findDetail()
  }
}
</script>

<style lang="less">
.labourer-details {
  .van-dialog {
    background: transparent;
  }
  .van-field--min-height .van-field__control {
    min-height: 24px;
  }
  .van-field__label--right {
    padding-right: 0;
  }
  .van-field .van-cell__title {
    width: 120px;
    max-width: 120px;
  }
  .head-title {
    margin: 0;
    padding: 15px 15px;
    font-size: 0.44rem;
  }
}
</style>
