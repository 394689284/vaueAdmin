<template>
  <div class="container" slot="title">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: {
          type: 'string',
          required: true,
          message: '请输入3-10个字符',
          trigger: 'blur',
          min: 3,
          max: 10
        },
        password: {
          type: 'string',
          required: true,
          message: '请输入6-10个字符',
          trigger: 'blur',
          min: 6,
          max: 10
        }
      }
    }
  },
  methods: {
    /** 调用验证和登录接口 */
    async login() {
      try {
        await this.$refs['loginFormRef'].validate()
        let { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        // sessionStorage.setItem('token', res.data.token)
        localStorage.setItem('token', res.data.token)
        this.msg(res.meta.msg, 'success')
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.log('规则验证失败')
      }
    },
    resetLoginForm() {
      this.$refs['loginFormRef'].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
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
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
