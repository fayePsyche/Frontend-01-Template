/* 
    1、正则表达式，匹配所有 Number 直接量 
*/
    // 十进制
        var decReg = /^(([+-]?[1-9][0-9]*|0)?(\.[0-9]*[1-9]+)?)$/
    // 二进制
        var binaryReg = /^0b([0-1]+$)/
    // 八进制
        var OctalReg = /^0o([0-7]+$)/
    // 十六进制
        var hexReg = /^0[Xx]([0-9a-fA-F]+$)/
    // 所有
        var allReg = / (^(([+-]?[1-9][0-9]*|0)?(\.[0-9]*[1-9]+)?)$) | (^0b([0-1]+$)) | (^0o([0-7]+$)) | (^0[Xx]([0-9a-fA-F]+$)) /

/* 
    2、UTF-8 Encoding函数
 */
function encoding_utf8(str){
    var buffer = [];
    var byteSize = 0;

    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
              byteSize += 1;
              buffer.push(code);
        } 
        else if (0x80 <= code && code <= 0xd7ff) {
              byteSize += 2;
              buffer.push((192 | (31 & (code >> 6))));
              buffer.push((128 | (63 & code)))
        } 
        else if ((0x800 <= code && code <= 0xd7ff) 
                || (0xe000 <= code && code <= 0xffff)) {
              byteSize += 3;
              buffer.push((224 | (15 & (code >> 12))));
              buffer.push((128 | (63 & (code >> 6))));
              buffer.push((128 | (63 & code)))
        }
     }
     for (i = 0; i < buffer.length; i++) {
          buffer[i] = buffer[i].toString(16);

     }
     if (byteSize <= 0xff) {
         return [0, byteSize].concat(buffer)
     } else {
         return [byteSize >> 8, byteSize & 0xff].concat(buffer)
     }
}

/*
    3、正则表达式，匹配所有的字符串直接量，单引号和双引号
*/
    var doubleReg = /"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/
    var singleReg = /'(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'/