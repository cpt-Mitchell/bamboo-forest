export default function() {
  try {
    var permissions = cordova.plugins.permissions

    // <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    // <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    // <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    // <uses-permission android:name="android.permission.ACCESS_LOCATION_EXTRA_COMMANDS" />
    // <uses-permission android:name="android.permission.CAMERA" />
    // <uses-permission android:name="android.permission.READ_PHONE_STATE" />

    // var permissions = cordova.plugins.permissions
    // permissions.checkPermission(permission, successCallback, errorCallback)
    // permissions.requestPermission(permission, successCallback, errorCallback)
    // permissions.requestPermissions(permissions, successCallback, errorCallback)

    var list = [
      permissions.CAMERA, // 拍照
      permissions.WRITE_EXTERNAL_STORAGE, // 允许应用程序写入外部存储，如SD卡上写文件
      permissions.ACCESS_COARSE_LOCATION, // 允许应用程序通过WiFi或移动基站获取粗略的位置信息
      permissions.ACCESS_LOCATION_EXTRA_COMMANDS, // 允许应用程序访问额外的位置提供者命令
      permissions.ACCESS_FINE_LOCATION, // 允许应用程序通过GPS获取精确的位置信息
      permissions.READ_PHONE_STATE // 允许应用读取手机信息
    ]
    list.forEach(item => {
      permissions.checkPermission(
        item,
        status => {
          if (!status.hasPermission) {
            permissions.requestPermission(
              item,
              hasStatus => {
                if (!hasStatus.hasPermission) {
                }
              },
              () => {}
            )
          }
        },
        () => {}
      )
    })
    // permissions.requestPermissions(
    //   list,
    //   function(status) {
    //     alert(JSON.stringify(status))
    //   },
    //   function() {}
    // )
  } catch (err) {
    console.log('权限检测出错')
  }
}
