/* eslint-disable no-irregular-whitespace */
/**
 * NOTHING_TO_INSTALL - 安装请求已发送到插件，但没有任何安装。错误代码值是1。
 * NOTHING_TO_UPDATE - 没有新的可供下载。错误代码值是2。
 * FAILED_TO_DOWNLOAD_APPLICATION_CONFIG - 无法从服务器下载新的应用程序配置。文件不存在或某些Internet连接问题。错误代码值是-1。
 * APPLICATION_BUILD_VERSION_TOO_LOW - 此更新的应用程序的构建版本太低。新的Web版本需要更新版本的应用程序。用户必须通过商店更新它。错误代码值是-2。
 * FAILED_TO_DOWNLOAD_CONTENT_MANIFEST - 无法从服务器下载新的内容清单文件。检查该chcp.manifest文件是否位于content_url应用程序配置中指定的根目录中。错误代码值是-3。
 * FAILED_TO_DOWNLOAD_UPDATE_FILES - 无法从服务器下载更新/新文件。检查chcp.manifest文件：所有列出的文件必须放在content_url应用程序配置中。另外，检查它们的哈希值：它们必须与哈希值中的哈希值匹配chcp.manifest。错误代码值是-4。
 * FAILED_TO_MOVE_LOADED_FILES_TO_INSTALLATION_FOLDER - 无法将下载的文件移动到安装文件夹。当设备上没有可用空间时可能会发生。错误代码值是-5。
 * UPDATE_IS_INVALID - 更新包已损坏。在安装任何插件之前，插件通过检查已加载chcp.manifest文件中指定的哈希值来再次验证下载的文件。如果它们不匹配或我们丢失了一些文件 - 则抛出此错误。错误代码值是-6。
 * FAILED_TO_COPY_FILES_FROM_PREVIOUS_RELEASE- 无法将www文件夹文件从先前版本复制到新版本文件夹。设备超出可用空间时可能会发生。错误代码值是-7。
 * FAILED_TO_COPY_NEW_CONTENT_FILES - 无法将新文件复制到内容目录。如果设备存储上没有足够的可用空间，则可能在安装期间发生。错误代码值是-8。
 * LOCAL_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND - 无法从本地存储加载当前应用程序配置。如果用户从外部存储中手动删除插件工作目录，则可能发生。如果是这样 - 我们将尝试回滚到之前的/捆绑版本。错误代码值是-9。
 * LOCAL_VERSION_OF_MANIFEST_NOT_FOUND - 无法从本地存储加载当前清单文件。如果用户从外部存储中手动删除插件工作目录，则可能发生。如果是这样 - 我们将尝试回滚到之前的/捆绑版本。错误代码值是-10。
 * LOADED_VERSION_OF_APPLICATION_CONFIG_NOT_FOUND - 无法从下载文件夹（本地存储）加载新版本的应用程序配置。如果用户从外部存储中删除插件工作目录，则可能在安装过​​程中发生。如果是这样 - 文件夹将在下次启动时恢复。错误代码值是-11。
 * LOADED_VERSION_OF_MANIFEST_NOT_FOUND - 无法从下载文件夹（本地存储）加载新版本的内容清单。如果用户从外部存储中删除插件工作目录，则可能在安装过​​程中发生。如果是这样 - 文件夹将在下次启动时恢复。错误代码值是-12。
 * FAILED_TO_INSTALL_ASSETS_ON_EXTERNAL_STORAGE - 无法将Web项目文件从应用程序包复制到外部存储。如果用户设备上没有足够的可用空间，则可能发生。在首次启动应用程序时执行操作。如果它失败了 - 插件无法完成它的工作。错误代码值是-13。
 * CANT_INSTALL_WHILE_DOWNLOAD_IN_PROGRESS- 当我们尝试chcp.installUpdate在更新下载进行时调用时抛出错误。您必须等到下载完成。错误代码值是-14。
 * CANT_DOWNLOAD_UPDATE_WHILE_INSTALLATION_IN_PROGRESS- 当我们chcp.fetchUpdate在安装过程中尝试调用时抛出错误。您必须等到安装完成。错误代码值是-15。
 * INSTALLATION_ALREADY_IN_PROGRESS- 当我们尝试调用时抛出错误chcp.installUpdate，但安装已在进行中。错误代码值是-16。
 * DOWNLOAD_ALREADY_IN_PROGRESS- 当我们尝试调用时抛出错误chcp.fetchUpdate，但下载已在进行中。错误代码值是-17。
 * ASSETS_FOLDER_IS_NOT_YET_INSTALLED- 当我们尝试调用chcp方法时，通常会发生错误，而插件正在外部存储上复制捆绑的源。这只能在第一次发布时发生。最终将删除此错误。错误代码值是-18。
 * NEW_APPLICATION_CONFIG_IS_INVALID - 当插件从服务器加载新应用程序的配置时引发错误，但它中有一些无效配置。最有可能的 - 失踪content_url或release财产。错误代码值是-19。
 */
export default function() {
  return new Promise(function(resolve, reject) {
    let chcp = window.chcp
    // 检测更新
    chcp.fetchUpdate(function(error, data) {
      // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
      if (error && error.code !== 2) {
        alert(`更新异常,代码:${error.code}, 信息:${error.description}`)
        resolve(true)
        return false
      }
      // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
      chcp.isUpdateAvailableForInstallation(function(error, data1) {
        if (error) {
          console.log(`没有加载到需要更新的资源`, error)
          resolve(true)
        } else {
          // 询问用户是否更新
          if (confirm('检测到新版本，是否更新')) {
            chcp.installUpdate(function(error) {
              if (data.config && data.config.description) {
                alert(`本次更新内容：${data.config.description || ''}`)
              }
              if (error) {
                // 更新失败
                console.log('Failed to install the update with error code: ' + error.code)
                console.log(error.description)
              } else {
                // 更新成功
                alert('资源更新完成！')
                console.log('Update installed!')
              }
              resolve(true)
            })
          } else {
            alert('您拒绝了此次更新')
            resolve(true)
          }
          // alert(`当前资源版本为:${data.currentVersion},服务器资源版本${data.readyToInstallVersion}`)
          // // 对比版本号
          // console.log('Current content version: ' + data.currentVersion)
          // console.log('Ready to be installed:' + data.readyToInstallVersion)
        }
      })
    })
  })
}
