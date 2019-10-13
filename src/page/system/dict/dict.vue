<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="dict" class="dict">
      <Row>
        <iCol span="7">
          <Card shadow style="height: 840px;overflow: scroll;">
            <Tree :data="dict" :render="renderContent"></Tree>
          </Card>
        </iCol>
        <iCol span="14" offset="1">
          <Button type="success" style="margin-right: 8px;" @click="flushDictTree" :loading="inUpdateDict">刷新系统字典</Button>
          <Button type="primary" style="margin-right: 8px;" @click="autoCreateDict" :loading="inCreateDict">生成系统字典</Button>
          <Button type="error" @click="clearAllDict" :loading="inClearDict">清空系统字典</Button>
          <Card style="margin-top: 20px;padding: 20px 50px 10px 50px;">
            <iForm v-if="!isSelectDictItem" ref="dictContent" :model="dictContent" :label-width="120" :rules="dictRules">
              <FormItem v-if="dictContent.id" :label="'字典编号'" prop="id">
                <iInput disabled v-model="dictContent.id"></iInput>
              </FormItem>
              <FormItem :label="'字典名称'" prop="name">
                <iInput v-model="dictContent.name" placeholder="请输入字典名称"></iInput>
              </FormItem>
              <FormItem :label="'字典描述'" prop="comment">
                <iInput v-model="dictContent.comment" placeholder="请输入字典描述"></iInput>
              </FormItem>
              <FormItem :label="'字典图标'" prop="icon">
                <iInput v-model="dictContent.icon" placeholder="请输入字典图标"></iInput>
              </FormItem>
              <FormItem :label="'字典排序号'" prop="orderBy">
                <InputNumber v-model="dictContent.orderBy" placeholder="请输入资源排序号"></InputNumber>
              </FormItem>
              <FormItem v-if="dictContent.id" :label="'字典创建时间'" prop="createDate">
                <iInput v-model="dictContent.createDate" disabled></iInput>
              </FormItem>
              <FormItem v-if="dictContent.id" :label="'字典更新时间'" prop="url">
                <iInput v-model="dictContent.updateDate" disabled></iInput>
              </FormItem>
              <FormItem>
                <iButton style="width: 120px;margin-right: 8px;" @click="saveDictContent" type="primary">保存</iButton>
                <iButton style="width: 120px;" @click="resetDictContent" type="warning">重置</iButton>
              </FormItem>
            </iForm>
            <iForm v-if="isSelectDictItem" ref="dictItemContent" :model="dictItemContent" :label-width="120" :rules="dictItemRules">
              <FormItem v-if="dictItemContent.id" :label="'字典项编号'" prop="id">
                <iInput disabled v-model="dictItemContent.id"></iInput>
              </FormItem>
              <FormItem :label="'字典项的值'" prop="value">
                <iInput v-model="dictItemContent.value" placeholder="请输入字典项的值"></iInput>
              </FormItem>
              <FormItem :label="'字典项的值索引'" prop="valueIndex">
                <InputNumber :min="1" v-model="dictItemContent.valueIndex" placeholder="请输入字典项的值索引"></InputNumber>
              </FormItem>
              <FormItem :label="'字典项图标'" prop="icon">
                <iInput v-model="dictItemContent.icon" placeholder="请输入字典项图标"></iInput>
              </FormItem>
              <FormItem :label="'字典项排序号'" prop="orderBy">
                <InputNumber v-model="dictItemContent.orderBy" placeholder="请输入字典项排序号"></InputNumber>
              </FormItem>
              <FormItem v-if="dictItemContent.id" :label="'字典项创建时间'" prop="createDate">
                <iInput v-model="dictItemContent.createDate" disabled></iInput>
              </FormItem>
              <FormItem v-if="dictItemContent.id" :label="'字典项更新时间'" prop="url">
                <iInput v-model="dictItemContent.updateDate" disabled></iInput>
              </FormItem>
              <FormItem>
                <iButton style="width: 120px;margin-right: 8px;" @click="saveDictItemContent" type="primary">保存</iButton>
                <iButton style="width: 120px;" @click="resetDictItemContent" type="warning">重置</iButton>
              </FormItem>
            </iForm>
          </Card>
        </iCol>
      </Row>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'dict',
  data () {
    return {
      inUpdateDict: false,
      inCreateDict: false,
      inClearDict: false,
      selectedNow: {},
      isSelectDictItem: false,
      dictRules: {
        name: [{ required: true, message: '字典名称不能为空', trigger: 'change' }],
        comment: [{ required: true, message: '字典描述不能为空', trigger: 'change' }]
      },
      dictItemRules: {
        value: [{ required: true, message: '字典项的值不能为空', trigger: 'change' }],
        valueIndex: [{ type: 'number', required: true, message: '字典项的值索引不能为空', trigger: 'change' }]
      },
      dictContent: {
        id: '',
        name: '',
        comment: '',
        icon: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      },
      dictItemContent: {
        id: '',
        value: '',
        valueIndex: 1,
        icon: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      },
      dict: [
        {
          title: '字典',
          name: '字典',
          isMain: true,
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
    saveDictItemContent () {
      console.log(this.dictItemContent)
      this.$refs.dictItemContent.validate(valid => {
        if (valid) {
          let parent = this.dictItemContent.parent
          // 防止JSON递归调用
          this.dictItemContent.parent = {}
          let isCreate = !this.dictItemContent.id
          let parentHasSaved = !!parent.id
          // create
          if (!parentHasSaved) {
            this.$requests.systemDictAddOne(parent).then(resData => {
              this.$Message.success('新建系统字典”' + parent.name + '“成功')
              this.selectedNow = {}
              this.flushDictTree()
            })
          } else {
            this.$manage.dict.saveDictItem(parent.id, this.dictItemContent)
              .then(resData => {
                Object.keys(resData).forEach(key => {
                  this.dictItemContent[key] = resData[key]
                })
                this.dictItemContent.title = resData.value
                this.dictItemContent.parent = parent
                if (isCreate) {
                  this.$Message.success('新建系统字典项”' + this.dictItemContent.value + '“成功')
                } else {
                  this.$Message.success('更新系统字典项”' + this.dictItemContent.value + '“成功')
                }
              })
          }
        } else {
          this.$Notice.warning({
            title: '填写错误，请重新填写'
          })
        }
      })
    },
    resetDictContent () {
      this.dictContent = {
        id: '',
        name: '',
        comment: '',
        icon: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      }
    },
    saveDictContent () {
      this.$refs.dictContent.validate(valid => {
        if (valid) {
          // 重置parent
          this.dictContent.children.forEach(child => child.parent = {})
          if (!this.dictContent.id) {
            // create
            this.$requests.systemDictAddOne(this.dictContent).then(resData => {
              this.$Message.success('新建系统字典”' + this.dictContent.name + '“成功')
              Object.keys(resData).forEach(key => {
                this.dictContent[key] = resData[key]
              })
              this.dictContent.title = this.dictContent.name
              this.selectedNow = this.dictContent
              this.dictContent.children.forEach(child => {
                child.parent = this.dictContent
                child.title = child.value
              })
            })
          } else {
            // update
            console.log(JSON.stringify(this.dictContent))
            this.$requests.systemDictUpdateOneById(
              { id: this.dictContent.id }, this.dictContent).then(resData => {
              this.$Message.success('更新系统字典”' + this.dictContent.name + '“成功')
              Object.keys(resData).forEach(key => {
                this.dictContent[key] = resData[key]
              })
              this.dictContent.title = this.dictContent.name
              this.dictContent.children.forEach(child => {
                child.parent = this.dictContent
                child.title = child.value
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
    resetDictItemContent () {
      this.dictItemContent = {
        id: '',
        value: '',
        valueIndex: 0,
        icon: '',
        orderBy: 0,
        createDate: '',
        updateDate: ''
      }
    },
    flushDictTree () {
      this.inUpdateDict = true
      this.$manage.dict.createDictTree().then(dictList => {
        this.dict[0].children = dictList
        this.$Message.success('字典刷新成功')
        this.inUpdateDict = false
      })
    },
    autoCreateDict () {
      this.inClearDict = true
      this.$requests.systemDictCreate().then(resData => {
        this.$Message.success('字典生成成功')
        this.inClearDict = false
      })
    },
    clearAllDict () {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要清空吗，在系统运行时清空字典，可能会导致系统无法运行',
        okText: '取消',
        cancelText: '继续清空',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.inClearDict = true
          this.$manage.dict.deleteAllDict().then(resData => {
            this.resource[0].children = []
            this.$Message.success('系统字典清空成功')
            this.inClearDict = false
          })
        }
      })
    },
    changeSelect (data) {
      console.log(data)
      if (data.name !== null && data.name !== undefined) {
        // 有name的是字典，没有name的是字典项
        this.dictContent = data
        this.isSelectDictItem = false
      } else {
        this.dictItemContent = data
        this.isSelectDictItem = true
      }
      this.dictContent = data
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
      let isNotDictItem = data.name !== null && data.name !== undefined
      return h('span', {
        style: {
          display: 'inline-block',
          fontSize: '15px',
          width: '100%'
        }
      }, isNotDictItem && data.selected ? [inner, buttons] : [inner])
    },
    append (data) {
      let isNotDictItem = data.name !== null && data.name !== undefined
      if (isNotDictItem) {
        if (data.isMain) {
          // 树根
          if (!data.children) {
            this.$set(data, 'children', [])
          }
          data.children.push({
            id: '',
            title: '新字典',
            name: '',
            comment: '',
            icon: '',
            orderBy: 0,
            createDate: '',
            updateDate: '',
            children: [],
            expand: true,
            selected: false
          })
        } else {
          if (!data.children) {
            this.$set(data, 'children', [])
          }
          data.children.push({
            id: '',
            title: '新字典项',
            parent: data,
            value: '',
            valueIndex: 1,
            icon: '',
            orderBy: 0,
            createDate: '',
            updateDate: '',
            expand: true,
            selected: false
          })
        }
        console.log(isNotDictItem, data)
      }
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
      let isNotDictItem = data.name !== null && data.name !== undefined
      let message1 = `您确定要删除名称为”${data.title}“的字典吗，这将同时删除其子字典，在系统运行时删除字典，可能会导致系统无法运行`
      let message2 = `您确定要删除名称为”${data.title}“的字典项吗，在系统运行时删除字典，可能会导致系统无法运行`
      this.$Modal.confirm({
        title: '警告',
        content: isNotDictItem ? message1 : message2,
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          if (isNotDictItem) {
            this.$manage.dict.deleteDict(data.id).then(resData => {
              const parentKey = root.find(el => el === node).parent
              const parent = root.find(el => el.nodeKey === parentKey).node
              const index = parent.children.indexOf(data)
              parent.children.splice(index, 1)
              this.$Message.success('已删除名称为”' + data.title + '“的字典')
            })
          } else {
            this.$manage.dict.deleteDictItem(data.id).then(resData => {
              const parentKey = root.find(el => el === node).parent
              const parent = root.find(el => el.nodeKey === parentKey).node
              const index = parent.children.indexOf(data)
              parent.children.splice(index, 1)
              this.$Message.success('已删除名称为”' + data.title + '“的字典项')
            })
          }
        }
      })
    },
    init () {
      this.$manage.dict.createDictTree().then(dictList => {
        this.dict[0].children = dictList
      })
    }
  },
  created () {
    this.init()
  }
}
</script>
