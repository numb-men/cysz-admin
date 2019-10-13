import manage from '@/manage'

function createDictTree () {
  return new Promise(resolve => {
    manage.$requests.systemDictFindAll().then(resData => {
      let dictList = resData
      for (let dict of dictList) {
        dict['title'] = dict.comment
        dict['expand'] = false
        dict['selected'] = false
        let dictItems = dict.children
        for (let dictItem of dictItems) {
          dictItem['title'] = dictItem.value
          dictItem['parent'] = dict
          dictItem['expand'] = false
          dictItem['selected'] = false
        }
      }
      resolve(dictList)
    })
  })
}

function deleteDict (id) {
  return new Promise(resolve => {
    manage.$requests.systemDictDeleteByIdCascade({ id }).then(resData => {
      resolve(resData)
    })
  })
}

function deleteDictItem (id) {
  return new Promise(resolve => {
    manage.$requests.systemDictItemDeleteOneById({ id }).then(resData => {
      resolve(resData)
    })
  })
}

function deleteAllDict () {
  return new Promise(resolve => {
    manage.$requests.systemDictClear().then(resData => {
      resolve(resData)
    })
  })
}

function saveDictItem (id, dictItem) {
  return new Promise(resolve => {
    manage.$requests.systemDictAddOrUpdateItem({ id }, dictItem).then(resData => {
      resolve(resData)
    })
  })
}

export default {
  createDictTree,
  deleteDict,
  deleteDictItem,
  deleteAllDict,
  saveDictItem
}
