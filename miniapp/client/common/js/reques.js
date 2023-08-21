export const request = (cloud, { path, method = 'GET', params = {} }) => {
  // 38693 new-47278
  return new Promise((resolve, reject) => {
    cloud.application.httpRequest({
      path,
      method,
      params,
      body: params,
      'headers': { "Content-Type": "application/json;charset=UTF-8" },
      'exts': { "cloudAppId": "47278", "timeout": 20000 }
    }).then(res => {
      console.log('params', params);
      console.log(path+'->成功 返回->', res)
      resolve(res)
    }).catch(e => {
      console.log('报错'+ path, e)
      console.log(JSON.stringify(params));
      reject(e)
      my.showToast({
        type: 'fail',
        content: e.msg,
        duration: 3000
      });
    })
  })
}
