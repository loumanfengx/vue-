<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!--添加角色按钮区域-->
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <!--表格区域-->
        <template>
          <el-table :data="roleList" border stripe style="width: 100%">
            <!--展开列 type="expand"-->
            <el-table-column type="expand" align="center">
              <template slot-scope="scope">
                <!--pre标签 格式化json数据-->
                <!--<pre>{{scope.row}}</pre>-->
                <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
                  <!--一级权限列-->
                  <el-col :span="5">
                    <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                    <!--图标-->
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--二级和三级权限列-->
                  <el-col :span="19">
                    <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                      <!--二级权限列-->
                      <el-col :span="6">
                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                        <!--图标-->
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!--三级权限列-->
                      <el-col :span="18">
                            <!--closable 可移除 有x图标-->
                            <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!--索引列 type="index"-->
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
            <el-table-column prop="level" label="操作" align="center" width="300px">
              <!--插槽区域-->
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    <!--  对话框区域-->
      <el-dialog title="分配权限" :visible.sync="showSetDialogVisible" @close="setRightsDialogClosed" width="50%">
        <!--树形组件区域-->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defaultKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'roles',
  data () {
    return {
      // 角色列表数据
      roleList: [],
      // 所有权限数据
      rightsList: [],
      // 分配权限时的角色id
      roleId: '',
      // 树形组件属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点id数组
      defaultKeys: [],
      // 控制分配权限对话框的显示与隐藏
      showSetDialogVisible: false
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // 将请求结果赋值给roleList
      this.roleList = res.data
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      // 点击确定返回值为 ‘confirm’ 点击取消返回值为 ‘cancle’
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      this.$message.success('删除权限成功')
      // 直接复制不刷新整个页面
      role.children = res.data
    },
    // 监听分配权限对话框打开事件
    async showSetRightsDialog (role) {
      // 给roleId赋值
      this.roleId = role.id
      // 获取权限树形数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败!')
      }
      // 把获取的权限数据保存到rightList中
      this.rightsList = res.data
      //  递归获取三级节点的id
      this.getLeafKeys(role, this.defaultKeys)
      this.showSetDialogVisible = true
    },
    // 监听分配权限对话框关闭事件
    setRightsDialogClosed () {
      // 关闭分配权限对话框时情况defaultKeys数组数据
      this.defaultKeys = []
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafKeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 点击分配权限按钮，触发事件
    async allotRights () {
      const keys = [
        // ... 合并多个数组中的值到一个数组中
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败！') }
      this.$message.success('分配权限成功!')
      this.getRoleList()
      this.showSetDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  /*角色下一二级权限竖直居中*/
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
