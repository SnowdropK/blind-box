import { request } from '../js/reques'

/**
 * 获取通知
 */
export const fetchNotice = (cloud, key) => {
  return request(cloud, {
    path: `/wx/system/keyValue/${key}`,
    method: 'GET'
  })
}