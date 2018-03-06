/**
 * Created by wangqi on 2016/12/15.
 */
//zepto.js的两个扩展，解决不能选中元素前后的所有兄弟节点
$.fn.prevAll = function (selector) {
    var prevEls = [];
    var el = this[0];
    if (!el) return $([]);
    while (el.previousElementSibling) {
        var prev = el.previousElementSibling;
        if (selector) {
            if ($(prev).is(selector)) prevEls.push(prev);
        }
        else prevEls.push(prev);
        el = prev;
    }
    return $(prevEls);
};
$.fn.nextAll = function (selector) {
    var nextEls = [];
    var el = this[0];
    if (!el) return $([]);
    while (el.nextElementSibling) {
        var next = el.nextElementSibling;
        if (selector) {
            if ($(next).is(selector)) nextEls.push(next);
        }
        else nextEls.push(next);
        el = next;
    }
    return $(nextEls);
};

$(function () {
    //顶部进度条样式
    $(".progress_bar_item_on").prevAll().css("background-color", "rgba(4, 190, 2, 0.8)");
    $(".progress_bar_item_on_end").prevAll().css("background-color", "rgba(4, 190, 2, 0.8)");

    //图片添加和上传，图片点击查看
    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $gallery = $("#gallery"),
        $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles");

    $uploaderInput.on("change", function (e) {
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
        for (var i = 0, len = files.length; i < len; ++i) {
           /* var file = files[i];

            if (url) {
                src = url.createObjectURL(file);
            } else {
                src = e.target.result;
            }

            $uploaderFiles.append($(tmpl.replace('#url#', src)));*/
            var file = files[i];

            // if (!/\/(?:jpegpnggif)/i.test(file.type)) return;

            var reader = new FileReader();

            // var li = document.createElement("li");
            // li.innerHTML = "<div class="progress"><span></span></div>";
            // $(".img-list").append($(li));

            reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;

                //                图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }

                function callback() {
                    var data = compress(img);

                    $uploaderFiles.append($(tmpl.replace('#url#', data)));

                    /*$(li).css("background-image", "url(" + data + ")");

                    upload(data, file.type, $(li));*/

                    img = null;
                }

            };

            reader.readAsDataURL(file);
        }
    });
    $uploaderFiles.on("click", "li", function () {
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);
    });
    $gallery.on("click", function () {
        $gallery.fadeOut(100);
    });

    //头像上传
    var $uploaderIdPhoto = $("#uploaderIdPhoto"),
        tmpl2 = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $uploaderFiles2 = $("#uploaderFiles2");
    $uploaderIdPhoto.on("change", function (e) {
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
        for (var i = 0, len = files.length; i < len; ++i) {
            var file = files[i];

            if (url) {
                src = url.createObjectURL(file);
            } else {
                src = e.target.result;
            }

            $uploaderFiles2.html($(tmpl2.replace('#url#', src)));
            // $uploaderIdPhoto.attr('style', "background-image:url(" + src + ")");
            $(".weui-uploader__input-box").hide();
        }
    });

    $uploaderFiles2.on("click", "li", function () {
        $uploaderIdPhoto.click();
    });

    //慢病切换按钮
    $(".cDisease_tab").find("a").on("click", function () {
        $(".cDisease_tab").find("a").removeClass("weui-bar__item_on");
        $(this).addClass("weui-bar__item_on");
    })
});

function compress(img) {
    var initSize = img.src.length;
    var width = img.width;
    var height = img.height;

    var canvas = document.createElement('canvas');
    canvas.id     = "CursorLayer";
    canvas.width  = 1224;
    canvas.height = 768;
    canvas.style.zIndex   = 8;
    canvas.style.position = "absolute";
    canvas.style.border   = "1px solid";
    document.body.appendChild(canvas);

    var tCanvas = document.createElement('canvas');
    tCanvas.id     = "CursorLayer";
    tCanvas.width  = 1224;
    tCanvas.height = 768;
    tCanvas.style.zIndex   = 8;
    tCanvas.style.position = "absolute";
    tCanvas.style.border   = "1px solid";
    document.body.appendChild(tCanvas);

    var ctx=canvas.getContext('2d');
    var tctx=tCanvas.getContext('2d');

    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000)>1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    }else {
        ratio = 1;
    }

    canvas.width = width;
    canvas.height = height;

