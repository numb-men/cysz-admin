import manage from '@/manage'

export default {
  getRoles () {
    return new Promise(resolve => {
      let roles = manage.$store.state.role.roles
      if (roles.length > 0) {
        return resolve(roles)
      }
      manage.$requests.systemRoleFindAll().then(resData => {
        manage.$store.commit('setRoles', resData)
        resolve(resData)
      })
    })
  },
  createRole (role) {
    return new Promise(resolve => {
      manage.$requests.systemRoleCreate(role).then(resData => {
        manage.$store.commit('addRole', resData)
        let result = {}
        Object.assign(result, resData)
        resolve(result)
      })
    })
  },
  updateOneById (id, roleContent) {
    return new Promise(resolve => {
      manage.$requests.systemRoleUpdateOneById({ id }, roleContent)
        .then(resData => {
          let roles = manage.$store.state.role.roles
          for (let i in roles) {
            if (roles[i].id === id) {
              roles[i] = resData
              break
            }
          }
          manage.$store.commit('setRoles', roles)
          resolve(resData)
        })
    })
  },
  deleteOneRole (id) {
    return new Promise(resolve => {
      manage.$requests.systemRoleDeleteOneById({ id }).then(resData => {
        let roles = manage.$store.state.role.roles
        for (let i in roles) {
          let role = roles[i]
          if (role.id === id) {
            roles.splice(i, 1)
            break
          }
        }
        manage.$store.commit('setRoles', roles)
        resolve(roles)
      })
    })
  }
}
