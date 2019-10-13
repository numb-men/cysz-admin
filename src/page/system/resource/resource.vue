<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="resource" class="resource">
      <Row>
        <Col span="7">
          <Card shadow style="height: 840px;overflow: scroll;">
            <Tree :data="resource" :render="renderContent"></Tree>
          </Card>
        </Col>
        <Col span="14" offset="1">
          <Button type="success" style="margin-right: 8px;" @click="flushResourceTree" :loading="inUpdateResource">刷新系统资源</Button>
          <Button type="primary" style="margin-right: 8px;" @click="autoCreateResource" :loading="inCreateResource">生成系统资源</Button>
          <Button type="error" @click="clearAllResources" :loading="inClearResource">清空系统资源</Button>
          <Card style="margin-top: 20px;padding: 20px 50px 10px 50px;">
            <Form ref="resourceContent" :model="resourceContent" :label-width="100" :rules="rules">
              <FormItem v-if="resourceContent.id" :label="'资源编号'" prop="id">
                <iInput disabled v-model="resourceContent.id"></iInput>
              </FormItem>
              <FormItem :label="'资源名称'" prop="name">
                <iInput v-model="resourceContent.name" placeholder="请输入资源名称"></iInput>
              </FormItem>
              <FormItem :label="'资源描述'" prop="comment">
                <iInput v-model="resourceContent.comment" placeholder="请输入资源描述"></iInput>
              </FormItem>
              <FormItem :label="'资源编码'" prop="code">
                <iInput v-model="resourceContent.code" placeholder="请输入资源编码"></iInput>
              </FormItem>
              <FormItem :label="'资源图标'" prop="icon">
                <iInput v-model="resourceContent.icon" placeholder="请输入资源图标"></iInput>
              </FormItem>
              <FormItem :label="'资源类别'" prop="type">
                <iInput v-model="resourceContent.type" placeholder="请输入资源类别"></iInput>
              </FormItem>
              <FormItem :label="'父资源编码'" prop="parentCode">
                <iInput v-model="resourceContent.parentCode" placeholder="请输入父资源编码" disabled></iInput>
              </FormItem>
              <FormItem :label="'资源请求方法'" prop="method">
                <iInput v-model="resourceContent.method" placeholder="请输入资源请求方法"></iInput>
              </FormItem>
              <FormItem :label="'资源URL'" prop="url">
                <iInput v-model="resourceContent.url" placeholder="请输入资源URL"></iInput>
              </FormItem>
              <FormItem :label="'资源排序号'" prop="orderBy">
                <InputNumber v-model="resourceContent.orderBy" placeholder="请输入资源排序号"></InputNumber>
              </FormItem>
              <FormItem v-if="resourceContent.id" :label="'资源创建时间'" prop="createDate">
                <iInput v-model="resourceContent.createDate" disabled></iInput>
              </FormItem>
              <FormItem v-if="resourceContent.id" :label="'资源更新时间'" prop="url">
                <iInput v-model="resourceContent.updateDate" disabled></iInput>
              </FormItem>
              <FormItem>
                <iButton style="width: 120px;margin-right: 8px;" @click="saveResourceContent" type="primary">保存</iButton>
                <iButton style="width: 120px;" @click="resetResourceContent" type="warning">重置</iButton>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
import manage from '@/manage'

