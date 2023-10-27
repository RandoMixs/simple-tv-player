(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
var video = document.querySelector('video'), canais, canal = null, fast = false, ultrafast = false, debug = false;

if(navigator.userAgent.includes('Tizen')) { // Tizen é bem lerdo, otimiza pra a TV desativando animações!
    // ultrafast = true; // Se a TV ainda tiver lerda, força desativa animações do CSS
    fast = true;
}

var hls = new Hls();
function play(url) {
    $('.err').css('display','none');
    $('.lds-default').fadeIn(300);
    if (Hls.isSupported()) {
        hls.destroy();
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, function (event, data) {
            if(data.fatal) {
                $('.lds-default').fadeOut(150).promise().then(()=>$('.err').fadeIn());
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
    }

    video.muted = false;
    video.volume = 0;

    $(video).one('canplay',()=>{
        video.muted = false;
        if(navigator.appVersion.indexOf("Win") != -1)
            video.volume = volume == 0 ? .2 : (volume / 100);
        
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                // Automatic playback started!
            }).catch(function(error) {
                video.muted = true;
                video.play();
            });
        }
        $('.lds-default').fadeOut(150).promise().then(()=>{
            if(navigator.appVersion.indexOf("Win") == -1) {
                $(video).animate({volume: 1}, 400);
            }
            $(video).fadeIn();
        });
    });
}

var volume = 0;
document.querySelector('.player.box').addEventListener("wheel", function (e) {
    if(e.deltaY < 0) {
        if(volume == 100) return;
        volume=volume+5;
    } else {
        if(volume == 0) return;
        volume=volume-5;
    }
    video.muted = false;
    video.volume = volume / 100;
    return false;
}, true);

$.getJSON('https://api.randomixs.com/tv', (data) => {
    canais = data.sort((a, b) => a.type.localeCompare(b.type))
    canais.forEach((element, i) => $('.canais.box').append(`<div class="canais opc" data-url="${element.url}" data-id="${i}"><div class="loader"><img src="${element.img}"></div></div>`));
    $('img').on('load', function () {
        $(this).animate({opacity: 1}, 300);
    });
    $('.canais.opc:eq(0)').addClass('selected');
    $('#loading').fadeOut(350, function () {
        play($('.canais.opc:eq(0)').attr('data-url'));
        $(window).trigger('mousemove');
        $(this).remove();
    });
    canal = 0;

    $('.canais.opc').on('click',function () {
        $('.canais.opc').removeClass('selected');
        $(`.canais.opc:eq(${$(this).attr('data-id')})`).addClass('selected');
        canal = parseInt($(this).attr('data-id'));
        play($(this).attr('data-url'));
    });

    if(ultrafast) $('*').addClass('notransition');
}).fail(() => {
    $('#loading').fadeOut(400, function () {
        $('.err').fadeIn(600);
        $(this).remove();
    });
    setTimeout(() => $('.err').fadeOut(200, () => document.location.reload(true)), 10000);
});

var forcewait = false, skipfast = false, skiptimeout, rst, start, a, b, opened = false;
$(document).on('keydown', (event) => {
    if(debug) {
        console.log(`keydown event`, event);
        $(`<div class="log"><b>[keydown]</b> keyCode: ${event.keyCode} <b>|</b> key: ${event.key}</div>`).appendTo('.debug').hide().fadeIn(400, function () {
            setTimeout(() => $(this).fadeOut(600, () => $(this).remove()), 3000);
        });
    }

    if(forcewait) return;
    if(!forcewait) setTimeout(function(){clearTimeout(rst);forcewait=false,rst=setTimeout(function(){$('.canais.opc .loader').removeClass('notransition')},250)},60);
    forcewait = true;
    clearTimeout(a);clearTimeout(mouseint);
    a = setTimeout(()=>{
        window.requestAnimationFrame(function () {
            $('.canais.box').css('left',`-${$('.canais.box').outerWidth()+1}px`);
            if(!fast) $('.player.box').css('width','100%');
        });
        opened = false;
    }, 4000);

    if(!opened) {
        window.requestAnimationFrame(function () {
            $('.canais.box').css('left','0px');
            if(!fast) $('.player.box').css('width',`calc(100% - ${$('.canais.box').outerWidth()+1}px)`);
        });
        opened = true;
        return;
    }
    // Troca
    if(canal == null) return;
    var ncanal = canal;
    if(event.keyCode == 40) { // ⬇️
        if((canal + 1) == canais.length) return;
        canal = (canal + 1);
        $('.canais.opc').removeClass('selected');
        $(`.canais.opc:eq(${canal})`).addClass('selected');
    } else if(event.keyCode == 38) { // ⬆️
        if(canal == 0) return;
        canal = (canal - 1);
        $('.canais.opc').removeClass('selected');
        $(`.canais.opc:eq(${canal})`).addClass('selected');
    }
    if(ncanal == canal) return;
    $('.canais.box').stop();
    window.requestAnimationFrame(function () {
        var removeafter=false;
        $('.canais.box').scrollTo('.canais.opc.selected', fast||skipfast?0:200, {interrupt: true, over: {top:-2}, start: function () {
            if(skipfast) {
                removeafter=true;
                $('.canais.opc .loader').addClass('notransition');
            }
        }, done: function () {
            if(removeafter) $('.canais.opc .loader').removeClass('notransition');
        }});
        if(!fast) {
            skipfast=true;
            clearTimeout(skiptimeout);
            skiptimeout = setTimeout(function(){skipfast=false},100);
        }
    });
    clearTimeout(b);
    b = setTimeout(()=>{
        $('video').animate({volume: 0}, 400).fadeOut(350).promise().then(()=>{
            play($('.canais.opc.selected').attr('data-url'));
            $('.lds-default').fadeIn();
        });
    }, 800);
});

var mouseint;
$(window).on('mousemove touchmove', function(e) {
    clearTimeout(a);clearTimeout(mouseint);
    mouseint = setTimeout(function() {
        $(document.body).css('cursor','none');
        window.requestAnimationFrame(function () {
            $('.canais.box').css('left',`-${$('.canais.box').outerWidth()+1}px`);
            if(!fast) $('.player.box').css('width','100%');
        });
        opened = false;
    },4000);
    if(!opened) {
        $(document.body).css('cursor','auto');
        window.requestAnimationFrame(function () {
            $('.canais.box').css('left','0px');
            if(!fast) $('.player.box').css('width',`calc(100% - ${$('.canais.box').outerWidth()+1}px)`);
        });
        opened = true;
        return;
    }
});

$(window).on('touchend', () => document.documentElement.requestFullscreen());