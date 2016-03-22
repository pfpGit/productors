/**
 * Created by hp1 on 2016/3/11.
 */
$(function () {


    showHelpList();
    tabs();
    addAnimate('.bounceBox','bounce');
    addAnimate('.bounceInBox','bounceIn');
    addAnimate('.rotateIn','rotateIn');
    addAnimate('.zoomInDown','zoomInDown');
    addAnimate('.shake','shake');
    addAnimate('.flip','flip');
    setInterval('AutoScroll("#scrollDiv")',3000)
    select('#firstPay');
    select('#times');
    inputChange();
    menu();
    showEWM();
    scrollLink();
    jump();
    layerValid();

})


function showHelpList() {
    //帮助中心，列表展开
    $('#showHelpList>li').each(function () {
        $(this).find('p').on('click', function () {
            var $p=$(this);
            var $detail=$p.next('div');
            if ($p.hasClass('c-orange')) {
                $p.removeClass('c-orange');
                $detail.slideUp();
            }else {
                $p.addClass('c-orange');
                $detail.slideDown();
            }

        });
    });
}

function tabs() {
    //tab切换
    $('#tabs').find('span').each(function(index) {
        $(this).on('click', function () {
            $(this).addClass('active').siblings('span').removeClass('active');
            $('#tabContainer .list').eq(index).show().siblings().hide();
        })
    });
}


function addAnimate(objBox,animateClass) {
    //动画效果
    $(objBox).find('.animated').hover(function () {
        $(this).addClass(animateClass);
    }, function () {
        var $o=$(this);
        setTimeout(function(){
            $o.removeClass(animateClass);
        },300);
    })

}

function slideUp() {
    //新闻公告滚动函数
    $('.slideUp').find('li').each(function () {
        var $this=$(this);
        var listH=$this.height();
        console.info(listH);
        $(this).animate({top:listH},500, function () {
            $('.slideUp li:first').before($('.slideUp li:last'));
        })
    });



}