//        铺底色
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //如果图片像素大于100万则使用瓦片绘制
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

//            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }

    //进行最小压缩
    var ndata = canvas.toDataURL("image/jpeg", 0.8);

/*    console.log("压缩前：" + initSize);
    console.log("压缩后：" + ndata.length);
    console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");*/

    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

    return ndata;
}

var dialog,
    name,
    tel,
    id,
    address,
    birth,
    rel,
    href,
    reg,
    text,
    sex,
    i,
    myScroll,
    pullDownEl,
    pullDownOffset,
    pullUpEl,
    pullUpOffset,
    generatedCount = 0,
    f = {
        dialog: function (e) {
            $("#" + e).on("click", function () {
                $("#dialog_" + e + "").fadeIn(0);
            });
            $("#dialog_" + e + " .weui-dialog__btn_default").on("click", function () {
                $("#dialog_" + e + "").fadeOut(0);
            });
        },
        dialog_class: function (e) {
            $("." + e).on("click", function () {
                $("#dialog_" + e + "").fadeIn(0);
            });
            $("#dialog_" + e + " .weui-dialog__btn_default").on("click", function () {
                $("#dialog_" + e + "").fadeOut(0);
            });
        },
        reg_name: function (e) {
            reg = /^[\u4E00-\u9FA5]+$/;
            if (e == "") {
                text = "请填写姓名";
                this.toptips(text);
                return false;
            }
            if (!reg.test(e)) {
                text = "姓名请使用汉字";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_tel: function (e) {
            if (e == "") {
                text = "请填写联系电话";
                this.toptips(text);
                return false;
            }
            reg = /^1([34578]\d{9})$/;
            if (!reg.test(e)) {
                text = "联系电话格式错误";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_id: function (e) {
            if (e == "") {
                text = "请填写身份证";
                this.toptips(text);
                return false;
            }
            reg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/;
            if (!reg.test(e)) {
                text = "身份证格式错误";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_height: function(e) {
            if (e == "") {
                text = "请输入身高";
                this.toptips(text);
                return false;
            }
            if (isNaN(e)) {
                text = "身高必须为数字";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_weight: function(e) {
            if (e == "") {
                text = "请输入体重";
                this.toptips(text);
                return false;
            }
            if (isNaN(e)) {
                text = "体重必须为数字";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_waist: function(e) {
            if (e == "") {
                text = "请输入腰围";
                this.toptips(text);
                return false;
            }
            if (isNaN(e)) {
                text = "腰围必须为数字";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_address: function (e) {
            if (e == "") {
                text = "请填写地址";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_address_select: function (e) {
            if (e == "请选择") {
                text = "请选择地址";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_txt: function (e, txt) {
            if (e == "") {
                text = txt;
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_rel: function (e) {
            if (e == "0") {
                text = "请选择与本人的关系";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_photo: function (e) {
            if (e == 0) {
                text = "请上传照片";
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_common: function (e, txt) {
            if (e == "") {
                text = "请填写" + txt;
                this.toptips(text);
                return false;
            }
            return true;
        },
        reg_canvas: function (e) {
            //当画布不为空画布时
            if (e.attr("data-hasDrawImage") === "false") {
                text = "请签名";
                this.toptips(text);
                return false;
            }
            return true;
        },
        toptips: function (e) {
            if ($(".weui-toptips").length > 0) {
                $(".weui-toptips").html(e)
            }
            else {
                $("body").prepend("<div class='weui-toptips weui-toptips_warn js_tooltips' style='display:none;'>" + e + "</div>")
            }
            $(".weui-toptips").show(200);
            setTimeout(function () {
                $(".weui-toptips").hide();
            }, 2000);
        },
        successToptips: function (e, href) {
            if ($(".weui-successToptips").length > 0) {
                $(".weui-successToptips").html(e)
            }
            else {
                $("body").prepend("<div class='weui-toptips weui-successToptips weui-toptips_warn js_tooltips' style='display:none;z-index: 333;'>" + e + "</div>")
            }
            $(".weui-successToptips").show(200);
            setTimeout(function () {
                $(".weui-successToptips").hide();
                location.href = href;
            }, 2000);
        },
        extract_id: function (e) {
            //获取出生日期
            birth = e.substring(6, 10) + "-" + e.substring(10, 12) + "-" + e.substring(12, 14);

            //获取性别
            if (parseInt(e.substr(16, 1)) % 2 == 1) {
                //男
                sex = "男";
            } else {
                //女
                sex = "女";
            }

            //获取年龄
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var age = myDate.getFullYear() - e.substring(6, 10) - 1;
            if (e.substring(10, 12) < month || e.substring(10, 12) == month && e.substring(12, 14) <= day) {
                age++;
            }
            return {birth: birth, sex: sex, age: age}
        },
        id_blur: function (e) {
            $("#" + e + "_id").on("blur", function () {
                if (f.reg_id($(this).val())) {
                    $("#" + e + "_birth").text(f.extract_id($(this).val()).birth);
                    $("#" + e + "_sex").text(f.extract_id($(this).val()).sex);
                }
            })
        },
        signData: function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            // + " 至 " + (date.getFullYear() + 1) + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        toast: function (e, txt) {
            var $toast = "<div id='toast' style='opacity: 0; display: none;'> " +
                "<div class='weui-mask_transparent'></div> " +
                "<div class='weui-toast'> " +
                "<i class='weui-icon-success-no-circle weui-icon_toast'></i> " +
                "<p class='weui-toast__content'>" +
                txt +
                "</p>" +
                "</div>" +
                "</div>";
            if ($("#toast").length > 0) {

            }
            else {
                $("body").prepend($toast)
            }
        },
        pullDownAction: function (e, type) {
            setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
                var el, li, i;
                el = document.getElementById('thelist');

                // for (i = 0; i < 3; i++) {
                //     li = document.createElement('li');
                //     li.innerText = 'Generated row ' + (++generatedCount);
                //     el.insertBefore(li, el.childNodes[0]);
                // }

                if (type == "yyzxRecord") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('a');
                        li.className = "weui-media-box weui-media-box_appmsg";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                                <div class="weui-media-box__bd">
                                    <h4 class="weui-media-box__title yyzx_title">${e[i].title}</h4>
                                    <div class="yyzx_info">
                                        <p class="weui-media-box__desc yyzx_desc">${e[i].time}</p>
                                        <div class="weui-media-box__desc yyzx_look">
                                            <img src="../images/look.png">${e[i].look}
                                        </div>
                                    </div>
                                </div>
                                <div class="weui-media-box__hd">
                                    <img class="weui-media-box__thumb" src="${e[i].img}">
                                </div>
                        `;
                        el.appendChild(li);
                    }
                }
                if (type == "Chat") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        var a = e[i].href.charAt(e[i].href.length-1);
                        console.log(a);
                        if(a == 0){
                            li.className = "speechkuang me_speech";
                            li.setAttribute("href", href);
                            li.innerHTML = `
                             <div class="speech">${e[i].title}</div>
                             <img class="touxiang me_touxiang" src="${e[i].img}" alt="">
                             <div class="zhizhen"></div>
                        `;
                        }else if(a == 1){
                            li.className = "speechkuang yisheng_speech";
                            li.setAttribute("href", e[i].href);
                            li.innerHTML = `
                              <img class="touxiang touxiang_yisheng" src="${e[i].img}" alt="">
                              <div class="speech speech_yisheng">${e[i].title}</div>
                              <div class="zhizhen zhizhen_yisheng"></div>
                        `;
                        }else if(a == 2){
                            li.className = "speechkuang me_speech";
                            li.setAttribute("href", e[i].href);
                            li.innerHTML = `
                               <div class="speech speech_img"><img src="../images/fwb_jkgl.png" alt=""></div>
                               <img class="touxiang me_touxiang" src="${e[i].img}" alt="">
                               <div class="zhizhen_img">
                                    <img src="../images/fwb_jkgl.png" alt="">
                               </div>
                        `;
                        }else if(a == 3){
                            li.className = "speechkuang yisheng_speech";
                            li.setAttribute("href", e[i].href);
                            li.innerHTML = `
                                <img class="touxiang touxiang_yisheng" src="${e[i].img}" alt="">
                                <div class="speech speech_yisheng speech_img">
                                    <img src="../images/fwb_jkgl.png" alt="">
                                </div>
                                <div class="zhizhen_img zhizhen_imgys">
                                    <img src="../images/fwb_jkgl.png" alt="">
                                </div>
                        `;
                        }


                        // el.appendChild(li);
                        // el.children[0].before(li)
                        $(el).find("div").eq(0).before(li);
                        // el.children('div').get(0).before(li);
                    }
                }


                myScroll.refresh();		//数据加载完成后，调用界面更新方法   Remember to refresh when contents are loaded (ie: on ajax completion)
            }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
        },
        pullUpAction: function (e, type) {
            setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!
                var el, li, i;
                el = document.getElementById('thelist');
                // $.ajax({
                //     type: "GET",
                //     url: "",
                //     data: {},
                //     dataType: "json",
                //     success: function (data) {
                //         var json = data;
                //         $(json).each(function () {
                //             li = document.createElement('a');
                //             li.className = "media col-xs-12"
                //             li.innerHTML = '<div class="media-left"><img class="media-object" src="images/炒鸡毛菜.png" alt="..."></div><div class="media-body"><h4 class="media-heading">我是大米你信不</h4><div class="media-heading"><div><img src="images/swsc_ok.png"/>肾脏病</div><div><img src="images/swsc_no.png"/>高血压</div><div><img src="images/swsc_dd.png"/>高血糖</div></div></div><div class="media-body"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>';
                //             el.appendChild(li, el.childNodes[0]);
                //         })
                //     }
                // });
                // if (type == "serviceRecord") {
                //     for (i = 0; i < e.length; i++) {
                //         li = document.createElement('div');
                //         li.className = "weui-form-preview";
                //         li.innerHTML = "<div class='weui-form-preview__hd' data-type='" + type + "'>" +
                //             "<div class='weui-form-preview__item'> " +
                //             "<label class='weui-form-preview__label'>" + e[i].id + "</label> " +
                //             "<em class='weui-form-preview__value done'>已经完成</em> " +
                //             "</div> " +
                //             "</div>" +
                //             "<div class='weui-form-preview__bd'>" +
                //             "<div class='weui-form-preview__item'>" +
                //             "<label class='weui-form-preview__label'>家庭成员</label>" +
                //             "<span class='weui-form-preview__value'>" + e[i].family + "</span>" +
                //             "</div>" +
                //             "<div class='weui-form-preview__item'>" +
                //             "<label class='weui-form-preview__label'>建立时间</label>" +
                //             "<span class='weui-form-preview__value'>" + e[i].time + "</span>" +
                //             "</div>" +
                //             "</div>" +
                //             "<div class='weui-form-preview__ft'>" +
                //             "<a class='weui-form-preview__btn weui-form-preview__btn_primary' href='服务记录_服务详情（旧）.html'>查看</a>" +
                //             "</div>";
                //         el.appendChild(li);
                //     }
                // }
                if (type == "onlineConsulting") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        li.className = "weui-panel onlineConsulting_panel onlineConsulting_my";
                        li.setAttribute("onclick", "window.location='热门问题_详情_已回复.html'");
                        li.innerHTML = "<div class='weui-panel__bd'> " +
                            "<div class='weui-media-box weui-media-box_text onlineConsulting_box'> " +
                            "<p class='weui-media-box__desc'>" + e[i].text + "</p> " +
                            "<ul class='weui-media-box__info'> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].time + "</li> " +
                            "<li class='weui-media-box__info__meta weui-media-box__info__meta_extra'>" + e[i].sex + "</li> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].age + "</li> " +
                            "</ul> " +
                            "</div> " +
                            "</div> " +
                            "<div class='weui-panel__ft onlineConsulting_tab'> " +
                            "<a class='weui-cell weui-cell_access weui-cell_link'> " +
                            "<div class='weui-cell__bd'> " +
                            "<span class='weui-badge'>医生回复</span> " +
                            "</div> " +
                            "</a> " +
                            "</div>";
                        el.appendChild(li);
                    }
                }
                if (type == "myOnlineConsulting") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        li.className = "weui-panel onlineConsulting_panel onlineConsulting_my";
                        li.setAttribute("onclick", "window.location='我的咨询_详情_已回复.html'");
                        li.innerHTML = "<div class='weui-panel__bd'> " +
                            "<div class='weui-media-box weui-media-box_text onlineConsulting_box'> " +
                            "<p class='weui-media-box__desc'>" + e[i].text + "</p> " +
                            "<ul class='weui-media-box__info'> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].time + "</li> " +
                            "<li class='weui-media-box__info__meta weui-media-box__info__meta_extra'>" + e[i].sex + "</li> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].age + "</li> " +
                            "</ul> " +
                            "</div> " +
                            "</div> " +
                            "<div class='weui-panel__ft onlineConsulting_tab'> " +
                            "<a class='weui-cell weui-cell_access weui-cell_link'> " +
                            "<div class='weui-cell__bd'> " +
                            "<span class='weui-badge weui-badge-success'>已回复</span> " +
                            "</div> " +
                            "</a> " +
                            "</div>";
                        el.appendChild(li);
                    }
                }
                if (type == "report") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        li.className = "weui-panel";
                        var liImg = "";
                        for (var j = 0; j < e[i].pic.length; j++) {
                            liImg += "<li class='weui-uploader__file' style='background-image:url(" + e[i].pic[j].url + ")'></li> "
                        }
                        li.innerHTML =
                            "<div class='weui-panel__bd' data-time='" + e[i].time + "'> " +
                            "<div class='weui-media-box weui-media-box_text'> " +
                            "<h4 class='weui-media-box__title'>" + e[i].title + "</h4> " +
                            "<div class='weui-uploader'> " +
                            "<div class='weui-uploader__bd'> " +
                            "<ul class='weui-uploader__files'> " + liImg +
                            "</ul> " +
                            "</div> " +
                            "</div> " +
                            "<ul class='weui-media-box__info'> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].time + "</li> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].name + "</li> " +
                            "<li class='weui-media-box__info__meta weui-media-box__info__meta_extra'>苏州附二医院 儿科</li> " +
                            "</ul> " +
                            "</div> " +
                            "</div> ";
                        el.appendChild(li);
                    }
                }
                if (type == "serviceRecord") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('a');
                        li.className = "weui-panel";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML =
                            "<div class='weui-panel__bd' data-time='" + e[i].time.substr(0, 8) + "'> " +
                            "<div class='weui-media-box weui-media-box_text'> " +
                            "<h4 class='weui-media-box__title'>" + e[i].title + "</h4> " +
                            "<ul class='weui-media-box__info'> " +
                            "<li class='weui-media-box__info__meta'>" + e[i].time.substr(5, 99) + "</li> " +
                            "</ul> " +
                            "</div> " +
                            "</div> ";
                        el.appendChild(li);
                    }
                }
                if (type == "hygiene") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('a');
                        li.className = "weui-media-box weui-media-box_appmsg";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                                <div class="weui-media-box__bd">
                                    <h4 class="weui-media-box__title home_myDoctor">${e[i].title}</h4>
                                    <div>
                                        <p class="weui-media-box__desc hygiene_desc">${e[i].time}</p>
                                        <div class="weui-media-box__desc hygiene_look">
                                            <img src="../images/look.png">${e[i].look}
                                        </div>
                                    </div>
                                </div>
                                <div class="weui-media-box__hd">
                                    <img class="weui-media-box__thumb" src="${e[i].img}">
                                </div>
                        `;
                        el.appendChild(li);
                    }
                }
                if (type == "Cereal_grains") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        li.className = "weui-panel weui-panel_access";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                                <div class="page__bd">
                                    <div class="weui-panel weui-panel_access">
                                        <div class="weui-panel__bd">
                                            <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
                                                <div class="weui-media-box__hd">
                                                    <img src="../images/img_swzl_defa@2x.png" alt="" class="weui-media-box__thumb">
                                                </div>
                                                <div class="weui-media-box__bd">
                                                    <p class="weui-media-box__desc">煎饼</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                        `;
                        el.appendChild(li);
                    }
                }
                if (type == "yyzxRecord") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('a');
                        li.className = "weui-media-box weui-media-box_appmsg";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                                <div class="weui-media-box__bd">
                                    <h4 class="weui-media-box__title yyzx_title">${e[i].title}</h4>
                                    <div class="yyzx_info">
                                        <p class="weui-media-box__desc yyzx_desc">${e[i].time}</p>
                                        <div class="weui-media-box__desc yyzx_look">
                                            <img src="../images/look.png">${e[i].look}
                                        </div>
                                    </div>
                                </div>
                                <div class="weui-media-box__hd">
                                    <img class="weui-media-box__thumb" src="${e[i].img}">
                                </div>
                        `;
                        el.appendChild(li);
                    }
                }
                if (type == "doctor") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('a');
                        // li.className = "weui-media-box weui-media-box_appmsg";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                              <li href="咨询界面.html" class="weui-panel weui-panel_access">
                                    <div class="page__bd">
                                        <div class="weui-panel weui-panel_access">
                                            <div class="weui-panel__bd">
                                                <div href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
                                                    <div class="weui-media-box__hd">
                                                        <img src="${e[i].img}" alt="" class="weui-media-box__thumb">
                                                    </div>
                                                    <div class="weui-media-box__bd">
                                                        <div class="weui-media-box__desc">
                                                            <ul class="dietitian">
                                                                <li>
                                                                    <p class="name_yys">${e[i].name}</p>
                                                                    <p>${e[i].level}</p>
                                                                </li>
                                                                <li class="li2">
                                                   <span>
                                                       ${e[i].region}
                                                   </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                        `;
                        el.appendChild(li);
                    }
                }
                if (type == "problem") {
                    for (i = 0; i < e.length; i++) {
                        li = document.createElement('div');
                        li.className = "weui-panel weui-panel_access details_list";
                        li.setAttribute("href", e[i].href);
                        li.innerHTML = `
                              <div class="page__bd">
                                    <div class="weui-panel weui-panel_access">
                                        <div class="weui-panel__bd">
                                            <div class="weui-media-box weui-media-box_appmsg">
                                                <div class="weui-media-box__hd yywd_left">
                                                    <img src="../images/440364196732792978.png" alt="" class="weui-media-box__thumb">
                                                    <p>9/28</p>
                                                </div>
                                                <div class="weui-media-box__bd yywd_center">
                                                    <div class="weui-media-box__desc">
                                                        <ul class="yywd_content">
                                                            <li>
                                                                <p class="p1">
                                                                    <span class="span1">慢性心脏病的问题关于慢性心脏病的问题</span>
                                                                </p>
                                                                <p class="p2">
                                                                    <span class="span3">金闾社区卫生服务中心</span>
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="weui-media-box__hd yywd_right">
                                                    <span class="span4 span5">已解答</span>
                                                </div>
                                                <div class="zans">
                                                    <img src="../images/88224803472618659.png" alt="">
                                                    <span>1319</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="details">
                                            <div class="weui-uploader weui-media-box">
                                                <div class="weui-uploader__bd">
                                                    <div class="my-gallery" data-pswp-uid="1">
                                                        <figure>
                                                            <a href="../images/fwb_gxt.png" data-size="472x314">
                                                                <img src="../images/fwb_gxt.png">
                                                            </a>
                                                        </figure>
                                                        <figure>
                                                            <a href="../images/fwb_chcr.png" data-size="472x314">
                                                                <img src="../images/fwb_chcr.png">
                                                            </a>
                                                        </figure>
                                                        <figure>
                                                            <a href="../images/fwb_jkgl.png" data-size="472x314">
                                                                <img src="../images/fwb_jkgl.png">
                                                            </a>
                                                        </figure>
                                                        <figure>
                                                            <a href="../images/fwb_jkgl.png" data-size="472x314">
                                                                <img src="../images/fwb_jkgl.png">
                                                            </a>
                                                        </figure>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="yyjd">
                                                <div class="jd_left">
                                                    阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止
                                                    阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止
                                                </div>
                                                <div class="jd_right">
                                                    <img src="../images/doctor.png" alt="">
                                                    <p>陈少思思</p>
                                                </div>
            
                                                <div class="zhizhen"></div>
                                            </div>
                                            <div class="yyjd me_tell">
                                                <div class="jd_right jd_right_me">
                                                    <img src="../images/440364196732792978.png" alt="">
                                                    <!--<p>陈少思思</p>-->
                                                </div>
                                                <div class="zhizhen zhizhen_me"></div>
                                                <div class="jd_left jd_left_me">
                                                    阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止
                                                    阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止阻止冒泡阻止冒泡阻止
                                                </div>
                                            </div>
                                            <a class="ask_questions" href="咨询界面.html">
                                                继续提问
                                                <span>&gt;</span>
                                            </a>
                                        </div>
            
                                    </div>
                              </div>
                        `;
                        el.appendChild(li);
                    }
                }

                myScroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
            }, 0);	// <-- Simulate network congestion, remove setTimeout from production!
        },
        loaded: function (e, type) {
            pullDownEl = document.getElementById('pullDown');
            pullDownOffset = pullDownEl.offsetHeight;
            pullUpEl = document.getElementById('pullUp');
            pullUpOffset = pullUpEl.offsetHeight;

            myScroll = new iScroll('wrapper', {
                scrollbarClass: 'myScrollbar', /* 重要样式 */
                useTransition: false, /* 此属性不知用意，本人从true改为false */
                topOffset: pullDownOffset,
                onRefresh: function () {
                    if (pullDownEl.className.match('loading')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                    } else if (pullUpEl.className.match('loading')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                    }
                },
                onScrollMove: function () {
                    if (this.y > 5 && !pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'flip';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                        this.minScrollY = 0;
                    } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                        pullDownEl.className = '';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                        this.minScrollY = -pullDownOffset;
                    } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'flip';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                        this.maxScrollY = this.maxScrollY;
                    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                        pullUpEl.className = '';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                        this.maxScrollY = pullUpOffset;
                    }
                },
                onScrollEnd: function () {
                    if (pullDownEl.className.match('flip')) {
                        pullDownEl.className = 'loading';
                        pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                        f.pullDownAction(e, type);	// Execute custom function (ajax call?)
                    } else if (pullUpEl.className.match('flip')) {
                        pullUpEl.className = 'loading';
                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                        f.pullUpAction(e, type);	// Execute custom function (ajax call?)
                    }
                }
            });

            setTimeout(function () {
                document.getElementById('wrapper').style.left = '0';
            }, 800);
        },
        ocToggle: function (e) {
            $(e).each(function () {
                var that = $(this);
                $(this).find(".weui-cell_link").on("click", function () {
                    if ($(this).find(".weui-cell__ft").hasClass("on")) {
                        $(this).find(".weui-cell__ft").removeClass("on");
                        that.find(".onlineConsulting_answer").hide();
                    }
                    else {
                        $(this).find(".weui-cell__ft").addClass("on");
                        that.find(".onlineConsulting_answer").show(300);
                    }
                });
            })
        },
        star: function (star) {
            star.find(".star ul li a").mouseenter(function () {
                var txt = $(this).attr("data-name");
                var x = $(this).parent("li").index();
                // star.find(".tips").html(txt).css("left",-6+x*24).show();
            });
            star.find(".star ul li a").mouseleave(function () {
                // star.find(".tips").html("").css("left",0).hide();
            });
        },
        topFixed: function (e) {
            var min = 9999;
            var minTime = "";
            var top_Arr = [];
            e.each(function () {
                top_Arr.push({
                    top: ($(this).offset().top + 57),
                    time: $(this).find(".weui-panel__bd").attr("data-time")
                });
            });

            for (y in top_Arr) {
                top_Arr[y].top = Math.abs(top_Arr[y].top);
            }
            for (var i = 0; i < top_Arr.length; i++) {
                if (top_Arr[i].top <= min) {
                    min = top_Arr[i].top;
                    minTime = top_Arr[i].time;
                }
            }
            return minTime;
        },
        slide: function() {
            var expansion = null; //是否存在展开的list
            var container = document.querySelectorAll('.mb_record .weui-form-preview');
            for(var i = 0; i < container.length; i++) {
                var x, y, X, Y, swipeX, swipeY;
                container[i].addEventListener('touchstart', function (event) {
                    x = event.changedTouches[0].pageX;
                    y = event.changedTouches[0].pageY;
                    swipeX = true;
                    swipeY = true;
                    if (expansion) { //判断是否展开，如果展开则收起
                        expansion.parent()[0].className = "mb_record";
                    }
                });
                container[i].addEventListener('touchmove', function (event) {
                    X = event.changedTouches[0].pageX;
                    Y = event.changedTouches[0].pageY;
                    // 左右滑动
                    if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                        // 阻止事件冒泡
                        event.stopPropagation();
                        if (X - x > 10) { //右滑
                            event.preventDefault();
                            $(this).parent()[0].className = "mb_record"; //右滑收起
                        }
                        if (x - X > 10) { //左滑
                            event.preventDefault();
                            $(this).parent()[0].className = "swipeleft"; //左滑展开
                            expansion = $(this);
                        }
                        swipeY = false;
                    }
                    // 上下滑动
                    if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                        swipeX = false;
                    }
                });
            }
        }
    };