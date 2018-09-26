export default {
  methods: {
    getJSON (path, success, error) {
      var xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            if (success) {
              success(JSON.parse(xhr.responseText))
            }
          } else {
            if (error) {
              error(xhr)
            }
          }
        }
      }
      xhr.open('GET', path, true)
      xhr.send()
    },
    openUrl (url, newTab) {
      if (newTab) {
        window.open(url, '_blank')
      } else {
        window.location = url
      }
    }
  }
}
