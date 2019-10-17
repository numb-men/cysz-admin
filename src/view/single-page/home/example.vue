<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null,
      series: [
        {
          name: '空',
          type: 'line',
          stack: '销量',
          areaStyle: { normal: {
            color: '#2d8cf0'
          } },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '空',
          type: 'line',
          stack: '销量',
          areaStyle: { normal: {
            color: '#10A6FF'
          } },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '空',
          type: 'line',
          stack: '销量',
          areaStyle: { normal: {
            color: '#0C17A6'
          } },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '空',
          type: 'line',
          stack: '销量',
          areaStyle: { normal: {
            color: '#4608A6'
          } },
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: '空',
          type: 'line',
          stack: '销量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          areaStyle: { normal: {
            color: '#398DBF'
          } },
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    init () {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.series
      }
      this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom)
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.$requests.cyszStatsFoodWeekStats().then(res => {
      console.log(res)
      // foodName: "烤韭菜"
      // foodWeekSellNum: (7) [2, 0, 0, 0, 0, 0, 0]
      let seriesData = []
      for (let i in res) {
        let foodWeekStat = res[i]
        let dataModel = this.series[i]
        dataModel.name = foodWeekStat.foodName
        dataModel.data = foodWeekStat.foodWeekSellNum
        seriesData.push(dataModel)
      }
      this.series = seriesData
      this.init()
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
