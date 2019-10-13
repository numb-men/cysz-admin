<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="userEdit" class="userEdit">
      <Card style="margin: 20px 15%;padding: 30px;">
      <iForm ref="userDetail" :model="userDetail" :label-width="100" :rules="rules">
        <Row type="flex" justify="center" :gutter="16">
          <iCol span="18">
            <FormItem prop="name" label="用户名">
              <iInput type="text" v-model="userDetail.name" placeholder="用户名">
                <Icon type="md-person" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="realName" label="真实姓名">
              <iInput type="text" v-model="userDetail.realName" placeholder="真实姓名">
                <Icon type="md-person" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="sex" label="性别">
              <iInput type="text" v-model="userDetail.sex" placeholder="性别">
                <Icon type="md-person" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="age" label="年龄">
              <iInput type="text" v-model="userDetail.age" placeholder="年龄">
                <Icon type="md-person" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="mobile" label="手机">
              <Input type="text" v-model="userDetail.mobile" placeholder="手机">
                <Icon type="md-call" size="14" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="email" label="电子邮件">
              <Input type="text" v-model="userDetail.email" placeholder="电子邮件">
                <Icon type="md-mail" size="14" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="roleIds" label="角色">
              <iSelect ref="roleSelect" v-model="userDetail.roles" multiple>
                <Option v-for="option in rolesOption" :value="option.id" :key="option.id">
                  {{ option.name }}
                </Option>
              </iSelect>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem prop="userDescribe" label="个人描述">
              <Input type="textarea" :autosize="{minRows: 5, maxRows: 10}"
                     v-model="userDetail.userDescribe" placeholder="个人描述">
              </Input>
            </FormItem>
          </iCol>
          <iCol span="18" v-show="userDetail.id">
            <FormItem prop="lastLogin" label="最后登录时间">
              <iInput type="text" v-model="userDetail.lastLogin" disabled>
                <Icon type="md-time" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18" v-show="userDetail.id">
            <FormItem label="注册时间" prop="createDate">
              <iInput v-model="userDetail.createDate" disabled>
                <Icon type="md-time" size="14" slot="prepend"></Icon>
              </iInput>
            </FormItem>
          </iCol>
          <iCol span="18">
            <FormItem>
              <Button type="primary" style="width: 120px;margin-right: 8px;" @click="handleSubmit">保存</Button>
              <Button type="default" @click="handleReset" style="width: 120px;margin-right: 8px;">重置</Button>
              <Button type="default" v-if="userDetail.id" @click="resetPassword" style="width: 120px;">重置密码</Button>
            </FormItem>
          </iCol>
        </Row>
      </iForm>
      </Card>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'userEdit',
  data () {
    return {
      rolesOption: [],
      userDetail: {
        id: '',
        name: '',
        realName: '',
        age: '',
        sex: '',
        mobile: '',
        email: '',
        userDescribe: '',
        roles: [],
        lastLogin: '',
        createDate: '',
        updateDate: ''
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        realName: [{ required: true, message: '真实姓名不能为空', trigger: 'change' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'change' }],
        sex: [{ required: true, message: '性别不能为空', trigger: 'change' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {},
  methods: {
    handleSubmit () {
      this.$refs.userDetail.validate(valid => {
        if (valid) {
          if (this.userDetail.id) {
            this.$manage.user.updateDetail(this.userDetail.id, this.userDetail)
              .then(resData => {
                resData.age = String(resData.age)
                this.userDetail = resData
                this.$Message.success({
                  content: '用户更新成功',
                  onClose: () => this.$store.commit('closeTag', this.$route)
                })
              })
          } else {
            this.$manage.user.saveDetail(this.userDetail)
              .then(resData => {
                resData.age = String(resData.age)
                this.userDetail = resData
                this.$Message.success({
                  content: '用户创建成功',
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
    handleReset () {
      this.roles = []
      this.userDetail = {
        id: '',
        name: '',
        realName: '',
        age: '',
        sex: '',
        mobile: '',
        email: '',
        userDescribe: '',
        lastLogin: '',
        createDate: '',
        updateDate: ''
      }
      this.$refs.userDetail.resetFields()
    },
    resetPassword () {
      this.$manage.user.resetPassword(id).then(resData => {
        this.$Message.success('重置密码成功')
      })
    },
    init (inCreate) {
      if (!inCreate) {
        this.handleReset()
      }
      let id = this.$route.params.id
      console.log(id)
      if (id) {
        this.$manage.user.getDetailWithRoles(id).then(detail => {
          console.log(detail)
          detail.age = String(detail.age)
          this.userDetail = detail
        })
      }
      this.$manage.role.getRoles().then(roles => this.rolesOption = roles)
    }
  },
  created: function () {
    this.init(true)
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      if (newRoute.name === 'userNew' || newRoute.name === 'userEdit') {
        this.init()
      }
    }
  }
}
</script>
