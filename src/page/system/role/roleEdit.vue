<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="roleEdit" class="roleEdit">
      <Row>
        <Col span="7">
          <Card  shadow style="height: 820px;overflow: scroll;">
            <Tree ref="resourceTree" v-on:on-check-change="resourcesCheckChange" show-checkbox :data="resource" :render="renderContent"></Tree>
          </Card>
        </Col>
        <Col span="14" offset="1">
          <Card style="margin-top: 20px;padding: 40px 50px 10px 50px;">
            <Form ref="roleContent" :model="roleContent" :label-width="90" :rules="rules">
              <FormItem v-if="roleContent.id" label="角色编号" prop="id">
                <iInput v-model="roleContent.id" disabled></iInput>
              </FormItem>
              <FormItem label="角色名称" prop="name">
                <iInput v-model="roleContent.name" placeholder="请输入角色名称"></iInput>
              </FormItem>
              <FormItem label="角色图标" prop="icon">
                <iInput v-model="roleContent.icon" placeholder="请输入角色图标"></iInput>
              </FormItem>
              <FormItem v-if="roleContent.id" label="角色创建时间" prop="createDate">
                <iInput v-model="roleContent.createDate" disabled></iInput>
              </FormItem>
              <FormItem v-if="roleContent.id" label="角色更新时间" prop="url">
                <iInput v-model="roleContent.updateDate" disabled></iInput>
              </FormItem>
              <FormItem style="padding-top: 15px;">
                <Button style="width: 120px;margin-right: 8px;" @click="saveRole" type="primary">保存</Button>
                <Button style="width: 120px;" @click="resetRole">重置</Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'roleEdit',
  data () {
    return {
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'change' }],
        icon: [{ required: true, message: '角色图标不能为空', trigger: 'change' }]
      },
      roleContent: {
        id: '',
        name: '',
        icon: '',
        createDate: '',
        updateDate: ''
      },
      selectedNow: {},
      resource: []
    }
  },
  computed: {
  },
  methods: {
    resetResource () {
      this.resource = [
        {
          title: '角色资源',
          expand: true,
          render: (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%',
                fontSize: '16px'
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-folder-outline'
                  },
                  style: {
                    marginRight: '8px',
                    fontSize: '26px'
                  }
                }),
                h('span', { style: { cursor: 'pointer' } }, data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '16px'
                }
              })
            ])
          },
          children: []
        }
      ]
    },
    resourcesCheckChange (checkedNodes, node) {
      this.$manage.resource.traverseResourceTree(node, n => {
        n.expand = n.checked
      })
    },
    resetRole () {
      this.$manage.resource.traverseResourceTree(this.resource[0], node => {
        node.checked = false
        node.indeterminate = false
      })
      this.$set(this.resource, 0, this.resource[0])
      this.roleContent = {
        id: '',
        name: '',
        icon: '',
        createDate: '',
        updateDate: ''
      }
    },
    setResource () {
      let resources = this.$refs.resourceTree.getCheckedNodes()
      let resourcesId = []
      for (let resource of resources) {
        resourcesId.push(resource.id)
      }
      this.roleContent['resourcesId'] = resourcesId
    },
    saveRole () {
      this.$refs.roleContent.validate(valid => {
        if (valid) {
          this.setResource()
          let id = this.roleContent.id
          if (id) {
            this.$manage.role.updateOneById(id, this.roleContent).then(resData => {
              this.$Message.success({
                content: '角色更新成功',
                onClose: () => this.$store.commit('closeTag', this.$route)
              })
            })
          } else {
            this.$manage.role.createRole(this.roleContent).then(resData => {
              this.roleContent = resData
              this.$Message.success({
                content: '角色创建成功',
                onClose: () => this.$store.commit('closeTag', this.$route)
              })
            })
          }
        } else {
          this.$Notice.warning({
            title: '填写错误，请重新填写'
          })
        }
      })
    },
    renderContent (h, { root, node, data }) {
      let inner = h('span', [
        h('Icon', {
          props: {
            type: 'ios-paper-outline'
          },
          style: {
            marginRight: '8px',
            fontSize: '22px'
          }
        }),
        h('span', {
          style: { cursor: 'pointer' },
          on: {
            click: (e) => this.changeSelect(data)
          }
        },
        data.title
        )
      ])
      return h('span', {
        style: {
          display: 'inline-block',
          fontSize: '15px',
          width: '100%'
        }
      }, [inner])
    },
    changeSelect (data) {
      if (this.selectedNow !== {}) {
        this.selectedNow.selected = false
      }
      data.selected = true
      data.expand = true
      this.selectedNow = data
    },
    resetResourcesId (resourcesId) {
      resourcesId = resourcesId || []
      this.$manage.resource.createResourceTree()
        .then(rt => {
          // reset or init
          for (let rtt of rt) {
            this.$manage.resource.traverseResourceTree(rtt, node => {
              let found = false
              for (let resourceId of resourcesId) {
                if (resourceId === node.id) {
                  node.checked = true
                  node.expand = true
                  found = true
                  break
                }
              }
              if (!found) {
                node.checked = false
                node.expand = false
                node.indeterminate = false
              }
            })
          }
          this.resource[0].children = rt
        })
    },
    init (inCreat) {
      if (!inCreat) {
        this.selectedNow = {}
        this.roleContent = {
          id: '',
          name: '',
          icon: '',
          createDate: '',
          updateDate: ''
        }
        this.$refs.roleContent.resetFields()
      }
      this.resetResource()
      let id = this.$route.params.id
      if (id) {
        this.$requests.systemRoleView({ id }).then(resData => {
          this.roleContent = resData
          let resourcesId = resData.resourcesId
          this.resetResourcesId(resourcesId)
        })
      } else {
        this.resetResourcesId()
      }
    }
  },
  created () {
    this.init(true)
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'roleNew' || newRoute.name === 'roleEdit') {
        this.init()
      }
    }
  }
}
</script>
