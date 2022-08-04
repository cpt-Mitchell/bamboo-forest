<template>
  <div class="quality-data-confirm-detail" style="height: 100%;">
    <div class="card card-part">
      <van-row>
        <van-col span="24">
          <h3 class="header-title">1、基本信息</h3>
        </van-col>
      </van-row>
      <div>
        <van-cell-group>
          <van-field
            class="no-disabled_bgcolor"
            v-model="form.procedureName"
            label="作业工序"
            placeholder="作业工序未录入"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            v-model="form.lbName"
            label="林班名称"
            placeholder="林班名称未录入"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            v-model="form.orderNo"
            label="订单编号"
            placeholder="订单编号未录入"
            disabled
          />
          <van-field
            v-model="form.qyNo"
            class="no-disabled_bgcolor"
            label="区域编号"
            placeholder="订单编号未录入"
            disabled
          />
          <van-field class="no-disabled_bgcolor" v-model="form.tree" label="树种" placeholder="树种未录入" disabled />
          <van-field
            class="no-disabled_bgcolor"
            v-model="form.checkPersonnel"
            label="验收人员"
            placeholder="验收人员未录入"
            disabled
          />
          <van-field
            class="no-disabled_bgcolor"
            v-model="form.checkDate"
            label="验收日期"
            placeholder="验收日期未录入"
            disabled
          />
        </van-cell-group>
      </div>
      <van-row>
        <van-col span="24">
          <h3 class="header-title">2、验收数据</h3>
        </van-col>
      </van-row>
      <div style="padding:15px 0;">
        <van-cell-group>
          <template v-for="(item, index) in form.checkTablesDtos">
            <van-field
              class="no-disabled_bgcolor"
              v-if="item.show"
              :key="index"
              style="color:#333"
              v-model="item.readData"
              disabled
              :label="item.fieldDesc"
              placeholder="请输入具体内容"
            />
          </template>
        </van-cell-group>
      </div>
      <van-row>
        <van-col span="24">
          <h3 class="header-title">3、验收照片</h3>
        </van-col>
      </van-row>
      <div style="padding:15px 0;">
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button @click="showFile(form.photo1)" style="width:240px" type="info">显示验收样点分布图图</van-button>
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-if="form.photo1">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a class="photo-name">{{
                (form.photo1 || '').substring(
                  (form.photo1 || '').lastIndexOf('/') + 1,
                  (form.photo1 || '').lastIndexOf('.')
                )
              }}</a>
              <a class="photo-ext">{{ (form.photo1 || '').substr((form.photo1 || '').lastIndexOf('.')) }}</a>
            </div>
          </van-col>
        </van-row>
        <van-row style="margin-bottom:5px;">
          <van-col span="24" align="left">
            <van-button @click="showFile(form.photo2)" style="width:240px" type="info">显示验收人现场自拍照</van-button>
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-if="form.photo2">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a class="photo-name">{{
                (form.photo2 || '').substring(
                  (form.photo2 || '').lastIndexOf('/') + 1,
                  (form.photo2 || '').lastIndexOf('.')
                )
              }}</a>
              <a class="photo-ext">{{ (form.photo2 || '').substr((form.photo2 || '').lastIndexOf('.')) }}</a>
            </div>
          </van-col>
        </van-row>
        <van-row style="margin-bottom:5px;">
          <van-col align="left" span="24">
            <van-button @click="showFile(form.photo3)" style="width:240px" type="info">显示验收记录表照片</van-button>
          </van-col>
        </van-row>
        <van-row class="upload-row" style="margin-bottom:5px;" v-if="form.photo3">
          <van-col span="24" align="left">
            <div class="uploaded-file-box">
              <a class="photo-name">{{
                (form.photo3 || '').substring(
                  (form.photo3 || '').lastIndexOf('/') + 1,
                  (form.photo3 || '').lastIndexOf('.')
                )
              }}</a>
              <a class="photo-ext">{{ (form.photo3 || '').substr((form.photo3 || '').lastIndexOf('.')) }}</a>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <footbar>
      <van-row>
        <van-col span="12">
          <van-button @click="submit(4)" style="width:100%;height:40px;" type="warning">不同意确认</van-button>
        </van-col>
        <van-col span="12">
          <van-button @click="submit(3)" style="width:100%;height:40px;" type="primary">同意确认</van-button>
        </van-col>
      </van-row>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { ImagePreview } from 'vant'

export default {
  data() {
    return {
      form: {}
    }
  },
  methods: {
    showFile(link = '') {
      ImagePreview([link])
    },
    getTableDetail() {
      this.$loadingState(true, '数据加载中')
      request
        .get(API.DINGTALK_QUALITY_VERIFY_DETAIL + this.$route.params.id)
        .then(res => {
          this.$loadingState(false)
          let data = res.data.data,
            errorCode = res.data.errorCode
          if (errorCode) {
            this.form = data
          } else {
            dAlert(res.data.msg || '数据查询出错了！')
          }
        })
        .catch(err => this.$loadingState(false))
    },
    submit(status) {
      dConfirm(`确认提交${status === 3 ? '同意' : '不同意'}?`, () => {
        this.$loadingState(true, '数据提交中')
        this.form.status = status
        request
          .post(API.DINGTALK_QUALITY_VERIFY_SAVE, this.form)
          .then(res => {
            this.$loadingState(false)
            this.$dAlert(res.data.msg, () => {
              if (res.data.code === '1000') {
                this.$router.back()
              }
            })
          })
          .catch(err => this.$loadingState(false))
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    this.getTableDetail()
  }
}
</script>

<style lang="less" scoped>
.quality-data-confirm-detail {
  padding-bottom: 20px;
  box-sizing: border-box;
  .samll-area-detail-text {
    width: 60px;
    .van-text-field-input {
      text-align: center;
    }
  }
  .van-form-item-label {
    line-height: 20px;
    font-size: 15px;
    padding-top: 10px;
  }

  .van-input-content {
    height: 40px;
  }

  .label-text {
    color: rgba(0, 0, 0, 0.54);
  }
  .upload-row {
    a {
      color: #0099ff;
      font-size: 0.36rem;
    }
    .uploaded-file-box {
      width: 95%;
      display: inline-block;
      .photo-name {
        max-width: 90%;
        overflow: hidden;
        white-space: nowrap;
        word-break: break-all;
        // display: inline-block;
        text-overflow: ellipsis;
        float: left;
      }
      .photo-ext {
        position: relative;
        top: -4px;
      }
    }
  }
}
</style>
