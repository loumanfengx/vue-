<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <!--警告区域-->
        <el-alert show-icon title="注意:只允许为第三级分类设置相关参数!" :closable="false" type="warning">
        </el-alert>
      <!--  选择商品分类区域 -->
        <el-row class="cat_opt" style="line-height: 40.8px">
          <el-col :span="3">
            <span>选择商品分类:</span>
          </el-col>
          <el-col :span="14">
            <!--级联选择框区域-->
            <el-cascader v-model="selectedCateKeys" :options="cateList" :props="props"
              @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
        <!--标签页区域-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <!--添加参数的按钮-->
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
            <!--动态参数表格区域-->
            <el-table :data="manyTabData" border stripe>
            <!--  展开行-->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)" closable>{{item}}</el-tag>
                  <!--动态编辑tag标签区域-->
                  <!--输入的文本框-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <!--添加按钮-->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template  slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <!--添加属性的按钮-->
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
            <!--静态属性表格区域-->
            <el-table :data="onlyTabData" border stripe>
              <!--  展开行-->
              <el-table-column type="expand">
                <!--循环渲染tag标签-->
                <template slot-scope="scope">
                  <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)" closable>{{item}}</el-tag>
                  <!--动态编辑tag标签区域-->
                  <!--输入的文本框-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <!--添加按钮-->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    <!-- 添加参数/属性 对话框区域-->
      <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" @close="addDialogClosed" width="30%">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px" class="demo-ruleForm">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数对话框区域 -->
      <el-dialog :title=" '修改' + titleText" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormBtn">确 定</el-button>
  </span>
      </el-dialog>
    </div>

</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 商品分类列表数据
      cateList: [],
      // 级选择器配置对象
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 级联选择框选中的cate_id数组
      selectedCateKeys: [],
      // 默认选中的标签页选项卡名称
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加表单数据验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      },
      editForm: {},
      // 表单数据验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表方法
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateList = res.data
    },
    // 监听级联选择框改变事件
    handleChange () {
      // 调用获取参数列表数据函数
      this.getParamsData()
    },
    // Tab 点击标签页选项卡事件的处理函数
    handleTabClick () {
      // 调用获取参数列表数据函数
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      // 证明选中的是不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        // 情况表格中的所有数据
        this.selectedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为paramsData 添加新属性并赋值 为了控制动态编辑tag的正常显示
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      // 判断返回的数据为动态参数数据还是静态属性数据
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 监听对话框关闭事件
    addDialogClosed () {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addFormRef.resetFields()
    },
    // 点击对话框确定按钮事件处理函数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name, attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    // 显示编辑对话框
    async showEditDialog (attr_id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改确定按钮事件处理函数
    editFormBtn () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name, attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }

        this.$message.success('修改参数成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除参数
    async removeParams (attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) { return this.$message.info('删除参数失败！') }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    // 点击动态编辑标签事件处理函数
    async handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      //  如果没有return，则证明输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 点击动态标签变为input输入框
    showInput (row) {
      row.inputVisible = true
      // $nextTick 方法的作用：就是当前页面上元素被重新渲染之后，才会指定回调函数的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对attr_vals的操作，保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('编辑提交参数失败！')
      }
      this.$message.success('编辑提交参数成功')
    },
    // 删除对应参数的可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  // 计算属性 调用对应的属性名时不需要加 ()
  computed: {
    // 计算添加动态静态参数按钮属性 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 计算三级分类id
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
