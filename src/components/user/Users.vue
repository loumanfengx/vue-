<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图-->
      <el-card class="box-card">
        <!-- 搜索 添加 -->
        <el-row :gutter="20">
          <el-col :span="6">
            <!--clearable 使用clearable属性即可得到一个可清空的输入框
              @clear 在点击由 clearable 属性生成的清空按钮时触发-->
            <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
    <!--  用户表格区域-->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->align="center"
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
         <!-- 作用域插槽 slot-scope属性 获取本行所有数据-->
          <template slot-scope="scope">
            <!--{{scope.row}}-->
            <el-switch v-model="scope.row.mg_state"  @change="userStatusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="角色分配" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" circle @click="allotRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]"
                     :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      </el-card>
      <!--添加用户的对话框-->
      <!--@close 绑定对话框关闭事件-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区域(添加表单区域)-->
        <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
      </el-dialog>
      <!--修改用户的对话框-->
      <el-dialog title="用户修改" :visible.sync="editDialogVisible" width="50%">
        <!--主体区域-->
        <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px" >
          <el-form-item label="用户名">
            <el-input v-model="editUserForm.username" :disabled="true"> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editUserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配角色对话框区域-->
      <el-dialog title="角色分配" :visible.sync="setRoleDialogVisible" width="25%">
          <!--用户信息区域-->
        <div class="divbottom">
          <el-input  v-model="userInfo.username" disabled>
            <template slot="prepend">当前用户</template>
          </el-input>
        </div>
        <div class="divbottom">
          <el-input  v-model="userInfo.role_name" disabled>
            <template slot="prepend">当前角色</template>
          </el-input>
        </div>
        <p>
        选择新的角色:
          <el-select v-model="selectRoleId">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select></p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Users',
  created () {
    this.getUserList()
  },
  data () {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 2
      },
      // 用户列表数据
      userlist: [],
      total: 0,
      // 用户信息对象
      userInfo: {},
      // 所有角色数据
      rolesList: [],
      // 下拉框选中的角色id值
      selectRoleId: '',
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 添加用户表单数据对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单数据验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 18, message: '用户密码的长度在6～18个字', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户调单数据对象
      editUserForm: {
        username: '',
        id: '',
        rid: '',
        mobile: '',
        email: ''
      },
      // 修改用户表单数据验证对象
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getUserList () {
      // eslint-disable-next-line no-undef
      this.$http.get('users', { params: this.queryInfo }).then((res) => {
        // console.log(res)
        if (res.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userlist = res.data.data.users
        this.total = res.data.data.total
      })
    },
    // 监听每页显示数据条数改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值事件
    handleCurrentChange (newCurrent) {
      // console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    // 监听用户状态改变事件
    userStatusChanged (userInfo) {
      // console.log(userInfo)
      this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then((res) => {
        if (res.status !== 200) {
          // 恢复用户修改前状态
          userInfo.msg_state = !userInfo.msg_state
          return this.$message.error('用户状态更新失败！')
        }
        this.$message.success('用户状态更新成功')
      })
    },
    // 添加对话框关闭事件
    addDialogClosed () {
      // 关闭对话框时情况表单数据
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击确定按钮进行表单预验证并执行添加操作
    addUser () {
      this.$refs.addUserFormRef.validate((valid) => {
        console.log(valid)
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        //  预验证成功后发起添加http网络请求
        this.$http.post('users', this.addUserForm).then((res) => {
          // console.log(res)
          if (res.data.meta.status !== 201) {
            return this.$message.error('添加用户失败！')
          }
          this.$message.success('添加用户成功')
          // 关闭对话框
          this.addDialogVisible = false
          // 调用查询用户列表方法
          this.getUserList()
        })
      })
    },
    // 点击修改按钮显示对话框
    showEditDialog (id) {
      this.$http.get('users/' + id).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询用户失败！')
        }
        console.log(res)
        this.editUserForm = res.data.data
      })
      this.editDialogVisible = true
    },
    //  点击修改按钮执行表单预验证并执行修改操作
    editUserInfo () {
      this.$refs.editUserFormRef.validate(valid => {
        // console.log(valid)
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 发起修改用户的数据请求
        this.$http.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile }).then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('修改用户信息失败')
          }
          // 关闭对话框
          this.editDialogVisible = false
          // 弹出成功信息框
          this.$message.success('修改用户信息成功')
          // 刷新列表
          this.getUserList()
        })
      })
    },
    async removeUserById (id) {
      // 点击确定返回值为 ‘confirm’ 点击取消返回值为 ‘cancle’
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 执行删除数据请求
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 监听角色分配按钮事件
    async allotRole (userInfo) {
      this.userInfo = userInfo
      // 发起请求获取角色列表数据
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    async saveRole () {
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户角色失败！')
      }
      this.$message.success('更新用户角色成功')
      this.setRoleDialogVisible = false
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.divbottom {
  margin-bottom: 10px;
}
</style>
