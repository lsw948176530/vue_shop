<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    卡片视图-->
    <el-card>
      <!--     添加角色按钮区域-->
      <el-row :gutter="20">
        <el-col :span="8">
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
<!--        展开列-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children"
                    :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级和三级权限-->
              <el-col :span="19">
<!--                通过for循环 嵌套渲染二级权限-->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                            closable @close="removeRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
<!--            <pre>-->
<!--              {{scope.row}}-->
<!--            </pre>-->
          </template>
        </el-table-column>
<!--        索引列-->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
        <el-table-column label="角色描述" prop="roleName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoles()">编辑</el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
            </el-tooltip>
              <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </el-tooltip>
          </template>

        </el-table-column>
      </el-table>

    </el-card>

<!--    修改角色的对话框-->
    <el-dialog
        title="修改角色"
        :visible.sync="editRolesDialogVisible"
        width="50%">
      <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editRolesFormRef" label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRolesDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
<!--    分配权限的对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%" @close="setRightDialogClosed">
      <el-tree :data="rightslist" :props="treeProps" show-checkbox
               node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      // 所有建设列表数据
      rolesList: [],
      roleDesc: '',
      roleName: '',
      // 控制修改角色对话框的显示与隐藏
      editRolesDialogVisible: false,
      // 查询到的用户信息对象
      editRolesForm: {},
      // 修改表单的验证规则对象
      editRolesFormRules: {
      },
      //控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist:[],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 当前即将分配角色的id
      roleId: ''

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rolesList = res.data
      this.roleDesc = res.roleDesc
      this.roleName = res.roleName
      console.log(this.rolesList);
    },
    // 根据id删除对象的权限
    async removeRightById(role, rightId) {

      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }

      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // this.getRolesList()
      // 删了之后还在原页面
      role.children =res.data
    },
    // 展示分配属性的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }

      // 把获取到的权限数据保存到data中
      this.rightslist = res.data
      console.log(this.rightslist);

      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)


      this.setRightDialogVisible = true
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children属性，则是三级节点
    if (!node.children) {
      return arr.push(node.id)
    }
    node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys= []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ]
      const idStr = keys.join(',')

      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },

    // 展示编辑角色的对话框
    async showEditRoles() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色信息失败')
      }
      this.editRolesDialogVisible = ! this.editRolesDialogVisible
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

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>