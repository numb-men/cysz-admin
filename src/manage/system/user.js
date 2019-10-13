import manage from '@/manage'

export default {
  searchDetailList (pageNumber, pageSize, searchForm) {
    return new Promise(resolve => {
      manage.$requests.systemUserDataSearchAndPaged({ pageNumber, pageSize }, searchForm)
        .then(resData => {
          let users = resData.content
          manage.$store.commit('setUsers', users)
          resolve({ users, total: resData.totalElements })
        })
    })
  },
  getDetailWithRoles (id) {
    return new Promise(resolve => {
      manage.$requests.systemUserDataDetail({ id }).then(resData => {
        let user = resData
        this.getUserRoles(id).then(resData2 => {
          user.roles = resData2
          r(user)
        })
      })
    })
  },
  saveDetail (userDetail) {
    return new Promise(resolve => {
      manage.$requests.systemUserDataSaveDetail(userDetail).then(resData => {
        resolve(resData)
      })
    })
  },
  updateDetail (id, userDetail) {
    return new Promise(resolve => {
      manage.$requests.systemUserDataUpdateDetail({ id }, userDetail).then(resData => {
        resolve(resData)
      })
    })
  },
  getUserRoles (id) {
    return new Promise(resolve => {
      manage.$requests.systemUserRoles({ id }).then(resData => {
        resolve(resData)
      })
    })
  },
  deleteUser (id) {
    return new Promise(resolve => {
      manage.$requests.systemUserDeleteOneById({ id }).then(resData => {
        resolve(resData)
      })
    })
  },
  resetPassword (id) {
    return new Promise(resolve => {
      manage.$requests.systemUserResetPassword({ id }).then(resData => {
        resolve(resData)
      })
    })
  }
}
