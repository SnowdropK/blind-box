const delay = (times) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, times);
  });
};

const mockSpi = async () => {
  await delay(2000);
  return {
    apiName: "mockSpi",
    apiData: {},
  };
};

// 右上角顶部topBar配置声明
function registerTopBarConfig() {
  return {
    // 客服 给指定用户发送千牛聊天消息
    // 传参说明 https://miniapp.open.taobao.com/docV3.htm?spm=a219a.7386797.0.0.8c9d669aRHO3rL&source=search&docId=1274&docType=20
    // 不要传递success等回调函数,无法被序列化
    openChat: {
      // 必填 聊天的对象的nick，nick前请带上nick域, 所属域可选值为：cntaobao|cnalichn|enaliint, cntaobao:是淘宝用户, cnalichn:是中文站用户,enaliint:是国际站用户
      nick: 'cntaobao商家测试帐号912:蓝刀',
      // 非必填 打开聊天窗，同时携带输入框文本
      text: '蓝刀你好',
    },
    //帮助 提供帮助文档的外跳链接
    // 传参说明 https://miniapp.open.taobao.com/docV3.htm?spm=a219a.7386797.0.0.4e0a669a299jtd&source=search&docId=1365&docType=20
    // 不要传递success等回调函数,无法被序列化
    openHelpDoc: {
      // 必填	外跳链接或者内部path
      url: 'http://www.taobao.com', // 或者app.json声明的path，比如pages/extend/manageActivity/ActivityList/SectionBlank
    }
  }
}



export default {
  mockSpi,
  registerTopBarConfig
};
