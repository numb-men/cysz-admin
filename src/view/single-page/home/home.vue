<!--suppress ALL -->
<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(key, i) in infoCardKeys" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infoCardData[key].color" :icon="infoCardData[key].icon" :icon-size="36">
          <count-to :end="infoCardData[key].count" count-class="count-style"/>
          <p>{{ infoCardData[key].title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="订单菜品占比"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  computed: {
    infoCardKeys () {
      return Object.keys(this.infoCardData)
    }
  },
  data () {
    return {
      infoCardData: {
        userAddNumToday: { title: '新增用户', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        clickAddNumToday: { title: '今日点击', icon: 'md-locate', count: 0, color: '#19be6b' },
        orderAddNumToday: { title: '新增订单', icon: 'ios-paper-outline', count: 0, color: '#ff9900' },
        orderNumAll: { title: '累计订单', icon: 'ios-paper-outline', count: 0, color: '#ed3f14' },
        earningsToday: { title: '今日收益', icon: 'ios-calculator-outline', count: 0, color: '#E46CBB' },
        earningsAll: { title: '累计收益', icon: 'ios-calculator-outline', count: 0, color: '#9A66E4' }
      },
      pieData: [
        { value: 1, name: '初始化中' }
      ],
      barData: {
        '星期一': 0,
        '星期二': 0,
        '星期三': 0,
        '星期四': 0,
        '星期五': 0,
        '星期六': 0,
        '星期日': 0
      }
    }
  },
  created () {
    this.$requests.cyszStatsView().then(res => {
      Object.keys(res).forEach(key => {
        this.infoCardData[key]['count'] = res[key]
      })
    })
    this.$requests.cyszStatsOrderPie().then(res => {
      this.pieData = []
      res.forEach(vo => {
        this.pieData.push({
          name: vo.foodName,
          value: vo.sellNum
        })
      })
      console.log(this.pieData)
    })
    this.$requests.cyszStatsGetWeekReqBar().then(res => {
      res.forEach(vo => {
        this.barData[vo.name] = vo.reqNum
      })
      this.barData = JSON.parse(JSON.stringify(this.barData))
    })
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
