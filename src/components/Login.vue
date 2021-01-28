<!--结构区域-->
<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
    <!-- 表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<!--行为区域-->
<script>
export default {
  data () {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单规则验证对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置按钮
    resetLoginForm () {
      // console.log(this)
      // resetFields:element-ui提供的重置表单的方法
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 表单预验证
      // valid：boolean类型
      this.$refs.loginFormRef.validate((valid) => {
        // console.log(valid)
        if (!valid) {
          return false
        }
        this.$http.post('login', this.loginForm).then((res) => {
          if (res.status === 200) {
            this.$message.success('登录成功')
            console.log(res)
            window.sessionStorage.setItem('token', res.data.data.token)
            window.sessionStorage.setItem('username', res.data.data.username)
            this.$router.push({ path: '/home' })
          }
        })
      })
    }
  }
}
</script>
<!--样式区域-->
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 360px;
  background-color: #fff;
  border-radius: 6px;
  position: absolute;
  /*让空白框在页面居中*/
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  background-color: #fff;
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 60px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>
