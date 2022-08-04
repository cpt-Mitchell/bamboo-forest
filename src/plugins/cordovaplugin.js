export const TakePhoto = function(cb1, cb2) {
  navigator.camera.getPicture(
    imageURI => {
      cb1({ base64: imageURI, name: new Date().getTime() + '' })
    },
    cb2,
    {
      quality: 40,
      destinationType: Camera.DestinationType.DATA_URL,
      saveToPhotoAlbum: true
    }
  )
}

export const GetPhoto = function(cb1, cb2) {
  navigator.camera.getPicture(
    imageURI => {
      cb1({ base64: imageURI, name: new Date().getTime() + '' })
    },
    cb2,
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY }
  )
}
