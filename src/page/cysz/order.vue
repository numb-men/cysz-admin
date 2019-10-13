<style scoped>
  .orderDetail {
    margin: 0 15%;
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
    width: 305px;
    height: 30px;
  }
  .phone {
    padding-bottom: 20px;
    margin-bottom: 30px;
    border-bottom: 2px solid #eee;
  }
  .allPrice {
    padding-bottom: 20px;
    margin-top: 30px;
    border-top: 2px solid #eee;
  }
  .orderItem {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 10px 0;
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
          <h2 class="phone"><span>食客电话</span>{{orderDetail.cyszUser.mobile}}</h2>

          <div class="orderItem" v-for="item of orderDetail.orderItems">
            <img style="width: 50px;height: 35px;" alt :src="item.food.image">
            <h3 style="line-height: 35px;">{{item.food.title}} * {{item.num}}</h3>
            <h3 style="margin-right: 20px;line-height: 35px;">￥{{item.price}}</h3>
          </div>

          <h2 class="allPrice"><span>订单总价</span>￥{{orderDetail.allPrice}}</h2>
        </div>
      </Row>
      <Row slot="footer" type="flex" justify="end" align="middle">
        <Button :disabled="orderDetail.status !== '订单配送中'" style="margin-right: 8px;" @click="arived">确认送达</Button>
        <Button type="primary" @click="closeDetail">关闭</Button>
      </Row>
    </Modal>
    <div id="order" class="order">
      <Row>
        <iCol span="6" v-for="order in orders" style="padding:10px;" :key="order.id">
          <Card style="width: 350px;">
            <div style="text-align:center" v-on:click="showDetail(order.id)">
              <div style="position:absolute; right:5px; top:5px; cursor:pointer;"
                   v-on:click.stop="deleteOrder(order.id, $event)">
                <Icon type="md-close" size="20"></Icon>
              </div>
              <img alt style="width: 230px;height: 140px;" :src="order.orderItems[0].food.image">
              <Row>
                <h3>{{order.content}}：￥{{order.allPrice}}：{{order.status}}</h3>
              </Row>
            </div>
          </Card>
        </iCol>
      </Row>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'order',
  data () {
    return {
      showOrder: false,
      orderDetail: {},
      orders: [

      ]
    }
  },
  computed: {},
  methods: {
    showDetail (id) {
      for (let order of this.orders) {
        if (order.id === id) {
          this.orderDetail = order
          break
        }
      }
      this.showOrder = true
    },
    closeDetail () {
      this.showOrder = false
    },
    arived () {
      this.$requests.orderArrived({ id: this.orderDetail.id }).then(res => {
        for (let i = 0; i < this.orders.length; i++) {
          let order = this.orders[i]
          if (order.id === this.orderDetail.id) {
            let allNum = 0
            for (let item of res.orderItems) {
              allNum += item.num
            }
            res.content = res.orderItems[0].food.title +
              (allNum === 1 ? '' : `等${allNum}件`)
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
            let orders = []
            for (let order of this.orders) {
              if (order.id !== id) {
                orders.push(order)
              }
            }
            this.orders = orders
          })
        }
      })
    },
    search () {
      this.$requests.orderFindAll().then(res => {
        for (let order of res) {
          let allNum = 0
          for (let item of order.orderItems) {
            allNum += item.num
          }
          order.content = order.orderItems[0].food.title +
            (allNum === 1 ? '' : `等${allNum}件`)

          this.orders.push(order)
        }

        if (res.length > 0) {
          this.orderDetail = res[0]
        }
      })
    }
  },
  created () {
    this.orders = []
    this.search()
  }
}
</script>
