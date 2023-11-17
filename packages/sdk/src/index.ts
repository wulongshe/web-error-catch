export interface Options {
  url: string;
}

function sendGetRequest(url: string) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
    }
  };
  xhr.send();
}

function send(url: string) {
  // 创建一个新的XMLHttpRequest对象
  var xhr = new XMLHttpRequest();

  // 设置请求方法和URL
  xhr.open('GET', url, true);

  // 设置响应类型为blob，以便接收二进制数据
  xhr.responseType = 'blob';

  // 监听请求完成事件
  xhr.onload = function () {
    if (xhr.status === 200) {
      // 请求成功，获取响应数据
      var blob = xhr.response;
      // 在这里可以对响应数据进行处理，比如创建一个<img>元素来显示图片
      var img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      document.body.appendChild(img);
    }
  };

  // 发送请求
  xhr.send();
}

export function register(options: Options) {
  // sendGetRequest(`${options.url}?error=error`);
  window.addEventListener(
    'error',
    (error) => {
      console.log('error', error);
      // send(`${options.url}?error=${error.error.stack}`)
      // sendGetRequest(`${options.url}?error=${error.error.stack}`);
      // navigator.sendBeacon(options.url, error.error.stack);
      // fetch(options.url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ error: error.error.stack }),
      // });
    },
    true,
  );
  /* promise异常 */
  window.addEventListener(
    'unhandledrejection',
    (error) => {
      console.log('unhandledrejection', error);
    },
    true,
  );
}
