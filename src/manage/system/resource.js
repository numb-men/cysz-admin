import manage from '@/manage'

function createResourceTree (force) {
  return new Promise((resolve, reject) => {
    if (!force) {
      let resourceTree = manage.$store.state.resource.resourceTree
      if (resourceTree.length > 0) {
        return resolve(resourceTree)
      }
    }
    let rt = []
    manage.$requests.systemResourceFindAll().then(resData => {
      let resources = resData
      for (let resource of resources) {
        resource['title'] = resource.comment
        resource['expand'] = false
        resource['selected'] = false
        let parentId = resource.parentId
        for (let r of resources) {
          if (r.id === parentId) {
            if (!r.children) {
              r.children = []
            }
            r.children.push(resource)
            break
          }
        }
        if (parentId === 0) {
          rt.push(resource)
        }
      }
      manage.$store.commit('setResourceTree', rt)
      resolve(rt)
    })
  })
}

function clearResourceTree () {
  return new Promise(resolve => {
    manage.$requests.systemResourceClear().then(resData => {
      manage.$store.commit('clearResource')
      resolve(resData)
    })
  })
}

function updateResourceTree () {
  return new Promise((resolve, reject) => {
    manage.$store.commit('clearResource')
    createResourceTree(true).then(rt => resolve(rt))
  })
}

function traverseResourceTree (node, callback) {
  callback(node)
  let children = node.children || []
  for (let child of children) {
    traverseResourceTree(child, callback)
  }
}

export default {
  createResourceTree,
  clearResourceTree,
  updateResourceTree,
  traverseResourceTree
}
