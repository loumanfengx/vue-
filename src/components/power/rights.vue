<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    <!--卡片视图区域-->
      <el-card>
        <!--表格区域-->
        <template>
          <el-table :data="rightsList" border stripe >
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
            <el-table-column prop="path" label="路径" align="center"></el-table-column>
            <el-table-column prop="level" label="权限等级" align="center">
              <!--作用域插槽-->
              <template slot-scope="scope">
                <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'rights',
  data () {
    return {
      // 权限列表数据
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表数据
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      // 将返回结果赋值给 rightsList属性
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
