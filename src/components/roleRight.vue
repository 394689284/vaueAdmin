<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in $route.params.breadCrumb" :key="index">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="tableData" border stripe width="100%">
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column label="权限名称" min-width="380px" prop="authName"> </el-table-column>
      <el-table-column label="路径" min-width="380px" prop="path"></el-table-column>
      <el-table-column label="权限等级" width="300px" prop="level">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag else v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag else v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: null
      // 这是数据
    }
  },
  created() {
    this.getPermiss()
  },
  methods: {
    // 获取权限列表
    async getPermiss() {
      try {
        const { data: res } = await this.$http.get('rights/list')
        if (res.meta.status !== 200) {
          return this.msg(res.meta.msg, 'error')
        }
        this.tableData = res.data
        return true
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
  font-size: 12px;
}
</style>
