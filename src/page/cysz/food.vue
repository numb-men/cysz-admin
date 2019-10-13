<template>
  <Card shadow style="height: 100%;width: 100%;overflow: scroll;">
    <Modal v-model="showFood" width="35%">
      <p slot="header">编辑菜品</p>
      <Row class="margin-top-10" :style="{width: '100%', 'max-height': '520px'}">
        <iForm ref="foodDetail" :model="foodDetail" :label-width="70" :rules="rules">
          <Row type="flex" justify="center" :gutter="16">
            <iCol span="22">
              <Upload type="drag" :format="['jpg','jpeg','png']"
                      :max-size="2048" :action="uploadUrl"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :show-upload-list="false"
                      :headers="uploadHeader" :on-success="uploadSucceed">
                <div style="padding: 20px 0">
                  <Icon v-if="!foodDetail.image" type="ios-cloud-upload" size="62" style="color: #3399ff"></Icon>
                  <img v-else alt :src="foodDetail.image" style="width: 80%;max-height: 300px;" >
                  <p>点击或将图片拖拽到这里上传</p>
                </div>
              </Upload>
            </iCol>
            <iCol span="22">
              <FormItem prop="title" label="菜品名称">
                <Input type="text" v-model="foodDetail.title" placeholder="请输入菜品名称">
                  <Icon type="md-call" size="14" slot="prepend"></Icon>
                </Input>
              </FormItem>
            </iCol>
            <iCol span="22">
              <FormItem prop="detail" label="菜品简介">
                <Input type="text" v-model="foodDetail.detail" placeholder="请输入菜品简介">
                  <Icon type="md-call" size="14" slot="prepend"></Icon>
                </Input>
              </FormItem>
            </iCol>
            <iCol span="22">
              <FormItem prop="price" label="价格">
                <InputNumber type="text" v-model="foodDetail.price" placeholder="请输入菜品价格">
                </InputNumber>
              </FormItem>
            </iCol>
          </Row>
        </iForm>
      </Row>
      <Row slot="footer" type="flex" justify="end" align="middle">
        <Button style="margin-right: 8px;" @click="reset">重置</Button>
        <Button type="primary" @click="save">保存</Button>
      </Row>
    </Modal>
    <div id="food" class="food">
      <Row>
        <iCol span="6" v-for="food in foods" style="padding:10px;" :key="food.id">
          <Card style="width: 350px;">
            <div style="text-align:center" v-on:click="showDetail(food.id)">
              <div style="position:absolute; right:5px; top:5px; cursor:pointer;"
                   v-on:click.stop="deleteFood(food.id, $event)">
                <Icon type="md-close" size="20"></Icon>
              </div>
              <img alt style="width: 230px;height: 140px;" :src="food.image">
              <Row>
                <h3>{{food.title}}：￥{{food.price}}</h3>
              </Row>
            </div>
          </Card>
        </iCol>
        <iCol span="6" style="padding:10px;">
          <Card style="width: 350px;padding: 47px;">
            <div style="text-align:center" v-on:click="newFood">
              <Icon type="ios-add" size="50"></Icon>
              <h3>新增</h3>
            </div>
          </Card>
        </iCol>
      </Row>
    </div>
  </Card>
</template>

<script>
import { root } from '@/request/api'

export default {
  name: 'food',
  data () {
    return {
      uploadUrl: '',
      showFood: false,
      uploadHeader: {},
      foodDetail: {
        id: 0,
        title: '',
        image: '',
        detail: '',
        price: 0
      },
      rules: {
        title: [{ required: true, message: '菜品名称不能为空', trigger: 'change' }],
        detail: [{ required: true, message: '菜品简介不能为空', trigger: 'change' }],
        price: [{ required: true, type: 'number', message: '菜品价格不能为空', trigger: 'change' }],
        image: [{ required: true, message: '菜品图片不能为空', trigger: 'change' }]
      },
      foods: [
      ]
    }
  },
  computed: {},
  methods: {
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
    },
    reset () {
      this.foodDetail = {
        id: 0,
        title: '',
        image: '',
        detail: '',
        price: 0
      }
      this.$refs.foodDetail.resetFields()
    },
    checkRename (name) {
      for (let food of this.foods) {
        if (food.title === name) {
          return true
        }
      }
      return false
    },
    save () {
      if (this.checkRename(this.foodDetail.title)) {
        this.$Message.warning('已经有了重名菜品，请修改名称！')
        return
      }
      this.$refs.foodDetail.validate(valid => {
        if (valid) {
          if (this.foodDetail.id) {
            console.log(this.foodDetail)
            this.$requests.foodUpdateOneById({ id: this.foodDetail.id }, this.foodDetail)
              .then(res => {
                this.$Message.success({
                  content: '更新成功',
                  onClose: () => this.showFood = false
                })
                this.search()
              })
          } else {
            this.$requests.foodAddOne(this.foodDetail)
              .then(res => {
                this.$Message.success({
                  content: '新增成功',
                  onClose: () => this.showFood = false
                })
                this.search()
              })
          }
        } else {
          this.$Notice.warning({
            title: '填写错误，请重新填写'
          })
        }
      })
    },
    showDetail (id) {
      for (let food of this.foods) {
        if (food.id === id) {
          this.foodDetail = JSON.parse(JSON.stringify(food))
          break
        }
      }
      this.showFood = true
    },
    deleteFood (id, e) {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要删除该菜品吗',
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.$requests.foodDeleteOneById({ id }).then(res => {
            this.$Message.success('删除成功')
            let foods = []
            for (let food of this.foods) {
              if (food.id !== id) {
                foods.push(food)
              }
            }
            this.foods = foods
          })
        }
      })
    },
    uploadSucceed (res) {
      this.foodDetail.image = root + res.data
    },
    newFood () {
      this.reset()
      this.showFood = true
    },
    search () {
      this.$requests.foodFindAll().then(res => {
        this.foods = res
      })
    }
  },
  created () {
    this.uploadUrl = root + '/system/file/upload'
    this.uploadHeader = {
      charset: 'UTF-8',
      token: localStorage['token']
    }
    this.search()
  }
}
</script>
