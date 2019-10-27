<style scoped>
  .orderDetail {
    margin: 0 30px;
  }
  .orderDetail h2 {
    display: flex;
    flex-direction: row;
    justify-content: left;
    margin-left: 40px;
    padding: 5px 0;
  }
  .orderDetail h2 span {
    display: block;
    width: 350px;
    height: 30px;
  }
  .split {
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 2px solid #dfdfdf;
  }
  .allPrice {
    padding-bottom: 20px;
    margin-top: 30px;
    border-top: 2px solid #dfdfdf;
  }
  .orderItem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px 40px;
  }
</style>
<template>
  <Card shadow style="height: 100%;width: 100%;overflow: scroll;">
    <Modal v-if="orderDetail !== {}" v-model="showOrder" width="35%">
      <p slot="header">查看订单</p>
      <Row class="margin-top-10" :style="{width: '100%', 'max-height': '520px'}">
        <div class="orderDetail">
          <h2><span>订单编号</span>{{orderDetail.id}}</h2>
          <h2><span>订单状态</span>{{orderDetail.status}}</h2>
          <h2><span>食客用户名</span>{{orderDetail.cyszUser.username}}</h2>
          <h2><span>食客电话</span>{{orderDetail.cyszUser.mobile}}</h2>
          <h2 class="split"><span>下单时间</span>{{orderDetail.createDate}}</h2>

          <div class="orderItem" v-for="item of orderDetail.orderItems">
            <img style="width: 50px;height: 35px;" alt :src="item.food.image">
            <h3 style="line-height: 35px;width: 350px;">{{item.food.title}} x {{item.num}}</h3>
            <h3 style="margin-right: 20px;line-height: 35px;">￥{{item.price}}</h3>
          </div>

          <h2 class="allPrice">
            <span style="width: 450px">订单总价</span> ￥{{orderDetail.allPrice}}
          </h2>
        </div>
      </Row>
      <Row slot="footer" type="flex" justify="end" align="middle">
        <Button :disabled="orderDetail.status !== '订单配送中'" style="margin-right: 8px;" @click="arrived">确认送达</Button>
        <Button type="primary" @click="closeDetail">关闭</Button>
      </Row>
    </Modal>

    <div id="order" class="order">
      <Row>
        <iCol span="14">
          <Input v-model="searchInput" icon="ios-search"
                 placeholder="输入姓名、电话、邮箱进行搜索.." @on-enter="search"/>
        </iCol>
        <iCol span="6">
          <Button type="primary" style="margin: 0 8px 0 16px" @click="search">查询用户</Button>
        </iCol>
      </Row>
      <div style="text-align:center;margin: 20px 10px;">
        <Row :gutter="16">
          <Table :columns="columns" :data="orders"/>
        </Row>
        <Page style="margin-top: 8px;"
              :total="dataCount" :page-size="pageSize" @on-change="handlePageChange" show-total/>
      </div>
    </div>

  </Card>
</template>

<script>
import { timestampFormat } from '@/utils'

export default {
  name: 'order',
  data () {
    return {
      showOrder: false,
      orderDetail: {
        cyszUser: {},
        orderItems: []
      },
      orders: [],
      dataCount: 0,
      pageSize: 10,
      currentPageNum: 0,
      searchInput: '',
      columns: [
        {
          key: 'id',
          title: '主键',
          width: 120
        },
        {
          key: 'username',
          title: '客户',
          width: 120
        },
        {
          key: 'mobile',
          title: '客户手机号'
        },
        {
          key: 'foodNum',
          title: '菜品数',
          width: 100
        },
        {
          key: 'content',
          title: '详情',
          width: 380
        },
        {
          key: 'allPrice',
          title: '订单总价'
        },
        {
          key: 'createDate',
          title: '下单时间'
        },
        {
          key: 'status',
          title: '订单状态'
        },
        {
          title: '操作',
          align: 'center',
          width: 190,
          key: 'handle',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.showDetail(params.row.id)
                    }
                  }
                },
                '查看'
              ),
              h(
                'Button',
                {
                  style: {
                    margin: '0 5px'
                  },
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.deleteOrder(params.row.id)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    searchForm () {
      return {
        username: this.searchInput,
        mobile: this.searchInput,
        status: this.searchInput
      }
    }
  },
  methods: {
    handlePageChange (pageNum) {
      this.currentPageNum = pageNum - 1
      this.search()
    },
    showDetail (id) {
      for (let order of this.orders) {
        if (order.id === id) {
          this.orderDetail = order.orderDetail
          break
        }
      }
      this.showOrder = true
    },
    closeDetail () {
      this.showOrder = false
    },
    arrived () {
      this.$requests.orderArrived({ id: this.orderDetail.id }).then(res => {
        for (let i = 0; i < this.orders.length; i++) {
          let order = this.orders[i]
          if (order.id === this.orderDetail.id) {
            this.$set(this.orders, i, res)
            this.showOrder = false
          }
        }
        this.$Message.info('已确认送达')
      })
    },
    deleteOrder (id) {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要删除该订单吗',
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.$requests.orderDeleteOneById({ id }).then(res => {
            this.$Message.success('删除成功')
            this.search()
          })
        }
      })
    },
    search (reset) {
      if (reset) {
        this.currentPageNum = 0
      }
      this.$requests.orderSearch({
          pageNumber: this.currentPageNum,
          pageSize: this.pageSize
        }, this.searchForm)
        .then(res => {
          this.orders = res.content
          for (let order of this.orders) {
            order.createDate = timestampFormat(order.createDate)
            order.allPrice = order.allPrice + '元'
          }
          this.orderDetail = this.orders.length > 0 ? this.orders[0].orderDetail : {}
          this.dataCount = res.totalElements
        })
    }
  },
  created () {
    this.orders = []
    this.search()
  }
}
</script>
