<template>
  <Card shadow style="height: 100%;width: 100%;overflow: hidden;">
    <div id="role" class="role">
    <Row>
      <Col span="6" v-for="role in roles" style="padding:10px;" :key="role.id">
        <Card>
          <div style="text-align:center" v-on:click="showDetail(role.id)">
            <div style="position:absolute; right:5px; top:5px; cursor:pointer;"
                 v-on:click.stop="deleteRole(role.id, $event)">
              <Icon type="md-close" size="20"></Icon>
            </div>
            <Icon :type="role.icon" size="50"></Icon>
            <h3>{{role.name}}</h3>
          </div>
        </Card>
      </Col>
      <Col span="6" style="padding:10px;">
        <Card >
          <div style="text-align:center" v-on:click="newRole()">
            <Icon type="ios-add" size="50"></Icon>
            <h3>新增</h3>
          </div>
        </Card>
      </Col>
    </Row>
    </div>
  </Card>
</template>

<script>

export default {
  name: 'role',
  data () {
    return {
      roles: []
    }
  },
  computed: {},
  methods: {
    deleteRole (id, e) {
      this.$Modal.confirm({
        title: '警告',
        content: '您确定要删除角色，在系统运行时删除角色，可能会导致系统异常',
        okText: '取消',
        cancelText: '继续删除',
        onOk: () => {
          this.$Message.info('操作取消')
        },
        onCancel: () => {
          this.$manage.role.deleteOneRole(id).then(roles => {
            this.roles = roles
            this.$Message.success('删除成功')
          })
        }
      })
    },
    showDetail (id) {
      this.$router.push({ name: 'roleEdit', params: { id: id } })
    },
    newRole () {
      this.$router.push({ name: 'roleNew' })
    }
  },
  created () {
    this.$manage.role.getRoles().then(roles => {
      this.roles = roles
    })
  },
  watch: {
    '$route': function () {
      this.$manage.role.getRoles().then(roles => {
        this.roles = []
        this.roles = roles
      })
    }
  }
}
</script>
