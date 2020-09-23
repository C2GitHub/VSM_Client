const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  triggerCode: state => state.app.triggerCode,
  imgsPath: state => state.app.imgsPath,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  sr_port: state => state.srport.port,
  sr_parser: state => state.srport.parser,
  camera_num: state => state.camera.cameraNum,
  saveImage: state => state.camera.saveImage,
  imageCheck: state => state.camera.imageCheck
}
export default getters
