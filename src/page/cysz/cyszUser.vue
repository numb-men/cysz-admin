<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <Modal v-model="showDetail" width="30%">
      <p slot="header">编辑用户</p>
      <Row class="margin-top-10" :style="{width: '100%', height: '200px'}">
        <iForm ref="userDetail" :model="userDetail" :label-width="70" :rules="rules">
          <Row type="flex" justify="center" :gutter="16">
            <iCol span="22">
              <FormItem prop="username" label="用户名">
                <iInput type="text" v-model="userDetail.username" placeholder="请输入用户名">
                  <Icon type="md-person" size="14" slot="prepend"></Icon>
                </iInput>
              </FormItem>
            </iCol>
            <iCol span="22">
              <FormItem prop="mobile" label="手机">
                <Input type="text" v-model="userDetail.mobile" placeholder="请输入手机">
                  <Icon type="md-call" size="14" slot="prepend"></Icon>
                </Input>
              </FormItem>
            </iCol>
            <iCol span="22">
              <FormItem prop="balance" label="余额">
                <InputNumber type="text" v-model="userDetail.balance" placeholder="请输入余额">
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
    <div id="cyszUser" class="cyszUser">
      <Row>
        <iCol span="14">
          <Input v-model="searchInput" icon="ios-search"
                 placeholder="输入姓名、电话、进行搜索.." @on-enter="search"/>
        </iCol>
        <iCol span="6">
          <Button type="primary" style="margin: 0 8px 0 16px" @click="search">查询用户</Button>
          <Button type="primary" @click="createNewUser">新建用户</Button>
        </iCol>
      </Row>
      <div style="text-align:center;margin: 20px 10px;">
        <Row :gutter="16">
          <Table :columns="columns" :data="users"/>
        </Row>
        <Page style="margin-top: 8px;"
              :total="dataCount" :page-size="pageSize" @on-change="handlePageChange" show-total/>
      </div>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'cyszUser',
  data () {
    return {
      searchInput: '',
      currentPageNum: 0,
      dataCount: 0,
      pageSize: 10,
      users: [],
      showDetail: false,
      userDetail: {
        id: '',
        username: '',
        mobile: '',
        balance: 0
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        balance: [{ required: true, type: 'number', message: '余额不能为空', trigger: 'change' }]
      },
      columns: [
        {
          key: 'id',
          title: '主键'
        },
        {
          key: 'username',
          title: '用户名'
        },
        {
          key: 'mobile',
          title: '手机'
        },
        {
          key: 'balance',
          title: '余额'
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
                      this.editUser(params.row)
                    }
                  }
                },
                '编辑'
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
                      this.deleteUser(params.row._index, params.row.id)
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
        mobile: this.searchInput
      }
    }
  },
  methods: {
    reset () {
      this.userDetail = {
        id: '',
        username: '',
        mobile: '',
        balance: 0
      }
      this.$refs.userDetail.resetFields()
    },
    save () {
      this.$refs.userDetail.validate(valid => {
        if (valid) {
          if (this.userDetail.id) {
            this.$requests.cyszUserUpdateDetail(this.userDetail)
              .then(res => {
                this.$Message.success({
                  content: '更新成功',
                  onClose: () => this.showDetail = false
                })
                this.search()
              })
          } else {
            this.$requests.cyszUserSaveDetail(this.userDetail)
              .then(res => {
                this.$Message.success({
                  content: '新增成功',
                  onClose: () => this.showDetail = false
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
    search (reset) {
      if (reset) {
        this.currentPageNum = 0
      }
      this.$manage.cyszUser.search(this.currentPageNum, this.pageSize, this.searchForm)
        .then(({ users, total }) => {
          this.users = users
          this.dataCount = total
        })
    },
    createNewUser () {
      this.reset()
      this.showDetail = true
    },
    deleteUser (index, id) {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要删除该用户吗',
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.$requests.cyszUserDeleteOneById({ id }).then(resData => {
            this.$Message.success('删除成功')
            this.search()
          })
        }
      })
    },
    editUser (row) {
      console.log(row)
      this.showDetail = true
      this.userDetail = {
        id: row.id,
        username: row.username,
        mobile: row.mobile,
        balance: row.balance
      }
    },
    handlePageChange (pageNum) {
      this.currentPageNum = pageNum - 1
      this.search()
    }
  },
  created () {
    this.search()
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'cyszUser') {
        this.search()
      }
    }
  }
}
</script>
