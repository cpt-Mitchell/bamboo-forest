# hwagain-dingalk-oa-approval

竹林 APP

### 打包发布注意

cordova-hcp.json

```
  正式： "content_url": "http://wxmp.hwagain.com:60008/hwagain/zhulinapk/project/www"
  测试： "content_url": "http://wxmp.hwagain.com:60008/hwagain/zhulinapk/project-test/www"
```

src/main.js

```
  正式： request
        .get('http://wxmp.hwagain.com:60008/hwagain/zhulinapk/version.json?t=' + new Date().getTime())
  测试： request
        .get('http://wxmp.hwagain.com:60008/hwagain/zhulinapk/version-test.json?t=' + new Date().getTime())
```

.env.production

```
  正式： VUE_APP_BASE_API = 'https://wxmp.hwagain.com/api/'
  测试： VUE_APP_BASE_API = 'https://wxmp.hwagain.com/apitest/'
```

### 打包命令

```
    "build": "yarn lint --fix && vue-cli-service build && yarn hotInit",
```
直接执行`npm run build`脚本，运行完后把dist文件夹里所有文件拷贝至cordova项目的www文件夹中