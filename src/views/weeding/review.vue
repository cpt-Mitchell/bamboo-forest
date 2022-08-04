<!-- 除草核价记录表（审核人界面） -->
<template>
  <div class="logging-progress-report-box">
    <div :style="style + 'padding-left: 10px; padding-right: 10px'">
      <van-cell-group>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>核价人</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['核价人'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>核价日期</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['核价日期'] ? form['核价日期'].substring(0, 10) : '' }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林场名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['林场名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['片区名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['林班名称'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>种植(萌芽)年度</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['种植年度'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>树种</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['树种'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>树高(米)</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['树高'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>作业方式</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['作业方式'] }}</span>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>作业面积(亩)</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <span>{{ form['作业面积'] }}</span>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <div class="card-part" style="overflow-x: auto">
      <div style="width: calc(100vw - 30px); margin: 0 auto 50px">
        <table class="table" v-for="(item, index) in tableData" :key="index">
          <colgroup>
            <col width="80px" />
            <col width="90px" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th colspan="2" style="text-align: center">难度等级</th>
              <th>
                <span>{{ item['难度等级'] }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center" rowspan="2">主要草类</td>
              <td style="text-align: center">类别</td>
              <td style="padding: 0">
                <span>{{ item['主要草类'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center">比例(%)</td>
              <td style="padding: 0">
                <span>{{ item['主要草类比例'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" rowspan="2">杂草杂灌</td>
              <td style="text-align: center">平均高度(米)</td>
              <td style="padding: 0">
                <span>{{ item['杂草杂灌平均高度'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center">覆盖度(%)</td>
              <td style="padding: 0">
                <span>{{ item['杂草杂灌覆盖度'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">平均坡度</td>
              <td style="padding: 0">
                <span>{{ item['平均坡度'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">需拉水面积(亩)</td>
              <td style="padding: 0">
                <span>{{ item['需拉水面积'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">所占面积(亩)</td>
              <td style="padding: 0">
                <span>{{ item['所占面积'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">所占面积比例(%)</td>
              <td style="padding: 0">
                <span>{{ item['所占面积比例'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">预估工效(亩/工)</td>
              <td style="padding: 0">
                <span>{{ item['预估工效'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">实地单价</td>
              <td style="padding: 0">
                {{ item['实地单价'] }}
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">评估单价明细</td>
              <td style="padding: 0">
                <van-button size="mini" @click="goDetailed(item, index)" type="primary">查看</van-button>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" rowspan="2">预估费用</td>
              <td style="text-align: center">单价</td>
              <td style="padding: 0">
                <span>{{ item['预估发包单价'] }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center">总承揽费</td>
              <td style="padding: 0">
                <span>{{ item['预估总承揽费'] }}</span>
              </td>
            </tr>
            <template v-if="index === tableData.length - 1">
              <tr>
                <td style="text-align: center" rowspan="3">总计</td>
                <td style="text-align: center">承揽费</td>
                <td style="padding: 0">
                  {{ form['承揽费'] }}
                </td>
              </tr>
              <tr>
                <td style="text-align: center">综合难度</td>
                <td style="padding: 0">
                  <span>{{ form['综合难度'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">建议发包单价</td>
                <td style="padding: 0">
                  <span>{{ form['建议发包单价'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">备注</td>
                <td style="padding: 5px; text-align: left" colspan="2">
                  <span>{{ form['备注'] }}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <van-dialog
      :before-close="onBeforeClose"
      :showCancelButton="true"
      cancel-button-text="关闭"
      :show-confirm-button="false"
      v-model="showDialog"
      title="评估单价明细"
    >
      <div class="card-part" style="overflow-x: auto">
        <div style="width: calc(100% - 30px); margin: 0 auto 50px">
          <table class="table">
            <colgroup>
              <col width="70px" />
              <col width="80px" />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th style="text-align: center" colspan="2">难度等级</th>
                <th>
                  <span>{{ detailArr['难度等级'] }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center" colspan="2">民工作业单价</td>
                <td style="padding: 0">
                  <span>{{ detailArr['民工作业单价'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" rowspan="3">药</td>
                <td style="text-align: center">品牌</td>
                <td style="padding: 0">
                  <span>{{ detailArr['药品牌'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">药量(斤/亩)</td>
                <td style="padding: 0">
                  <span>{{ detailArr['药量'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">药费(元/亩)</td>
                <td style="padding: 0">
                  <span>{{ detailArr['药费'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">运水费用</td>
                <td style="padding: 0">
                  <span>{{ detailArr['运水费用'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">油费</td>
                <td style="padding: 0">
                  <span>{{ detailArr['油费'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">机械损耗费用</td>
                <td style="padding: 0">
                  <span>{{ detailArr['机械损耗'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">承揽商合理利润</td>
                <td style="padding: 0">
                  <span>{{ detailArr['承揽商利润'] }}</span>
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">实地单价</td>
                <td style="padding: 0">
                  <span>{{ detailArr['实地单价'] }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </van-dialog>
    <footbar>
      <van-col span="12">
        <van-button @click="doSave()" style="width: 100%; height: 40px" type="danger">退回修改</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="doSubmit()" style="width: 100%; height: 40px" type="primary">同意</van-button>
      </van-col>
    </footbar>
  </div>
</template>

<script>
import Footbar from '@/components/Footbar'
import request from '@/utils/httpUtil'
import { API } from '@/api'
import { parseTime } from '@/utils/index'
import { Dialog } from 'vant'
export default {
  data() {
    return {
      style: '',
      modeDialog: false,
      showDatePicker: false,
      showDialog: false,
      areaId: null,
      forestries: [],
      areas: [],
      forestClasses: [],
      userInfo: {},
      yearArr: [
        '2015/2016',
        '2016/2017',
        '2017/2018',
        '2018/2019',
        '2019/2020',
        '2020/2021',
        '2021/2022',
        '2022/2023',
        '2023/2024'
      ],
      tableData: [
        {
          hjId: null,
          level: null,
          area: null,
          areaScale: null,
          avg: null,
          lsArea: null,
          grasses: null,
          grassesScale: null,
          grassesAvgHight: null,
          grassesCover: null,
          gx: null,
          difficultyQty: null
        }
      ],
      difficultyArr: ['难', '中', '易'],
      speciesArr: ['桉树', '竹子', '松树'],
      modeArr: ['全砍(机械)', '全砍(人工)', '喷除草剂(机械)', '喷除草剂(人工)', '其他'],
      id: '',
      detailArr: {},
      seq: null,
      form: {
        companyName: null,
        companyId: null,
        lcName: null,
        lcId: null,
        areaName: null,
        areaId: null,
        lbName: null,
        lbId: null,
        lbNo: null,
        taskArea: null,
        treeHight: null,
        remark: null,
        taskWay: null,
        treeSpecies: null,
        year: null,
        date: parseTime(new Date(), '{y}-{m}-{d}'),
        username: this.$store.state.appUser.userName || null,
        enter: this.$store.state.appUser.userName || null,
        allLevel: null,
        allBPrice: null,
        totalQty: null
      }
    }
  },
  watch: {},
  methods: {
    onBeforeClose(action, done) {
      if (action === 'confirm') {
        return done(false)
      } else {
        return done()
      }
    },
    goDetailed(item, index) {
      this.detailArr = JSON.parse(JSON.stringify(item))
      this.showDialog = true
    },
    doSave() {
      // this.$loadingState(true)
      // this.$store.commit('SAVE_WEEDING_LAUNCH_FORM', this.form)
      // this.$store.commit('SAVE_WEEDING_LAUNCH_DATA', this.tableData)
      // this.$store.commit('INPUT_SHOW', this.modeDialog)
      // setTimeout(this.back(), 1000)
    },
    back() {
      this.$loadingState(false)
      this.$router.go(-1)
    },
    doSubmit() {
      this.$dConfirm('确定通过表单内容吗？', () => {
        this.$loadingState(true)
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '劳务经理审核更新保存',
          task: '劳务经理审核更新保存',
          payload: {
            keyword: '',
            empNo: this.userInfo.emplid,
            empName: this.userInfo.name,
            id: this.$route.query['ID'] || ''
          }
        }
        request.post(API.DISEASES_INFO, params).then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 0) {
            this.$toast(res.data.msg || '审核通过成功')
            this.$router.go(-1)
          } else {
            this.$toast(res.data.msg || '审核通过失败')
          }
        })
      })
    },
    getInfo() {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '除草核价',
        task: '除草核价',
        payload: {
          id: this.$route.query['ID'] || ''
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          console.log(res.data.data.data)
          this.tableData = []
          let data = res.data.data.data || []
          if (data.length > 0) {
            data.forEach(item => {
              if (item['核价ID'] == this.$route.query['ID']) {
                this.tableData.push(item)
              }
            })
          }
        } else {
          this.$toast(res.data.msg || '查询明细表失败')
        }
      })
    },
    getPersonalInfo() {
      request.get(API.DINGTALK_PERSONAL_INFO + `/${this.$store.state.appUser.id}`).then(res => {
        let data = res.data || {}
        if (data.errorCode) {
          this.userInfo = data.data || {}
          console.log(this.userInfo)
        } else {
          this.$toast(res.data.msg || '查询审核人信息失败')
        }
      })
    }
  },
  components: {
    Footbar
  },
  mounted() {
    console.log(this.$route.query)
    this.form = this.$route.query || {}
    this.getPersonalInfo()
    this.getInfo()
    this.$title(this.$route.name)
  }
}
</script>

<style scoped lang="less">
.van-field .van-cell__title {
  max-width: 120px;
  font-size: 16px;
  input[type='number'] {
    font-size: 0.32rem;
    color: #21bcfa;
  }
}
.addAndDelete {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table td {
  input {
    border: none;
    text-align: center;
  }
  .van-cell__value {
    padding-left: 0;
  }
  .van-cell {
    height: 30px;
  }
}
</style>
