/**
 * 请求api列表
 *
 * @author hengyumo
 * @version 0.1.2 2019/7/9
 */

// const root = 'http://localhost:10001'
const root = ''

const api = {
  login: ['post', '/system/user/login'],
  createCaptcha: ['get', '/system/captcha/create'],

  systemResourceCreate: ['get', '/system/resource/create'],
  systemResourceClear: ['delete', '/system/resource/clear'],
  systemResourceFindAll: ['get', '/system/resource/list'],
  systemResourceDeleteByIdCascade: ['delete', '/system/resource/cascade'],
  systemResourceAddOne: ['post', '/system/resource/'],
  systemResourceUpdateOneById: ['put', '/system/resource/'],

  systemRoleFindAll: ['get', '/system/role/list'],
  systemRoleCreate: ['post', '/system/role/create'],
  systemRoleView: ['get', '/system/role/view'],
  systemRoleUpdateOneById: ['put', '/system/role/update'],
  systemRoleDeleteOneById: ['delete', '/system/role/'],

  systemUserDataDetailList: ['get', '/system/user/data/detail/list'],
  systemUserDataDetail: ['get', '/system/user/data/detail'],
  systemUserDataSaveDetail: ['post', '/system/user/data/detail'],
  systemUserDataUpdateDetail: ['put', '/system/user/data/detail'],
  systemUserRoles: ['get', '/system/user/roles'],
  systemUserResetPassword: ['get', '/system/user/password/reset'],
  systemUserDeleteOneById: ['delete', '/system/user/'],
  systemUserDataSearchAndPaged: ['post', '/system/user/data/search'],

  systemDictCreate: ['get', '/system/dict/create'],
  systemDictFindAll: ['get', '/system/dict/list'],
  systemDictDeleteByIdCascade: ['delete', '/system/dict/cascade'],
  systemDictItemDeleteOneById: ['delete', '/system/dict/item/'],
  systemDictAddOrUpdateItem: ['post', '/system/dict/save/item'],
  systemDictClear: ['delete', '/system/dict/clear'],
  systemDictAddOne: ['post', '/system/dict/'],
  systemDictUpdateOneById: ['put', '/system/dict/'],

  cyszUserSearchAndPaged: ['post', '/cysz/user/search'],
  cyszUserDeleteOneById: ['delete', '/cysz/user/'],
  cyszUserUpdateDetail: ['put', '/cysz/user/detail'],
  cyszUserSaveDetail: ['post', '/cysz/user/detail'],

  foodDeleteOneById: ['delete', '/cysz/food/'],
  foodUpdateOneById: ['put', '/cysz/food/'],
  foodAddOne: ['post', '/cysz/food/'],
  foodFindAll: ['get', '/cysz/food/list'],

  orderFindAll: ['get', '/cysz/order/list'],
  orderArrived: ['get', '/cysz/order/arrived'],
  orderDeleteOneById: ['delete', '/cysz/order/'],

  cyszStatsView: ['get', '/cysz/stats/view'],
  cyszStatsOrderPie: ['get', '/cysz/stats/orderPie'],
  cyszStatsGetWeekReqBar: ['get', '/cysz/stats/weekReqBar'],
  cyszStatsFoodWeekStats: ['get', '/cysz/stats/foodWeekStats']
}

export { root, api }
