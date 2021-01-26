/**
 * 请求结果 统一处理返回值
 */
function requestResult(data, status, message) {
  if (status === 'success') {
    return {
      status: 'success',
      message,
      body: data
    }
  } else {
    return {
      status: 'error',
      message,
      error: data
    }
  }
}

module.exports = requestResult