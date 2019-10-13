<template>
  <div id="login" class="login">
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>登录中...</div>
    </Spin>
    <div class="login-con" style="z-index: 100;">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="name">
              <iInput v-model="form.name" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </iInput>
            </FormItem>
            <FormItem prop="password">
              <iInput type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </iInput>
            </FormItem>
            <FormItem prop="code">
              <div class="security-code-wrapper">
                <iInput v-model="form.code" size="large" placeholder="请输入验证码"/>
                <img :src="imgUrl" alt="验证码" title="点击刷新验证码" @click="initSecurityCode">
              </div>
            </FormItem>
            <FormItem>
              <iButton @click="handleSubmit" type="primary" long>登录</iButton>
            </FormItem>
          </Form>
          <div style="margin-top:5px;font-size:10px;">
            <Checkbox v-model="form.rememberMe" @on-change="setRememberMe">记住我</Checkbox>
          </div>
        </div>
      </Card>
    </div>

    <img alt style="position: fixed;top: 35%;left: 10%;width: 45%;z-index: 1;"
         src="@/assets/images/cysz-login-pic.png">
  </div>
</template>

<script>
import './login.less'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      loading: false,
      imgUrl: '',
      form: {
        name: '',
        password: '',
        code: '',
        rememberMe: false,
        captchaToken: ''
      },
      rules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 5,
            max: 25,
            message: this.$t('用户名长度应该在5-25位之间'),
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 8,
            max: 12,
            message: this.$t('密码长度应该在8-12位之间'),
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          {
            type: 'string',
            min: 4,
            max: 4,
            message: this.$t('验证码长度应该为4位'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    setRememberMe (value) {
      if (value) {
        localStorage['rememberMe'] = 1
      } else {
        localStorage['rememberMe'] = 0
      }
    },
    initSecurityCode () {
      this.$requests.createCaptcha().then(resData => {
        this.form.captchaToken = resData.captchaToken
        this.imgUrl = resData.image
      })
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.handleLogin(this.form).then(resData => {
            this.getUserInfo().then(res => {
              localStorage['token'] = resData
              this.$Notice.success({
                title: '登录成功'
              })
              this.$router.push({
                name: this.$config.homeName
              })
            })
          })
        } else {
          this.$Notice.warning({
            title: '填写错误，请重新填写'
          })
        }
      })
    }
  },
  created () {
    if (!localStorage['rememberMe']) {
      localStorage['rememberMe'] = 0
    } else {
      this.form.rememberMe = localStorage['rememberMe'] === 1
    }
    this.initSecurityCode()
  }
}
</script>
