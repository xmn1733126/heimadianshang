<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
          <el-dialog title="添加角色" :visible.sync="dialogVisible" width="40%" @close="addDialogClosed">
            <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="80px">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addform.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addform.roleDesc"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addrole">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <!-- <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id">
              渲染一级权限
              <el-col :span="5">
                {{item1}}
              </el-col>
              渲染二级和三级权限
              <el-col :span="19"></el-col>
            </el-row>
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column> -->
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button  type="primary" icon="el-icon-edit" @click="edit(scope.row.id)">编辑</el-button>
            <el-dialog title="修改角色" :visible.sync="editdialogVisible" width="40%">
              <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editform.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="editform.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editrole">确 定</el-button>
              </span>
            </el-dialog>
            <el-button  type="danger" icon="el-icon-delete" @click="shanchu(scope.row.id)">删除</el-button>
            <!-- <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //  所有角色列表数据
      rolelist: [],
      dialogVisible: false,
      editdialogVisible: false,
      // 添加角色数据
      addform: {
        roleid: '',
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addformrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 修改角色数据
      editform: {},
      // 添加修改角色的验证规则对象
      editformrules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    async getRolelist () {
      const { data: res } = await this.$http.get('roles')
      // if (res.meta.state !== 200) {
      //   return this.$message.error('获取角色列表失败')
      // }
      this.rolelist = res.data
    },
    // 添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addformref.resetFields()
    },
    addrole () {
      this.$refs.addformref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles/', this.addform)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败!')
        }
        this.$message.success('添加用户成功!')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 直接获取角色列表数据
        this.getRolelist()
      })
    },
    // 给编辑编辑框里拿传值
    async edit (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editform = res.data
      this.editdialogVisible = true
    },
    //  修改后的值确定
    async editrole () {
      this.$refs.editformref.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put('roles/' + this.editform.roleId, {
          roleName: this.editform.roleName,
          roleDesc: this.editform.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败!')
        }
        // 关闭对话框
        this.editdialogVisible = false
        // 刷新数据列表
        this.getRolelist()
        // 提示修改成功
        this.$message.success('更新角色信息成功!')
      })
    },
    // 删除
    async shanchu (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getRolelist()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
