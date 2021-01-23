/**
 * 请求结果 统一处理返回值
 */
function requestResult(data, message) {
  if (data) {
    return {
      status: 'success',
      message,
      body: data
    }
  } else {
    return {
      status: 'error',
      message,
      body: data
    }
  }
}

module.exports = requestResult