const axios = require('axios')

export default {
  methods: {
    getJSON (path, success, error) {
      axios.get(path)
        .then(function (response) {
          if (response.status === 200) {
            if (success) {
              success(response.data)
            }
          } else {
            if (error) {
              error(response)
            }
          }
        })
        .catch(function (e) {
          if (error) {
            error(e)
          }
        })
    },
    authAjaxForm (path, method, data, success, error) {
      var vm = this

      this.$jQuery.ajax({
        url: path,
        method: method,
        contentType: false,
        crossDomain: true,
        data: data,
        processData: false,
        headers: this.getAuth(),
        xhrFields: {
          withCredentials: true
        }
      })
        .fail(function (jqXHR, textStatus) {
          if (error) {
            if (jqXHR.status === 403) {
              window.alert(vm.$t('errorInvalidCredentials'))
              vm.$store.dispatch('ON_TOKEN_CHANGED', null)
            } else {
              error(jqXHR)
            }
          }
        })
        .done(function (data) {
          var t = vm.$store.getters.token

          // Check if the token is still valid. Renew it if so.
          if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
            t.createdOn = new Date().getTime()
            vm.$store.dispatch('ON_TOKEN_CHANGED', t)
          }

          if (success) {
            success(data)
          }
        })
    },
    authAjax (path, method, data, dataType, success, error) {
      var vm = this

      this.$jQuery.ajax({
        url: path,
        method: method,
        dataType: dataType,
        contentType: 'application/json; charset=utf-8',
        crossDomain: true,
        data: JSON.stringify(data),
        headers: this.getAuth(),
        xhrFields: {
          withCredentials: true
        }
      })
        .fail(function (jqXHR, textStatus) {
          if (error) {
            if (jqXHR.status === 403) {
              window.alert(vm.$t('errorInvalidCredentials'))
              vm.$store.dispatch('ON_TOKEN_CHANGED', null)
            } else {
              error(jqXHR)
            }
          }
        })
        .done(function (data) {
          var t = vm.$store.getters.token

          // Check if the token is still valid. Renew it if so.
          if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) <= t.lifetime)) {
            t.createdOn = new Date().getTime()
            vm.$store.dispatch('ON_TOKEN_CHANGED', t)
          }

          if (success) {
            success(data)
          }
        })
    },
    getAuth () {
      var t = this.$store.getters.token

      // Check if the token is still valid
      if (t && ((new Date().getTime() - new Date(t.createdOn).getTime()) > t.lifetime)) {
        t = null
        this.$store.dispatch('ON_TOKEN_CHANGED', t)
      }

      return {
        'Authorization': 'Bearer ' + (t ? t.token : null)
      }
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
