window.onload = function () {
    var params = getURLParams();
    console.log(params);
    $.ajax({
        type: "POST",
        url: APIURL + "/v1/primWork/studentHomepage",
        dataType: "json",
        data: {
            token: params.token,
            studentId: params.studentId
        },
        async: false,
        success: function (res) {
            console.log(res);
            if (res.code === 99999) {
                $('.childinfo .avator').attr('src', res.data.headPhoto);
                $('.childinfo h2').html(res.data.username+'小朋友');
                $('.childinfo .grade').html('编程'+res.data.abilityLevel+'级');
                $('.childinfo .grade').addClass('grade'+res.data.abilityLevel);
                $('.workCount').html(res.data.workCount);
                $('.totalPraiseScore').html(res.data.totalPraiseScore);
                // $('.childinfo .describe').html('称号：'+res.data.abilityLevel+'级');
            }
        },
        error: function (xhr, status, error) {
        },
    });


    $.ajax({
        type: "POST",
        url: APIURL + "/v1/primWork/getStudentWorks",
        dataType: "json",
        data: {
            token: params.token,
            studentId: params.studentId,
            lastId: 0,
            num: -1
        },
        async: false,
        success: function (res) {
            console.log(res);
            if (res.code === 99999) {
                var worksHtml = ''
                for(var i=0; i<res.data.length; i++ ) {
                    if (res.data[i].workImage) {
                        worksHtml +='<div class="onework" workId='+res.data[i].workId+'>'+
                        '<div class="oneworki">'+
                            '<div class="onework-title">'+res.data[i].workName+'</div>'+
                            '<img src="'+res.data[i].workImage+'" alt="课程头图">'+
                            '<div class="onework-text">点赞量：'+res.data[i].praiseScore+
                            '</div>'+
                        ' <div class="onework-text">日期：'+res.data[i].createTime.split(' ')[0]+'</div> </div></div>'

                    } else {
                        worksHtml +='<div class="onework" workId='+res.data[i].workId+'>'+
                        '<div class="oneworki">'+
                            '<div class="onework-title">'+res.data[i].workName+'</div>'+
                            '<img src="https://appd.knowbox.cn/scratch3/images/init_headerImg.jpg" alt="课程头图">'+
                            '<div class="onework-text">点赞量：'+res.data[i].praiseScore+
                            '</div>'+
                        ' <div class="onework-text">日期：'+res.data[i].createTime.split(' ')[0]+'</div> </div></div>'
                    }
                }
                $(".allworks").html(worksHtml)
            }
        },
        error: function (xhr, status, error) {
        },
    });

    $('.question').on("click", function() {
        $(".answer").toggle()
    })
    $(".allworks").on("click", '.onework', function() {
        var workId = $(this).attr('workId');
        var tourl =  window.shareIP + '?fullscreen=true&token='+params.token+'&workId='+ workId;
        window.location.href = tourl;
    })
    $('.backBtn').on("click", function() {
        window.history.go(-1);
    })
}
