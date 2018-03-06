/**
 * Created by HZM on 2017/8/23.
 */
$(document).ready(function () {

    $('.top-nav li').mouseover(function () {
        $this = $(this);
        $this.find('.sn-dom').css('display', 'block');
    });
    $('.top-nav li').mouseout(function () {
        $this = $(this);
        $this.find('.sn-dom').css('display', 'none');
    });
});