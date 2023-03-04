<template>
  <div class="container">
    d
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.params.breadCrumb" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div class="my-header">
        <el-button type="primary" size="default" @click="onAdd">添加角色</el-button>
      </div>
      <!-- card body -->
      <el-table :data="tableData" border stripe width="100%">
        <el-table-column type="expand" width="50">
          <div v-if="scope.row.children.length" class="expand-box" slot-scope="scope">
            <div :class="['layer-box', indexA !== scope.row.children.length - 1 ? 'boderActive' : '']" :key="item.rid"
              v-for="(item, indexA) in scope.row.children">
              <!--一级盒子-->
              <div class="arow">
                <el-tag closable :disable-transitions="true" @close="handleClose(scope.row, item.id)">
                  {{ item.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </div>
              <div class="second">
                <div :class="['layer-box', index !== item.children.length - 1 ? 'boderActive' : '']" :key="itemA.rid"
                  v-for="(itemA, index) in item.children">
                  <!--二级盒子-->
                  <div class="arow">
                    <el-tag type='success' closable :disable-transitions="false"
                      @close="handleClose(scope.row, itemA.id)">
                      {{ item.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </div>
                  <div class="layer-box thrid">
                    <!--三级盒子-->
                    <el-tag type='warning' :key="itemB.rid" v-for="itemB in itemA.children" closable
                      :disable-transitions="false" @close="handleClose(scope.row, itemB.id)">
                      {{ itemB.authName }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </el-table-column>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="角色名称" min-width="380px" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" min-width="380px" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <el-button-group slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="onEdit(scope.row)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="onDel(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="onPermiss(scope.row)">分配权限</el-button>
          </el-button-group>
        </el-table-column>
      </el-table>
    </el-card>
    <!--添加角色面板-->
    <el-dialog title="添加角色" :visible.sync="addDialogBisible" width="30%" @close="closeDialog(1)">
      <el-form :model="editForm" ref="addForm" :rules="editRules" label-width="80px" :inline="false" size="normal">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogBisible = false">取消</el-button>
        <el-button type="primary" @click="onSureAdd">确定</el-button>
      </span>
    </el-dialog>
    <!--编辑角色面板-->
    <el-dialog title="编辑角色" :visible.sync="editDialogBisible" width="30%" @close="closeDialog(1)">
      <el-form :model="editForm" ref="editForm" :rules="editRules" label-width="80px" :inline="false" size="normal">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogBisible = false">取消</el-button>
        <el-button type="primary" @click="onSureEdit">确定</el-button>
      </span>
    </el-dialog>
    <!--角色权限面板-->
    <el-dialog title="分配权限" :visible.sync="permissDialogBisible" width="50%" @close="closeDialog(2)">
      <el-tree default-expand-all :data="treeData" show-checkbox node-key="id" :default-checked-keys="selectTree"
        :props="defaultProps" ref="user-tree">
      </el-tree>
      <span slot="footer">
        <el-button @click="permissDialogBisible = false">取消</el-button>
        <el-button type="primary" @click="onSurePermiss">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 角色列表
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      editRules: {
        roleName: {
          required: true,
          min: 5,
          max: 10,
          type: 'string',
          message: '长度5-10个字符',
          trigger: 'blur'
        },
        roleDesc: {
          required: true,
          min: 5,
          max: 10,
          type: 'string',
          message: '长度5-10个字符',
          trigger: 'blur'
        }
      },
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      tableData: null,
      treeData: null,
      selectTree: [],
      addDialogBisible: false,
      editDialogBisible: false,
      permissDialogBisible: false,
      selectId: null
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    /** 打开添加面板 */
    onAdd() {
      this.editForm = {
        id: null,
        roleName: '',
        roleDesc: ''
      }
      this.addDialogBisible = true
    },
    /** 打开编辑面板 */
    onEdit(row) {
      this.editForm = {
        id: row.id,
        roleName: row.roleName,
        roleDesc: row.roleDesc
      }
      this.editDialogBisible = true
    },
    // 删除数据
    onDel(uId) {
      var self = this
      this.confirm('是否删除此信息?', async function () {
        try {
          const { data: res } = await self.$http.delete(`roles/${uId}`)
          let result = res.meta.status === 200
          if (result) {
            self.getRoleList()
          }
          return result
        } catch (error) {
          console.log(error)
          return false
        }
      })
    },
    handleClose(role, rightId) {
      var self = this
      this.confirm('是否删除此信息?', async function () {
        try {
          const { data: res } = await self.$http.delete(`roles/${role.id}/rights/${rightId}`)
          let result = res.meta.status === 200
          if (result) {
            role.children = res.data
          }
          return result
        } catch (error) {
          console.log(error)
          return false
        }
      })
    },
    // 打开权限面板
    onPermiss(data) {
      this.selectId = data.id
      this.getPermiss().then((res) => {
        this.selectTree = []
        this.getLeafKeys(data, this.selectTree)
        this.permissDialogBisible = true
        console.log(this.selectTree)
      }).catch((res) => {
        console.log(res)
      })
    },
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 添加确定
    async onSureAdd() {
      try {
        await this.$refs['addForm'].validate()
        const { data: res } = await this.$http.post('roles', this.editForm)
        if (res.meta.status !== 201) {
          return this.msg(res.meta.msg, 'error')
        }
        this.msg('添加成功', 'success')
        this.addDialogBisible = false
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑确定
    async onSureEdit() {
      try {
        await this.$refs['editForm'].validate()
        const { data: res } = await this.$http.put(`roles/${this.editForm.id}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        this.msg('编辑成功', 'success')
        this.editDialogBisible = false
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    // 分配权限确定
    async onSurePermiss() {
      if (!this.selectId) {
        return
      }
      let arr = [...this.$refs['user-tree'].getCheckedKeys(), ...this.$refs['user-tree'].getHalfCheckedKeys()]
      const { data: res } = await this.$http.post(`roles/${this.selectId}/rights`, { rids: arr.join(',') })
      if (res.meta.status !== 200) {
        return this.msg(res.meta.msg, 'error')
      }
      this.msg('权限编辑成功', 'success')
      this.permissDialogBisible = false
      this.getRoleList()
    },
    closeDialog(type) {
      if (type === 1) {
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields()
        }
        if (this.$refs['addForm']) {
          this.$refs['addForm'].resetFields()
        }
      } else if (type === 2) {
        this.selectTree = []
        this.selectId = null
      }
    },
    // 获取角色列表
    async getRoleList() {
      try {
        const { data: res } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        this.tableData = res.data
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
    // 获取权限列表
    async getPermiss() {
      try {
        const { data: res } = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        this.treeData = res.data
        return true
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;

  .el-button-group {
    display: flex;
    justify-content: space-around;
  }

  .my-header {
    border-bottom: none;
  }

  .expand-box {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 6px 6px;

    .boderActive {
      border-bottom: 1px solid #eee !important;
      width: 100%;
    }

    .arow {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .layer-box {
      display: flex;
      flex-direction: row;
      align-items: center;

      .first {
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
      }

      .el-tag {
        margin-left: 5px;
        margin-top: 10px;
        margin-right: 3px;
        margin-bottom: 10px;
      }

      .second,
      .thrid {
        padding-left: 200px;
      }

      .thrid {
        flex-wrap: wrap;
        align-content: flex-start;
      }
    }
  }
}
</style>
