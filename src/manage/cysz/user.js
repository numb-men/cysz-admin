import manage from '@/manage'

export default {
  search (pageNumber, pageSize, searchForm) {
    return new Promise((resolve, reject) => {
      manage.$requests.cyszUserSearchAndPaged({ pageNumber, pageSize }, searchForm).then(res => {
        let users = res.content
        resolve({ users, total: res.totalElements })
      }).catch(res => reject(res))
    })
  }
}
