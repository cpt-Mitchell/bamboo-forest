<!-- 除草核价记录表（发起人界面） -->
<template>
  <div class="logging-progress-report-box">
    <div :style="style + 'padding-left: 10px; padding-right: 10px'">
      <van-cell-group>
        <van-field
          class="no-disabled_bgcolor"
          label="核价人"
          placeholder="自动带出核价人"
          v-model="form.username"
          disabled
        />
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.date"
          @click.native="datePickerShow('date')"
          label="核价日期"
          placeholder="点击选择日期"
          disabled
        />
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林场名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestries.length == 0"
                v-model="form.lcName"
                @change="selectChangeHandle('lcName', 'forestries', 'areas', 'lcId', 'lcName', 'lcId')"
              >
                <option :value="null" selected>请选择林场</option>
                <option v-for="(option, index) in forestries" :key="index" :value="option.lcName">
                  {{ option.lcName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>片区名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="areas.length == 0"
                v-model="form.areaName"
                @change="selectChangeHandle('areaName', 'areas', 'forestClasses', 'areaId', 'pqName', 'pqId')"
              >
                <option :value="null" selected>请选择片区</option>
                <option v-for="(option, index) in areas" :key="index" :value="option.pqName">
                  {{ option.pqName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>林班名称</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="forestClasses.length == 0"
                v-model="form.lbName"
                @change="selectChangeHandle('lbName', 'forestClasses', '', 'lbId', 'lbName', 'lbId')"
              >
                <option :value="null" selected>请选择林班</option>
                <option v-for="(option, index) in forestClasses" :key="index" :value="option.lbName">
                  {{ option.lbName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>种植(萌芽)年度</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select type="text" class="van-field__control" :disabled="yearArr.length == 0" v-model="form.year">
                <option :value="null" selected>请选择年度</option>
                <option v-for="(option, index) in yearArr" :key="index" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)">
          <div class="van-cell__title">
            <span>树种</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                type="text"
                class="van-field__control"
                :disabled="speciesArr.length == 0"
                v-model="form.treeSpecies"
              >
                <option :value="null" selected>请选择树种</option>
                <option v-for="(option, index) in speciesArr" :key="index" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.treeHight"
          label="树高(米)"
          type="number"
          placeholder="请输入树高"
        >
        </van-field>
        <div class="van-cell van-field" style="color: rgb(51, 51, 51)" v-if="!modeDialog">
          <div class="van-cell__title">
            <span>作业方式</span>
          </div>
          <div class="van-cell__value">
            <div class="van-field__body">
              <select
                @change="changeMode"
                type="text"
                class="van-field__control"
                :disabled="modeArr.length == 0"
                v-model="form.taskWay"
              >
                <option :value="null" selected>请选择作业方式</option>
                <option v-for="(option, index) in modeArr" :key="index" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <van-field
          label="作业方式"
          v-else
          class="no-disabled_bgcolor"
          v-model="form.taskWay"
          placeholder="请录入作业方式"
        >
          <template #button>
            <van-button size="mini" type="info" @click="chooseMode">选择</van-button>
          </template>
        </van-field>
        <van-field
          class="no-disabled_bgcolor"
          v-model="form.taskArea"
          @change="getAreaScale(null)"
          label="作业面积(亩)"
          type="number"
          placeholder="请输入作业面积"
        >
        </van-field>
      </van-cell-group>
    </div>
    <van-row style="padding: 10px 26px">
      <van-col span="24" class="addAndDelete">
        <van-button @click="explain" size="small" type="info">说明</van-button>
        <van-button @click="add" size="small" type="info">增加一行</van-button>
        <van-button @click="deleteOne" size="small" type="info">删除一行</van-button>
      </van-col>
    </van-row>
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
                <select
                  type="text"
                  class="van-field__control"
                  style="text-align: center; color: #fff"
                  :disabled="speciesArr.length == 0"
                  v-model="item.level"
                >
                  <option style="color: black !important" :value="null" selected>请选择难度等级</option>
                  <option
                    style="color: black !important"
                    v-for="(option, idx) in difficultyArr"
                    :key="idx"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center" rowspan="2">主要草类</td>
              <td style="text-align: center">类别</td>
              <td style="padding: 0">
                <van-field input-align="center" v-model="item.grasses" type="text" label="" placeholder="请输入类别" />
              </td>
            </tr>
            <tr>
              <td style="text-align: center">比例(%)</td>
              <td style="padding: 0">
                <van-field
                  input-align="center"
                  v-model="item.grassesScale"
                  type="number"
                  label=""
                  placeholder="请输入比例"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" rowspan="2">杂草杂灌</td>
              <td style="text-align: center">平均高度(米)</td>
              <td style="padding: 0">
                <van-field
                  input-align="center"
                  v-model="item.grassesAvgHight"
                  type="number"
                  label=""
                  placeholder="请输入平均高度"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center">覆盖度(%)</td>
              <td style="padding: 0">
                <van-field
                  input-align="center"
                  v-model="item.grassesCover"
                  type="number"
                  label=""
                  placeholder="请输入覆盖度"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">平均坡度</td>
              <td style="padding: 0">
                <van-field
                  input-align="center"
                  v-model="item.avg"
                  type="number"
                  label=""
                  placeholder="请输入平均坡度"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">需拉水面积(亩)</td>
              <td style="padding: 0">
                <van-field
                  input-align="center"
                  v-model="item.lsArea"
                  type="number"
                  label=""
                  placeholder="请输入需拉水面积"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">所占面积(亩)</td>
              <td style="padding: 0">
                <van-field
                  @change="getAreaScale(index)"
                  v-model="item.area"
                  input-align="center"
                  type="number"
                  label=""
                  placeholder="请输入所占面积"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">所占面积比例(%)</td>
              <td style="padding: 0">
                <span>{{ item.areaScale }}</span>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">预估工效(亩/工)</td>
              <td style="padding: 0">
                <van-field input-align="center" v-model="item.gx" type="number" label="" placeholder="请输入预估工效" />
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">实地单价</td>
              <td style="padding: 0">
                {{ item.sdPrice }}
              </td>
            </tr>
            <tr>
              <td style="text-align: center" colspan="2">评估单价明细</td>
              <td style="padding: 0">
                <van-button size="mini" @click="goDetailed(item, index)" type="primary">录入/查看</van-button>
              </td>
            </tr>
            <tr>
              <td style="text-align: center" rowspan="2">预估费用</td>
              <td style="text-align: center">单价</td>
              <td style="padding: 0">
                <van-field
                  @change="getAreaScale(index)"
                  v-model="item.bPrice"
                  input-align="center"
                  type="number"
                  label=""
                  placeholder="请输入单价"
                />
              </td>
            </tr>
            <tr>
              <td style="text-align: center">总承揽费</td>
              <td style="padding: 0">
                <span>{{ item.totalPrice }}</span>
              </td>
            </tr>
            <template v-if="index === tableData.length - 1">
              <tr>
                <td style="text-align: center" rowspan="3">总计</td>
                <td style="text-align: center">承揽费</td>
                <td style="padding: 0">
                  {{ form.clPrice }}
                </td>
              </tr>
              <tr>
                <td style="text-align: center">综合难度</td>
                <td style="padding: 0">
                  <select
                    type="text"
                    class="van-field__control"
                    style="text-align: center"
                    :disabled="speciesArr.length == 0"
                    v-model="form.difficulty"
                  >
                    <option :value="null" selected>请选择综合难度</option>
                    <option v-for="(option, idx) in difficultyArr" :key="idx" :value="option">
                      {{ option }}
                    </option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style="text-align: center">建议发包单价</td>
                <td style="padding: 0">
                  <van-field
                    input-align="center"
                    v-model="form.fbPrice"
                    type="number"
                    label=""
                    placeholder="请输入建议发包单价"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center">备注</td>
                <td style="padding: 5px; text-align: left" colspan="2">
                  <van-field v-model="form.remark" type="text" label="" placeholder="请输入备注" />
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
      @confirm="confirmOne"
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
                  <span>{{ detailArr.level }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center" colspan="2">民工作业单价</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.price"
                    type="number"
                    label=""
                    placeholder="请输入民工作业单价"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" rowspan="3">药</td>
                <td style="text-align: center">品牌</td>
                <td style="padding: 0">
                  <van-field
                    input-align="center"
                    v-model="detailArr.brand"
                    type="text"
                    label=""
                    placeholder="请输入品牌"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center">药量(斤/亩)</td>
                <td style="padding: 0">
                  <van-field
                    input-align="center"
                    v-model="detailArr.dose"
                    type="number"
                    label=""
                    placeholder="请输入药量"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center">药费(元/亩)</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.drugPrice"
                    type="number"
                    label=""
                    placeholder="请输入药费"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">运水费用</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.ysPrice"
                    type="number"
                    label=""
                    placeholder="请输入运水费用"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">油费</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.yPrice"
                    type="number"
                    label=""
                    placeholder="请输入油费"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">机械损耗费用</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.loss"
                    type="number"
                    label=""
                    placeholder="请输入机械损耗费用"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">民工保险费用</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.Insurance"
                    type="number"
                    label=""
                    placeholder="请输入民工保险费用"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">承揽商合理利润</td>
                <td style="padding: 0">
                  <van-field
                    @change="getSdPrice"
                    input-align="center"
                    v-model="detailArr.profit"
                    type="number"
                    label=""
                    placeholder="请输入承揽商合理利润"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align: center" colspan="2">实地单价</td>
                <td style="padding: 0">
                  <span>{{ detailArr.sdPrice || '自动带出' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </van-dialog>
    <user-picker
      :display="userSelectorShow"
      :multiple="false"
      :currentCompany="'广西竹林'"
      :title="'审核人选择'"
      :searchAppointCompany="true"
      @close="closePicker"
      @result="getUserResultHandle"
    ></user-picker>
    <date-picker :show="showDatePicker" type="date" @result="getDateResult" @close="datePickerClose" />
    <footbar>
      <van-col span="12">
        <van-button @click="doSave()" style="width: 100%; height: 40px" type="info">暂存,返回</van-button>
      </van-col>
      <van-col span="12">
        <van-button @click="doSubmit()" style="width: 100%; height: 40px" type="primary">提交</van-button>
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
import DatePicker from '@/components/DatePicker'
import UserPicker from '@/components/UserPicker'
export default {
  data() {
    return {
      style: '',
      modeDialog: false,
      showDatePicker: false,
      showDialog: false,
      areaId: null,
      userSelectorShow: false,
      currentUserPickerKey: '',
      forestries: [],
      areas: [],
      forestClasses: [],
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
          gx: null
        }
      ],
      difficultyArr: ['难', '中', '易'],
      speciesArr: ['桉树', '竹子', '松树'],
      modeArr: ['全砍(机械)', '全砍(人工)', '喷除草剂(机械)', '喷除草剂(人工)', '其他'],
      id: '',
      detailArr: {},
      seq: null,
      reviwerInfo: [],
      // form: {
      //   companyName: null,
      //   companyId: null,
      //   lcName: null,
      //   lcId: null,
      //   areaName: null,
      //   areaId: null,
      //   lbName: null,
      //   lbId: null,
      //   lbNo: null,
      //   taskArea: null,
      //   treeHight: null,
      //   remark: null,
      //   taskWay: null,
      //   treeSpecies: null,
      //   year: null,
      //   date: parseTime(new Date(), '{y}-{m}-{d}'),
      //   username: this.$store.state.appUser.userName || null,
      //   enter: this.$store.state.appUser.userName || null,
      //   difficulty: null,
      //   fbPrice: null,
      //   clPrice: null
      // },
      form: {
        companyName: null,
        companyId: null,
        lcName: '武宣林场',
        lcId: 27,
        areaName: '三里片区',
        areaId: 50,
        lbName: '双龙3',
        lbId: 127,
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
        difficulty: null,
        fbPrice: null,
        clPrice: null
      }
    }
  },
  watch: {},
  methods: {
    getReviewer() {
      this.userSelectorShow = true
    },
    closePicker() {
      this.userSelectorShow = false
    },
    getUserResultHandle(result) {
      if (result && result.users && result.users.length > 0) {
        console.log(result)
        if (result.departments[1].descShort !== '劳务部') {
          this.$dAlert(
            '当前选择审核人为' + result.departments[1].descShort + '人员,请选择劳务部人员作为审核人再进行提交'
          )
        } else {
          this.reviwerInfo = result
          this.doSubmit()
        }
      }
    },
    chooseMode() {
      this.form.taskWay = null
      this.modeDialog = false
    },
    getSdPrice() {
      this.detailArr.sdPrice =
        Number(this.detailArr.price || 0) +
        Number(this.detailArr.drugPrice || 0) +
        Number(this.detailArr.ysPrice || 0) +
        Number(this.detailArr.yPrice || 0) +
        Number(this.detailArr.loss || 0) +
        Number(this.detailArr.Insurance || 0) +
        Number(this.detailArr.profit || 0)
    },
    getAreaScale(index) {
      if (this.form.taskArea) {
        this.tableData.forEach(item => {
          if (item.area) {
            item.areaScale = ((Number(item.area) / Number(this.form.taskArea)) * 100).toFixed(2)
          }
        })
      }
      if (index || index === 0) {
        if (this.tableData[index].area && this.tableData[index].bPrice) {
          this.tableData[index].totalPrice = (
            Number(this.tableData[index].area) * Number(this.tableData[index].bPrice)
          ).toFixed(1)
          let clPrice = 0
          this.tableData.forEach(item => {
            clPrice = clPrice + (Number(item.totalPrice) || 0)
          })
          this.form.clPrice = clPrice
          this.$set(this.tableData, index, this.tableData[index])
        }
      }
    },
    confirmOne() {
      if (this.detailArr.price && this.detailArr.Insurance && this.detailArr.profit) {
        this.tableData[this.seq] = Object.assign(this.tableData[this.seq], this.detailArr)
        this.showDialog = false
      } else {
        this.$toast('请检查民工作业单价、民工保险费用、承揽商合理利润是否全部录入再进行确认')
        return false
      }
    },
    onBeforeClose(action, done) {
      if (action === 'confirm') {
        return done(false)
      } else {
        return done()
      }
    },
    add() {
      let data = { level: null }
      this.tableData.push(data)
    },
    deleteOne() {
      if (this.tableData.length > 1) {
        this.tableData.splice(this.tableData.length - 1, 1)
      } else {
        this.$toast('必须录入一条以上难度等级数据')
      }
    },
    goDetailed(item, index) {
      this.detailArr = JSON.parse(JSON.stringify(item))
      this.seq = index
      if (!this.detailArr.hasOwnProperty('sdPrice')) {
        let data = {
          price: '0',
          brand: null,
          dose: null,
          drugPrice: '0',
          ysPrice: '0',
          yPrice: '0',
          loss: '0',
          Insurance: '0',
          profit: '0',
          sdPrice: null
        }
        this.detailArr = JSON.parse(JSON.stringify(Object.assign(this.detailArr, data)))
      }
      this.showDialog = true
    },
    explain() {
      Dialog.alert({
        title: '说明',
        messageAlign: 'left',
        message:
          '1、各核价人员根据林班内杂草杂灌情况自行选择合适的除草方案填写核价表。\n2、核价组织者在核价前将表中固定单价（用药量、药费、运水费、油费、机械损耗费用、承揽商合理利润）告知核价人员。\n3、作业难度等级分易、中、难三个等级，以亩为单位，作业单价难度等级：\n①机械喷药、砍草的难度等级：预估工效在5亩以下的，定义为难；在5-7亩之间的，为中；7亩以上的，为易。\n②人工喷药作业的难度等级：预估工效在3亩以下的，定义为难；在3-4亩之间的，为中；4亩以上的，为易。\n③人工除草作业的作业单价难度等级：预估工效在2亩以下的，定义为难；在2-4亩之间的，为中；4亩以上的，为易。\n4、喷除草剂作业需填拉水面积、药量、药费运水费用等项目，其他除草方式不需填写。'
      }).then(() => {
        // on close
      })
    },
    changeMode() {
      if (this.form.taskWay === '其他') {
        this.form.taskWay = null
        this.modeDialog = true
      }
    },
    datePickerClose() {
      this.showDatePicker = false
    },
    datePickerShow(key) {
      this.showDatePicker = true
    },
    getDateResult(val) {
      this.showDatePicker = false
      this.form.date = parseTime(val, '{y}-{m}-{d}')
    },
    resetForm(index) {
      let formItemNames = ['areaName', 'lbName', 'areaId']
      formItemNames.splice(0, index)
      let obj = {}
      formItemNames.forEach(item => {
        obj[item] = null
      })
      this.areaId = ''
      this.form = Object.assign({}, this.form, obj)
    },
    resetDataArr(index) {
      let arr = ['areas', 'forestClasses']
      arr.splice(0, index)
      arr.forEach(item => {
        this[item] = []
      })
    },
    getQueryObject(formKey, arrKey) {
      let arrItemKey = ''
      switch (formKey) {
        case 'lcName':
          this.resetForm(0)
          this.resetDataArr(0)
          arrItemKey = 'lcName'
          break
        case 'areaName':
          this.resetDataArr(1)
          this.resetForm(1)
          arrItemKey = 'pqName'
          break
        case 'lbName':
          this.resetDataArr(2)
          this.resetForm(2)
          arrItemKey = 'lbName'
          break
        case 'areaId':
          this.resetDataArr(3)
          this.resetForm(3)
          arrItemKey = 'areaId'
          break
      }
      return (this[arrKey] || []).find(item => item[arrItemKey] === this.form[formKey])
    },
    selectChangeHandle(formKey, arrKey, nextArrKey, idName, checkName, checkIdName) {
      this[arrKey].forEach(item => {
        if (this.form[formKey] === item[checkName]) {
          this.form[idName] = item[checkIdName]
        }
      })
      let params = this.getQueryObject(formKey, arrKey)
      if (nextArrKey) {
        this.querySelector(params, nextArrKey)
      }
      console.log(this.form)
    },
    querySelector(params, nextArrKey) {
      this.$loadingState(true, '数据查询中')
      request
        .post(API.FOREST_JOB_SELL_APPLY_SELECT_ITEMS, params)
        .then(res => {
          this.$loadingState(false)
          let errorCode = res.data.code
          if (errorCode === 1000) {
            this[nextArrKey] = res.data.data || []
          } else {
            this.$toast(res.data.msg || '获取林场林班信息失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$toast(err.status + ':' + err.statusText || '获取林场林班信息失败')
        })
    },
    doSave() {
      this.$loadingState(true)
      this.$store.commit('SAVE_WEEDING_LAUNCH_FORM', this.form)
      this.$store.commit('SAVE_WEEDING_LAUNCH_DATA', this.tableData)
      this.$store.commit('INPUT_SHOW', this.modeDialog)
      setTimeout(this.back(), 1000)
    },
    back() {
      this.$loadingState(false)
      this.$router.go(-1)
    },
    doSubmit() {
      this.form.companyName = '广西竹林公司'
      this.form.companyId = '1'
      this.$dConfirm('确定提交表单内容吗？', () => {
        if (
          this.form.lcName &&
          this.form.lcId &&
          this.form.areaName &&
          this.form.areaId &&
          this.form.lbName &&
          this.form.lbId &&
          this.form.year &&
          this.form.treeSpecies &&
          this.form.treeHight &&
          this.form.taskWay &&
          this.form.date &&
          this.form.taskArea
        ) {
          this.$loadingState(true)
          let params = {
            formid: '_',
            apvResult: '同意',
            module: '除草核价主表录入',
            task: '除草核价主表录入',
            payload: this.form
          }
          request.post(API.DISEASES_INFO, params).then(res => {
            this.$loadingState(false)
            if (res.data.errorCode === 0) {
              this.id = res.data.data.data[0].id || ''
              if (this.id) {
                this.postDetailed()
              } else {
                console.log('未返回主键ID')
              }
            } else {
              this.$toast(res.data.msg || '提交主表失败')
            }
          })
        } else {
          this.$toast('请检查表单是否填写完整后再进行提交')
        }
      })
    },
    postDetailed() {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].hasOwnProperty('sdPrice')) {
          if (!this.tableData[i].price || !this.tableData[i].Insurance || !this.tableData[i].profit) {
            this.$toast('请检查评估单价明细是否录入完整再进行提交')
            return false
          }
        } else {
          this.$toast('请检查评估单价明细是否录入完整再进行提交')
          return false
        }
      }
      this.$loadingState(true)
      this.tableData.forEach((item, index) => {
        item.hjId = this.id
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '除草核价明细录入',
          task: '除草核价明细录入',
          payload: item
        }
        request.post(API.DISEASES_INFO, params).then(res => {
          if (index === this.tableData.length - 1) {
            this.$loadingState(false)
          }
          if (res.data.errorCode === 0) {
            if (this.tableData.length - 1 === index) {
              this.postTotal()
            }
          } else {
            this.$toast(res.data.msg || '提交明细表失败')
            return false
          }
        })
      })
    },
    postTotal() {
      if (this.id) {
        this.form.id = this.id
        this.$loadingState(true)
        let params = {
          formid: '_',
          apvResult: '同意',
          module: '除草核价主表录入2',
          task: '除草核价主表录入2',
          payload: this.form
        }
        request.post(API.DISEASES_INFO, params).then(res => {
          this.$loadingState(false)
          if (res.data.errorCode === 0) {
            // this.getReviewerInfo()
            // this.postReviewer()
            this.$toast(res.data.msg || '提交除草核价主表汇总成功')
            this.$router.go(-1)
          } else {
            this.$toast(res.data.msg || '提交除草核价主表汇总失败')
            return false
          }
        })
      } else {
        this.$toast('暂无主表ID，提交除草核价主表汇总失败')
        return false
      }
    },
    getReviewerInfo() {
      request.get(`${API.DINGTALK_DEPARTMENT_EMPLOYEE}default/1060696315648294912/15016`).then(res => {
        let errCode = res.data.errorCode
        if (errCode) {
          let data = res.data.data || []
          let employeeList = data.employeeList || []
          for (var i = 0; i < employeeList.length; i++) {
            if (employeeList[i].position === '劳务专员') {
              let empName = employeeList[i].name
              let empNo = employeeList[i].id
              this.postReviewer(empName, empNo)
              break
            }
          }
        } else {
          dAlert(res.data.msg || '查询错误！')
        }
      })
    },
    postReviewer(empName, empNo) {
      this.$loadingState(true)
      let params = {
        formid: '_',
        apvResult: '同意',
        module: '劳务专员更新保存',
        task: '劳务专员更新保存',
        payload: {
          empNo: /* this.reviwerInfo.users[0].id */ empNo,
          empName: /* this.reviwerInfo.users[0].name */ empName,
          id: this.id
        }
      }
      request.post(API.DISEASES_INFO, params).then(res => {
        this.$loadingState(false)
        if (res.data.errorCode === 0) {
          this.$toast(res.data.msg || '提交成功')
          this.$store.commit('SAVE_WEEDING_LAUNCH_FORM', null)
          this.$store.commit('SAVE_WEEDING_LAUNCH_DATA', null)
          this.$store.commit('INPUT_SHOW', false)
          this.$router.go(-1)
        } else {
          this.$toast(res.data.msg || '提交劳务专员失败')
        }
      })
    }
  },
  components: {
    Footbar,
    DatePicker,
    UserPicker
  },
  mounted() {
    this.querySelector({}, 'forestries')
    if (this.$store.state.launchForm || this.$store.state.launchData) {
      this.form = this.$store.state.launchForm || {}
      this.tableData = this.$store.state.launchData || []
      this.form.username = this.$store.state.appUser.userName || null
      this.form.enter = this.$store.state.appUser.userName || null
      this.modeDialog = this.$store.state.inputShow
    }
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
