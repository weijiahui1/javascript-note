## 阮一峰 WebSocket 教程
    http://www.ruanyifeng.com/blog/2017/05/websocket.html
    WebSocket 是一种网络通讯协议。
### 一、为什么需要WebSocket?
    初次接触WebSocket 的人，都会问同样的问题：我们已经有了HTTP协议，为什么还需要另一个协议？它能带来什么好处？
    答案很简,因为HTTP协议有一个缺陷：通信只能由客户端发起。

    举例来说，我们想了解今天的天气，只能是客户端向服务器发出请求，服务器返回查询结果。HTTP 协议做不到服务器主动向客户端推送信息。
    
    这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。
    我们只能使用"轮询"：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室。

    轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。
    因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。

### 二、简介
    WebScoket协议 在2008年诞生，2011年成为国际标准。所以浏览器都已经支持了。
    最大特点：
        服务器可以主动的向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。
    
    其他特点包括：

    （1）建立在 TCP 协议之上，服务器端的实现比较容易。

    （2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
    
    （3）数据格式比较轻量，性能开销小，通信高效。
    
    （4）可以发送文本，也可以发送二进制数据。
    
    （5）没有同源限制，客户端可以与任意服务器通信。
    
    （6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。
### 三、客户端的简单示例
    WebSocket 的用法相当简单。
    下面是一个网页脚本的例子（点击这里看运行结果），基本上一眼就能明白。
    
```javascript
	var ws = new WebSocket("wss://echo.websocket.org");

	ws.onopen = function(evt) { 
	  console.log("Connection open ..."); 
	  ws.send("Hello WebSockets!");
	};

	ws.onmessage = function(evt) {
	  console.log( "Received Message: " + evt.data);
	  ws.close();
	};

	ws.onclose = function(evt) {
	  console.log("Connection closed.");
	};
```
### 四、客户端的API
##### 4.1 WebSocket 构造函数
    WebSocket 对象作为一个构造函数，用于创建WebSocket实例。
```javascript
    var ws = new WebSocket('ws://localhost:8080');
```
    执行上面的语句之后，客户端会与服务器进行连接。
    实例对象的所有属性和方法清单，参见
##### 4.2 webSocket.readyState
    readyState 属性返回实例对象的当前状态，共有四种：

        CONNECTING：值为0，表示正在连接。
        OPEN：值为1，表示连接成功，可以通信了。
        CLOSING：值为2，表示连接正在关闭。
        CLOSED：值为3，表示连接已经关闭，或者打开连接失败。
##### 4.3 webSocket.onopen
    实例对象的onopen属性，用于指定连接成功后的回调函数。
```javascript
    var ws = new WebSocket('ws://localhost:8080');

    ws.onopen = function() {
        ws.send('hello Sener!');
    }
```
    如果要指定多个回调函数，可以使用addEventListener方法。
```javascript
    var ws = new WebSocket('ws://localhost:8080');

    ws.addEventListener('open', function(event) {
        ws.send('hello Sener!');
    });
```
##### 4.4 webSocket.onclose
    实例对象的onclose 属性，用于指定连接 关闭后的回调函数。
```javascript
    var ws = new WebSocket('ws://localhost:8080');

    ws.onclose = function(event) {
    var code = event.code;
    var reason = event.reason;
    var wasClean = event.wasClean;
    // handle close event
    };

    ws.addEventListener("close", function(event) {
    var code = event.code;
    var reason = event.reason;
    var wasClean = event.wasClean;
    // handle close event
    });
```
##### 4.5 webSocket.onmessage
    实例对象的 onmessage 属性，用于指定收到服务器数据后的回调函数。

```javascript
    ws.onmessage = function(event) {
    var data = event.data;
    // 处理数据
    };

    ws.addEventListener("message", function(event) {
    var data = event.data;
    // 处理数据
    });
```
##### 4.6 webSocket.send()
    实例对象的 send() 方法用于向服务器发送数据。
```javascript
    ws.send('your message');
    // 发送 Blob 对象的例子。
    var file = document.querySelector('input[type="file"]').files[0];
    ws.send(file);
    // 发送 ArrayBuffer 对象的例子。
    // Sending canvas ImageData as ArrayBuffer
    var img = canvas_context.getImageData(0, 0, 400, 320);
    var binary = new Uint8Array(img.data.length);
    for (var i = 0; i < img.data.length; i++) {
    binary[i] = img.data[i];
    }
    ws.send(binary.buffer);
```

##### 4.7 webSocket.bufferAmount
    实例对象的 bufferAmount 属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。
```javascript
    var data = new ArrayBuffer(10000000);
    socket.send(data);

    if (socket.bufferedAmount === 0) {
    // 发送完毕
    } else {
    // 发送还没结束
    }
```
##### 4.8 webSocket.onerror
    实例对象的onerror属性,用于指定报错的回调函数。
```javascript
    socket.onerror = function(event) {
    // handle error event
    };

    socket.addEventListener("error", function(event) {
    // handle error event
    });
```
