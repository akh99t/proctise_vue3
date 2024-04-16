// 获取浏览器信息
function getBrowserInfo() {
  const userAgent = navigator.userAgent || '';
  let browserName = '';
  let browserVersion = '';

  if (userAgent.includes('Firefox')) {
    browserName = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/(\S+)/)?.[1] || '';
  } else if (userAgent.includes('Chrome')) {
    browserName = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/(\S+)/)?.[1] || '';
  } else if (userAgent.includes('Safari')) {
    browserName = 'Safari';
    browserVersion = userAgent.match(/Version\/(\S+)/)?.[1] || '';
  } else if (userAgent.includes('Edge')) {
    browserName = 'Edge';
    browserVersion = userAgent.match(/Edge\/(\S+)/)?.[1] || '';
  } else if (userAgent.includes('MSIE')) {
    browserName = 'Internet Explorer';
    browserVersion = userAgent.match(/MSIE (\d+\.\d+)/)?.[1] || '';
  }

  return `${browserName}_${browserVersion}`;
}

export const browserInfo = getBrowserInfo()