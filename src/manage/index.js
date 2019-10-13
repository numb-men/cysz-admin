import { requests } from '@/request/requests'
import store from '@/store'
import resource from './system/resource'
import role from './system/role'
import user from './system/user'
import dict from './system/dict'
import cyszUser from './cysz/user'
import cyszOrder from './cysz/order'
import cyszFood from './cysz/food'

export default {
  $requests: requests,
  $store: store,
  resource,
  role,
  user,
  dict,
  cyszUser,
  cyszFood,
  cyszOrder
}