export default {
  name: 'resource',
  data () {
    return {
      inCreateResource: false,
      inClearResource: false,
      inUpdateResource: false,
      selectedNow: {},
      resourceContent: {
        id: '',
        parentId: '',
        name: '',
        comment: '',
        code: '',
        icon: '',
        type: '',
        method: '',
        url: '',
        parentCode: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      },
      rules: {
        name: [{ required: true, message: '资源名称不能为空', trigger: 'change' }],
        comment: [{ required: true, message: '资源描述不能为空', trigger: 'change' }],
        code: [{ required: true, message: '资源编码不能为空', trigger: 'change' }],
        type: [{ required: true, message: '资源类型不能为空', trigger: 'change' }],
        parentCode: [{ required: true, message: '父资源编码不能为空', trigger: 'change' }]
      },
      resource: [
        {
          title: '资源',
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
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-add',
                    type: 'primary'
                  }),
                  style: {
                    width: '64px'
                  },
                  on: {
                    click: () => { this.append(data) }
                  }
                })
              ])
            ])
          },
          children: []
        }
      ],
      buttonProps: {
        type: 'default',
        size: 'small'
      }
    }
  },
  computed: {},
  methods: {
    setResourceTreeToStore () {
      this.$store.commit('setResourceTree', this.resource[0].children)
    },
    saveResourceContent (e) {
      this.$refs.resourceContent.validate(valid => {
        if (valid) {
          if (!this.resourceContent.id) {
            // create
            this.$requests.systemResourceAddOne(this.resourceContent).then(resData => {
              this.$Message.success('新建系统资源”' + this.resourceContent.name + '“成功')
              Object.keys(resData).forEach(key => {
                this.resourceContent[key] = resData[key]
              })
              this.selectedNow = this.resourceContent
              this.setResourceTreeToStore()
            })
          } else {
            // update
            this.$requests.systemResourceUpdateOneById(
              { id: this.resourceContent.id }, this.resourceContent).then(resData => {
              this.$Message.success('更新系统资源”' + this.resourceContent.name + '“成功')
              this.setResourceTreeToStore()
            })
          }
        } else {
          this.$Notice.warning({
            title: '填写错误，请重新填写'
          })
        }
      })
    },
    changeSelect (data) {
      this.resourceContent = data
      if (this.selectedNow !== {}) {
        this.selectedNow.selected = false
      }
      data.selected = true
      data.expand = true
      this.selectedNow = data
    },
    renderContent (h, { root, node, data }) {
      let innerStyle = { cursor: 'pointer' }
      if (data.selected) {
        innerStyle['background'] = '#ccc'
      }
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
          style: innerStyle,
          on: {
            click: (e) => this.changeSelect(data)
          }
        },
        data.title
        )
      ])
      let buttons = h('span', {
        style: {
          display: 'inline-block',
          float: 'right',
          marginRight: '16px'
        }
      }, [
        h('Button', {
          props: Object.assign({}, this.buttonProps, {
            type: 'primary',
            icon: 'ios-add'
          }),
          style: {
            marginRight: '8px'
          },
          on: {
            click: () => { this.append(data) }
          }
        }),
        h('Button', {
          props: Object.assign({}, this.buttonProps, {
            type: 'error',
            icon: 'ios-remove'
          }),
          on: {
            click: () => { this.remove(root, node, data) }
          }
        })
      ])
      return h('span', {
        style: {
          display: 'inline-block',
          fontSize: '15px',
          width: '100%'
        }
      }, data.selected ? [inner, buttons] : [inner])
    },
    append (data) {
      const children = data.children || []
      children.push({
        title: '新资源',
        name: 'newResource',
        comment: '新资源',
        code: 'new.resource',
        icon: 'default-icon',
        type: 'button',
        method: '',
        url: '',
        parentCode: data.code ? data.code : 'o',
        orderBy: 0,
        createDate: '',
        updateDate: '',
        parentId: data.id ? data.id : 0,
        expand: true,
        selected: false
      })
    },
    remove (root, node, data) {
      if (!data.id) {
        // 临时资源可以直接删除
        const parentKey = root.find(el => el === node).parent
        const parent = root.find(el => el.nodeKey === parentKey).node
        const index = parent.children.indexOf(data)
        parent.children.splice(index, 1)
        return
      }
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要删除名称为”' + data.name + '“的资源吗，这将同时删除其子资源，在系统运行时删除资源，可能会导致系统无法运行',
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.$requests.systemResourceDeleteByIdCascade({ id: data.id }).then(resData => {
            const parentKey = root.find(el => el === node).parent
            const parent = root.find(el => el.nodeKey === parentKey).node
            const index = parent.children.indexOf(data)
            parent.children.splice(index, 1)
            this.$Message.success('已删除名称为”' + data.name + '“的资源')
            this.setResourceTreeToStore()
          })
        }
      })
    },
    autoCreateResource () {
      this.inCreateResource = true
      this.$requests.systemResourceCreate().then(resData => {
        this.inCreateResource = false
        manage.resource.updateResourceTree()
          .then(rt => this.resource[0].children = rt)
        this.$Message.success('系统资源生成成功')
      })
    },
    clearAllResources () {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要清空吗，在系统运行时清空资源，可能会导致系统无法运行',
        okText: '取消',
        cancelText: '继续清空',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.inClearResource = true
          manage.resource.clearResourceTree().then(resData => {
            this.inClearResource = false
            this.resource[0].children = []
            this.$Message.success('系统资源清空成功')
          })
        }
      })
    },
    flushResourceTree () {
      this.inUpdateResource = true
      manage.resource.updateResourceTree()
        .then(rt => {
          this.resource[0].children = rt
          this.inUpdateResource = false
          this.$Message.success('系统资源刷新成功')
        })
    },
    resetResourceContent () {
      this.resourceContent = {
        id: '',
        parentId: '',
        name: '',
        comment: '',
        code: '',
        icon: '',
        type: '',
        method: '',
        url: '',
        parentCode: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      }
    }
  },
  created () {
    manage.resource.createResourceTree()
      .then(rt => this.resource[0].children = rt)
  }
}
</script>
