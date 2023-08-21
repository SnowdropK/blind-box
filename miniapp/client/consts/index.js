// 消息
// 消息类型：1-系统消息;2-活动消息;3-抽赏消息
export const NOTICE_TYPE_MAP = {
  SYSTEM: 1,
  ACTIVITY: 2,
  REWARD: 3,
}
// 消息标题
export const NOTICE_INFO_MAP = {
  [NOTICE_TYPE_MAP.SYSTEM]: { title: '系统通知', img: '../images/system.png' },
  [NOTICE_TYPE_MAP.ACTIVITY]: { title: '活动通知', img: '../images/activity.png' },
  [NOTICE_TYPE_MAP.REWARD]: { title: '抽赏通知', img: '../images/reward.png' },
}
// 消息类型：1-系统消息;2-活动消息;3-抽赏消息
export const NOTICE_TITLE_MAP = {
  // SYSTEM: 1,
  // ACTIVITY: 2,
  // REWARD: 3,
  1: '系统通知',
  2: '活动通知',
  3: '抽赏通知',
}
// 消息已读:1-已读;0-未读
export const READ_FIELD = {
  UN_READED: 0,
  READED: 1,
}