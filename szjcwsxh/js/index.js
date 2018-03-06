/**
 * Created by HZM on 2017/8/23.
 */
$(document).ready(function () {
    /*select效果*/
    $('.sd-select').mouseover(function () {
        var index = $(this).index();
        $('.sd-select-content').eq(index).css('display','block');
    });
    $('.sd-select').mouseout(function () {
        var index = $(this).index();
        $('.sd-select-content').eq(index).css('display','none');
    });

    changeTextValues();
});

function changeTextValues() {
    var tags = $(".li1 p span");
    for(var i = 0; i < tags.length; i++) {
        var text = tags[i].textContent;
        var length = text.length;
        if(length > 40) {
            var newText = text.substring(0, 40);
            newText += "...";
            tags[i].innerHTML = newText;
        }
    }
}
