<template>
  <div class="container">
    <!-- 导航面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.params.breadCrumb" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索用户-->
    <el-card shadow="never" :body-style="{ padding: '20px' }">
      <div class="my-header">
        <el-form :model="seachForm" ref="seachForm" label-width="0" :inline="true" size="normal" :rules="seachRules">
          <el-form-item label="" prop="text">
            <el-input placeholder="请输入内容" v-model="seachForm.text"> <el-button slot="append" icon="el-icon-search"
                @click="seachUser"></el-button></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="centerDialogVisible = true">添加用户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用户列表-->
      <el-table :data="userData" stripe style="width: 100%" :border="true">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" min-width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" min-width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" min-width="180">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" min-width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#409EFF" inactive-color="#DCDFE6"
              @change="switchChange(scope.row.id, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" min-width="112">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              @click="(modifyDialogVisible = true, addForm = scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="getRoleList(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--底部分页器-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="pageData.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageData.total">
      </el-pagination>
      <!-- 添加用户-->
      <el-dialog title="添加用户" :visible.sync="centerDialogVisible" width="50%" @close="dialogCancel(1)">
        <el-form :model="addForm" ref="addForm" :rules="rules" label-width="80px" size="normal">
          <el-form-item prop="username" label="用户名">
            <el-input placeholder="请输入内容" v-model="addForm.username" :maxlength="10"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请输入内容" type="password" v-model="addForm.password" :maxlength="10">
            </el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input placeholder="请输入内容" v-model="addForm.email" :maxlength="20">
            </el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机">
            <el-input placeholder="请输入内容" v-model="addForm.mobile" type="string" :maxlength="11">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogSure">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户-->
      <el-dialog title="修改用户" :visible.sync="modifyDialogVisible" width="50%" @close="dialogCancel(2)">
        <el-form :model="addForm" ref="modifyForm" :rules="addRules" label-width="80px" size="normal">
          <el-form-item prop="username" label="用户名">
            <el-input placeholder="请输入内容" v-model="addForm.username" :maxlength="10" disabled></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input placeholder="请输入内容" v-model="addForm.email" :maxlength="20">
            </el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机">
            <el-input placeholder="请输入内容" v-model="addForm.mobile" type="string" :maxlength="11">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyDialogSure">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色-->
      <el-dialog title="分配角色" :visible.sync="rootDialogVisible" width="50%" @close="dialogCancel(3)">
        <el-form :model="addForm" :rules="rules" label-width="80px" size="normal">
          <div class="role-my-label">当前的用户: {{ addForm.username }}</div>
          <div class="role-my-label">当前的角色: {{ addForm.role_name }}</div>
          <div class="role-my-label">分配新角色:
            <el-select v-model="addForm.tempRoleName" placeholder="请选择">
              <el-option v-for="item in addForm.options" :key="item.roleName" :value="item.roleName">
              </el-option>
            </el-select>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rootDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="roleDialogSure">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 对话框打开/关闭
      centerDialogVisible: false,
      modifyDialogVisible: false,
      rootDialogVisible: false,
      userData: null,
      // 搜索验证
      seachRules: {
        text: {
          required: true,
          message: '字符串3-10位',
          min: 3,
          max: 10,
          type: 'string',
          trigger: 'blur'
        }
      },
      // 添加验证规则
      rules: {
        username: {
          required: true,
          message: '用户名长度5-10位',
          min: 5,
          max: 10,
          type: 'string',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '密码长度3-6位',
          min: 3,
          max: 6,
          type: 'string',
          trigger: 'blur'
        },
        email: {
          required: true,
          message: '请输入正确的邮箱',
          min: 5,
          max: 10,
          type: 'email',
          trigger: 'blur'
        },
        mobile: {
          required: true,
          message: '请输入正确的手机号',
          min: 5,
          max: 10,
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          trigger: 'blur',
          length: 11
        }
      },
      addRules: {
        email: {
          required: true,
          message: '请输入正确的邮箱',
          min: 5,
          max: 10,
          type: 'email',
          trigger: 'blur'
        },
        mobile: {
          required: true,
          message: '请输入正确的手机号',
          min: 5,
          max: 10,
          pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          trigger: 'blur',
          length: 11
        }
      },
      // 提交分页数据
      pageData: {
        pagenum: 1,
        pagesize: 2,
        total: 0
      },
      // 添加表单
      addForm: {
        id: null, username: null, password: null, email: null, mobile: null, options: null, tempRoleName: null
      },
      // 搜索表单
      seachForm: {
        text: ''
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.pageData })
      if (res.meta.status !== 200) {
        return this.msg(res.meta.msg)
      }
      this.pageData.total = res.data.total
      this.userData = res.data.users
    },
    // 获取权限列表
    async getRoleList(row) {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.msg(res.meta.msg)
      }
      this.addForm.id = row.id
      this.addForm.username = row.username
      this.addForm.role_name = row.role_name
      this.addForm.options = res.data
      this.rootDialogVisible = true
    },
    async seachUser() {
      try {
        await this.$refs['seachForm'].validate()
        let content = this.seachForm.text
        if (content) {
          this.userData = this.userData.filter(v => v.username === content)
        }
      } catch (error) {
        console.log('规则验证失败')
      }
    },
    // 切换分页器条目数
    handleSizeChange(val) {
      this.pageData.pagesize = val
      this.getUserList()
    },
    // 切换分页器当前页
    handleCurrentChange(val) {
      this.pageData.pagenum = val
      this.getUserList()
    },
    // 关闭对话框/重置
    dialogCancel(type) {
      if (type === 1) {
        this.$refs['addForm'].resetFields()
      } else if (type === 2) {
        this.$refs['modifyForm'].resetFields()
      } else if (type === 3) {
        this.addForm.tempRoleName = null
      }
    },
    // 权限添加确定
    async roleDialogSure() {
      const { data: res } = await this.$http.put(`roles/${this.addForm.id}`, { roleName: this.addForm.tempRoleName })
      if (res.meta.status !== 200) {
        return this.msg(res.meta.msg, 'error')
      }
      this.msg(res.meta.msg, 'success')
      this.rootDialogVisible = false
    },
    // 用户修改确定
    async modifyDialogSure() {
      try {
        await this.$refs['modifyForm'].validate()
        const { data: res } = await this.$http.put(`users/${this.addForm.id}`, { email: this.addForm.email, mobile: this.addForm.mobile })
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        this.msg(res.meta.msg, 'success')
        this.modifyDialogVisible = false
        this.getUserList()
      } catch (error) {
        console.log('规则验证失败')
      }
    },
    // 用户添加确定
    async addDialogSure() {
      try {
        await this.$refs['addForm'].validate()
        const { data: res } = await this.$http.post(`users`, { username: this.addForm.username, password: this.addForm.password, email: this.addForm.email, mobile: this.addForm.mobile })
        if (res.meta.status !== 201) {
          return this.msg(res.meta.msg, 'error')
        }
        this.msg(res.meta.msg, 'success')
        this.centerDialogVisible = false
        this.getUserList()
      } catch (error) {
        console.log('规则验证失败')
      }
    },
    // 删除用户
    delUser(uId) {
      var self = this
      this.confirm('确定要删除吗', async function () {
        try {
          const { data: res } = await self.$http.delete(`users/${uId}`)
          let result = res.meta.status === 200
          if (result) {
            self.getUserList()
          }
          return result
        } catch (error) {
          console.log(error)
          return false
        }
      })
    },
    // 状态开关事件
    async switchChange(uId, row) {
      const { data: res } = await this.$http.put(`users/${uId}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.msg(res.meta.msg, 'error')
      }
      this.msg(res.meta.msg, 'success')
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.container {
  .el-breadcrumb {
    font-size: 12px;
  }

  .el-card {
    margin-top: 15px;

    .role-my-label {
      line-height: 40px;

    }

    .my-header {
      border-bottom: none;

      .el-input {
        width: 450px !important;
      }

      .el-form-item {
        margin-bottom: 15px;
      }

      .el-form-item:nth-child(2) {
        margin-left: 10px;
      }
    }

    .el-table {
      font-size: 12px;

    }

    .el-pagination {
      margin-top: 15px;
    }
  }

}
</style>
