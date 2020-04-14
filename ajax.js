function createXHR() {
	// alert(arguments)
		// alert(arguments.callee.activeXString)
	if (XMLHttpRequest != undefined) { 
		return new XMLHttpRequest()
	} else if (typeof ActiveXObject != 'string') { // IE6以下是ActiveXObject对象实现的
		alert(arguments.callee.activeXString)
		if (typeof arguments.callee.activeXString != 'string') {

		var version = ["MSXMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"],i,len;
		for (i=0,len = version; i < len; i++) {
			try{
				new ActiveXObject(version[i]);
				arguments.callee.activeXString = version[i];
				break;
			} catch(ex) {
				console.error('此浏览器不支持原生http请求！')
			}
		}
	}
	return new ActiveXObject(arguments.callee.activeXString);
	} else {
		throw new Error('No XHR object available');
	}
}

/**
url:'请求的接口'
data: 'url?'问号后面的数据
methods: '请求的方法'，
dataTypy: '数据类型'，
contentType: '设置请求头信息'
beforeRequest： 请求前的拦截
timeout： 请求时间
isAsync： 是否异步
***/
 function ajax(params){
		var paramsMap = {
			url: params.url || "",
			type: (params.type || 'GET').toUpperCase(),
			isAsync: params.isAsyc || false,
			timeout: params.timeout || null,
			data: params.data || null,
			dataType: params.dataType,
			contentType: params.contentType || "application/x-www-form-urlencode; charset=utf-8",
			beforeRequest: params.beforeRequest || function() {},
			success: params.success || function() {},
			error: params.error || function() {}
		};
		paramsMap.beforeRequest();
		const xhr = createXHR();
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {
				try{
					if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
						paramsMap.success(xhr.response);
					} else {
						paramsMap.error();
					}	
				} catch (ex) {
					console.error(ex);
				}
				
			}
		}
		xhr.open(paramsMap.type, paramsMap.url + "?" + dealUrlParams(paramsMap.data), paramsMap.isAsync);
		xhr.timeout = paramsMap.timeout;
		xhr.send(dealUrlParams(paramsMap.data));
		
}	

// 拼接参数 get_ajax_serve?name=abc&age=123&id=456
function dealUrlParams(data) {
	 if( typeof data === 'object' ){ 
    var convertResult = "" ;  
    for(var c in data){  
      convertResult+= c + "=" + data[c] + "&";  
    }  
    convertResult=convertResult.substring(0,convertResult.length-1) 
    return convertResult; 
  }else{ 
    return data; 
  } 
}

ajax({ 
	  type:"", 
	  url:"http:localhost:3000/get_ajax_serve", 
	  timeout: 10000,
	  isAsyc: true,
	  data:{
	    "name":"abc",
	    "age":123,
	    "id":"456"
	　}, 
	  beforeRequest:function(){ 
	    //some js code 
	  }, 
	  success:function(msg){ 
	    document.querySelector('.innerSendText').innerHTML = msg;
	  }, 
	  error:function(){
	    console.log("error") 
	  } 
})
