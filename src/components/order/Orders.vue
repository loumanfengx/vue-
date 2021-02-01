<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--卡片视图区域-->
      <el-card>
        <el-row>
          <el-col :span="8">
            <!--搜索框区域-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!--订单表格区域-->
        <el-table :data="ordersTableData" border stripe>
          <el-table-column  label="#" type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="create_time" label="下单时间">
            <template slot-scope="scope">
              {{ scope.row.create_time | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialogVisible"></el-button>
              <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressDialogVisible"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="queryInfo.pagenum" :page-size="queryInfo.pagesize"
          :page-sizes="[5,10,15,20]"
          layout="total,sizes, prev, pager, next,jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--修改地址对话框区域-->
      <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="30%" @close="addressDialogClosed" >
        <!--修改表单区域-->
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px"
                 class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="addressForm.address1"
              :options="cityData"
              :props="{ expandTrigger: 'hover' }">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
                  </span>
      </el-dialog>
      <!--查询物流对话框区域-->
      <el-dialog title="查询物流" :visible.sync="progreessDialogVisible" width="30%">
        1234
      </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
  name: 'Orders',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      total: 0,
      // 订单列表数据
      ordersTableData: [],
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 控制物流对话框的显示与隐藏
      progreessDialogVisible: false,
      // 表单数据对象
      addressForm: {
        address1: '',
        address2: ''
      },
      // 表单数据规则验证对象
      addressFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 两者名字相同时可以只写一个 cityData
      cityData: cityData,
      // 物流数据
      progressData: []
    }
  },
  created () {
    // 获取订单列表
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: { pagenum: this.queryInfo.pagenum, pagesize: this.queryInfo.pagesize } })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单列表失败！')
      }
      this.ordersTableData = res.data.goods
      this.total = res.data.total
      console.log(res.data)
    },
    // 点击每页显示数据条数事件处理函数
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 点击页码事件处理函数
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrderList()
    },
    // 点击修改按钮触发
    showEditDialogVisible () {
      this.editDialogVisible = true
    },
    // 关闭修改对话框触发函数
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 点击物流按钮触发函数
    async showProgressDialogVisible () {
      // api 接口异常，不能发起请求
      /* const { data: res } = await this.$http.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        this.$message.error('获取物流信息失败！')
      }
      this.progressData = res.data */
      this.progreessDialogVisible = true
      console.log(this.progressData)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