function AutoScroll(obj){
    //首页新闻滚动
    $(obj).find("ul").animate({
        marginTop:"-45px"
    },500,function(){
        $(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
    });
}

function select(obj) {
    //分期购计算器选项
    $(obj).find('td:not(:first)').each(function () {
        $(this).on('click', function () {
            $(obj).find('.p-banner-select').removeClass('select');
            $(this).find('.p-banner-select').addClass('select');
            calc();
        });
    })
}

function inputChange() {
    //输入内容后计算
    $('#total').blur(function () {
        if (isNaN( $('#total').val())) {
            alert('请输入正确的金额！')
        }else{
            calc()
        }
    });
    $('#other').blur(function () {
        var otherVal=parseInt($('#other').val());
        var arr=[6,9,12,15,18,24];
        if (arr.indexOf(otherVal) >= 0 ) {
            calc()
        }else{
            alert('请输入正确的分期：6/9/12/15/18/24！')
        }

    });
}

function calc() {
    //分期购计算器
    var total=parseFloat($('#total').val());        //商品总金额
    var first=parseFloat($('#firstPay').find('.p-banner-select.select').text())/100;    //首付金额
    var times=parseInt($('#times').find('.p-banner-select.select').text()|$('#times').find('.p-banner-select.select').val());//分期数
    var $valObj=$('.p-banner-calc-form-div-p-b');
    var payBack = 0.00;

    if (total && times) {
        var capital = total * ( 1 - first)    //贷款本金
        var monthRate=0.0175;
        var monthPay=(capital*monthRate*Math.pow(1+monthRate,times))/(Math.pow(1+monthRate,times)-1);

        var arr = new Array();
        arr['A12'] = new Array('500','6000','0.00413166128323957','0.00275444085549305');
        arr['A24'] = new Array('500','6000','0.00516876352536180','0.00344584235024120');
        arr['A6'] = new Array('500','6000','0.00778756536981330','0.00519171024654220');
        arr['A9.1'] = new Array('500','1000','0.01815546427087940','0.01210364284725290');
        arr['A12.1'] = new Array('500','1000','0.01701154283926040','0.01134102855950700');
        arr['B9.1'] = new Array('1001','3000','0.01815546427087940','0.01210364284725290');
        arr['B12.1'] = new Array('1001','3000','0.01701154283926040','0.01134102855950700');
        arr['A15.1'] = new Array('1001','3000','0.01662573657932350','0.01108382438621570');
        arr['A18.1'] = new Array('1001','3000','0.01454605918172400','0.00969737278781600');
        arr['A24.1'] = new Array('1001','3000','0.01479009165039200','0.00986006110026133');
        arr['A9.2'] = new Array('3001','6000','0.01815546427087940','0.01210364284725290');
        arr['A12.2'] = new Array('3001','6000','0.01701154283926040','0.01134102855950700');
        arr['A15.2'] = new Array('3001','6000','0.01428041494125070','0.00952027662750047');
        arr['A18.2'] = new Array('3001','6000','0.01318811249765050','0.00879207499843369');
        arr['A24.2'] = new Array('3001','6000','0.01125210033199330','0.00750140022132890');
        arr['B9.2'] = new Array('6001','10000','0.01493969466115660','0.00995979644077104');
        arr['B12.2'] = new Array('6001','10000','0.01407223213406390','0.00938148808937592');
        arr['B15.2'] = new Array('6001','10000','0.01328864459574510','0.00885909639716340');
        arr['B18.2'] = new Array('6001','10000','0.01151458073363320','0.00767638715575547');
        arr['B24.2'] = new Array('6001','10000','0.01125210033199330','0.00750140022132890');

        var k1 = arr['A'+(parseInt(first*10)/10+times)];
        var k2 = arr['B'+(parseInt(first*10)/10+times)];
        var fact_rate_cw = 0.0;//财务管理费率
        var fact_rate_fw = 0.0;//服务管理费率
        if (k1 != undefined) {
            fact_rate_cw = k1[2];
            fact_rate_fw = k1[3];
        }else if (k1 == undefined && k2 != undefined && capital >= k2[0] && capital <= k2[1]) {
            fact_rate_cw = k2[2];
            fact_rate_fw = k2[3];
        }else{
            return;
        }
         var bxf = capital * 0.0007;//保险费
         var cwglf = capital * fact_rate_cw;//财务管理费
         var fwf = capital * fact_rate_fw;//服务管理费
         payBack =Math.ceil((fwf + cwglf + monthPay + bxf)*100)/100;
        $valObj.text(payBack);

    }
}



function menu() {
    $('.menu').click(function () {
        $('.p-header-nav-r').slideToggle();

    })
}

function showEWM() {
    //显示二维码
    $('#ewmShow').hover(function () {
        $('#ewm').show();
    }, function () {
        $('#ewm').hide();
    })
}

function scrollLink() {
    //导航滚动到顶部固定 + 滚动到对应导航状态激活
    var $navObj=$('#linkNav');
    var $link=$('.LINK');
    //var $links=$('#links');
    var $win=$(window);
    if ($navObj.length > 0) {//判断对象是否存在
        var navH =$navObj.offset().top - 100;

        $win.scroll(function () {
            if ($(this).scrollTop() >= navH) {
                $navObj.addClass('navFixed fadeInUp animated');
            }else {
                $navObj.removeClass('navFixed fadeInUp animated');
            }
            $link.each(function (index) {
                if ($(window).scrollTop() >= $link.eq(index).offset().top - 100) {
                    $navObj.find('span').eq(index).addClass('active').siblings('span').removeClass('active');
                }
            })
        })
    }
}

function jump() {
    //点击跳转
    var $navObj=$('#linkNav');
    var $link=$('.LINK');
    $navObj.find('span').each(function (index) {
        $(this).on('click', function () {
            var h=$link.eq(index).offset().top - 60;
            $("html,body").animate({ scrollTop:h},300);
        })
    })
}

function layerValid() {
    $('.p-banner-btn a').on('click', function () {

        var layHtml='<form action="" class="p-layer-calc-form">'
            +'<h3 class="p-banner-calc-form-h3 bd-bottom">分期购计算器</h3>'
            +'<div class="p-banner-calc-form-div">'
            +'<input id="name" type="text" class="p-banner-input" placeholder="您的姓名"/>'
            +'<input id="phone" type="text" class="p-banner-input mt-10" placeholder="手机号码"/>'
            +'<div class="clear mt-10">'
            +'<div class="w60 fl-left">'
            +'<input id="code" type="text" class="p-banner-input" placeholder="手机验证码"/>'
            +'</div>'
            +'<div class="w40 fl-left txt-right">'
            +'<input id="btn" type="button" class="p-layer-valid-btn radius-4" value="发送验证码"/>'
            +'</div>'
            +'</div>'
            +'<p class="p-banner-calc-form-div-p">'
            +'所在区域：'
            +'<select class="p-layer-valid-select" name="" id="">'
            +'<option value="">广东省</option>'
            +'</select>'
            +'<select class="p-layer-valid-select" name="" id="">'
            +'<option value="">请选择</option>'
            +'</select>'
            +'<select class="p-layer-valid-select" name="" id="">'
            +'<option value="">请选择</option>'
            +'</select>'
            +'</p>'
            +'<div class="p-banner-btn">'
            +'<a id="submitbtn" href="javascript:void(0)" class="p-btn-a">提交申请</a>'
            +'</div>'
            +'<p class="p-banner-calc-form-div-note c-gray-l">稍后所在城市代表将联系您</p>'
            +'</div>'
            +'</form>';

        var layerHtml2='<form action="" class="p-layer-calc-form">'
            +'<h3 class="p-banner-calc-form-h3 bd-bottom">分期购计算器</h3>'
            +'<div class="p-banner-calc-form-div txt-center p-layer-pd">'
            +'<img class="p-layer-valid-img" src="public/images/p-submit-success.png" alt=""/>'
            +'<p class="txt-center">提交成功！</p>'
            +'</div>'
            +'</form>';

        var indexL=layer.open({
            type: 1, //page层
            title: false,
            shade: 0.7, //遮罩透明度
            moveType: 1, //拖拽风格，0是默认，1是传统拖动
            shift: 1, //0-6的动画形式，-1不开启
            content:layHtml,
            success: function () {
                $('#submitbtn').on('click', function () {
                    layer.close(indexL);
                    //在这里面输入任何合法的js语句
                    layer.open({
                        type: 1, //page层
                        title: false,
                        shade: 0.7, //遮罩透明度
                        moveType: 1, //拖拽风格，0是默认，1是传统拖动
                        shift: 1, //0-6的动画形式，-1不开启
                        content:layerHtml2
                    });

                });
            }

        });
    });
}