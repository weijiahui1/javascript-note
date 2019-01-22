new Vue({
  el:'#openCollageBlank',
  data:{
    code: code,
    token: "",
    AccessToken: "",
    UnionId: "",
    OpenId: "",
  },
  mounted: function mounted() {
    $("#id1").html($("#id1").html() + "6,");
    this.getToken();
  },
  methods: {
    getToken: function getToken() {
      if(!code){
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ gAppId +"&redirect_uri=" + toLocalUrl + "/activity/activitypage/gettokentest.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        return;
      }
      var that = this;
      $.ajax({
        type: 'POST',
        url: httpUrl + "/wechart/getTokenByCode?code=" + code,
        dataType: "json",
        success: function success(data) {
          if (data != null) {
            if (data.code == 99999) {
              //获取openID和token
              that.AccessToken = data.data.AccessToken;
              that.UnionId = data.data.UnionId;
              that.OpenId = data.data.OpenId;
              $("#id1").html($("#id1").html() + "7,");
              // alert("获取openID成功>>>>>" + data.data.OpenId + "获取UnionId成功>>>>>" + data.data.UnionId);
              $.ajax({
                type: 'POST',
                url: httpUrl + "/student/userRegist",
                dataType: "json",
                data: {
                  unionId: that.UnionId,
                  accessToken: that.AccessToken,
                  openId: that.OpenId,
                  storeOpenId: ""
                },
                success: function success(data) {
                  if (data != null) {
                    if (data.code == 99999) {
                      //获取openID和token
                      $("#id1").html($("#id1").html() + "8,");
                      that.token = data.data;
                      sessionStorage.setItem('token', that.token);
                      sessionStorage.setItem('openId', that.OpenId);
                      // alert("获取token成功>>>>>" + data.data);
                    } else {
                      alert("获取token失败>>>>>"+ data.data);
                      $("#id1").html($("#id1").html() + "10,");
                    }
                  }
                },
                error: function error() {
                  // alert("Error>>>>>");
                }
              });
            } else {
              alert("获取openID失败>>>>>");
              $("#id1").html($("#id1").html() + "9,");
              window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ gAppId +"&redirect_uri=" + toLocalUrl + "/activity/activitypage/gettokentest.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
            }
          }
        },
        error: function error() {
          // alert("Error>>>>>");
        }
      });
    },
  },
})
