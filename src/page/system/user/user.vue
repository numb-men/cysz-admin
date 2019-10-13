<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="user" class="user">
      <Row>
        <iCol span="14">
          <Input v-model="searchInput" icon="ios-search"
                 placeholder="输入姓名、电话、邮箱进行搜索.." @on-enter="search"/>
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
  name: 'user',
  data () {
    return {
      searchInput: '',
      currentPageNum: 0,
      dataCount: 0,
      pageSize: 10,
      users: [],
      columns: [
        {
          key: 'id',
          title: '主键'
        },
        {
          key: 'name',
          title: '用户名'
        },
        {
          key: 'realName',
          title: '真实姓名'
        },
        {
          key: 'sex',
          title: '性别'
        },
        {
          key: 'age',
          title: '年龄'
        },
        {
          key: 'mobile',
          title: '手机'
        },
        {
          key: 'email',
          title: '电子邮件'
        },
        {
          key: 'lastLogin',
          title: '最后登录时间'
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
                      this.editUser(params.row.id)
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
        realName: this.searchInput,
        mobile: this.searchInput,
        email: this.searchInput
      }
    }
  },
  methods: {
    search (reset) {
      if (reset) {
        this.currentPageNum = 0
      }
      this.$manage.user.searchDetailList(this.currentPageNum, this.pageSize, this.searchForm)
        .then(({ users, total }) => {
          this.users = users
          this.dataCount = total
        })
    },
    createNewUser () {
      this.$router.push({ name: 'userNew' })
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
          this.$manage.user.deleteUser(id).then(resData => {
            this.$Message.success('删除成功')
          })
        }
      })
    },
    editUser (id) {
      this.$router.push({ name: 'userEdit', params: { id } })
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
      if (newRoute.name === 'user') {
        this.search()
      }
    }
  }
}
</script>
