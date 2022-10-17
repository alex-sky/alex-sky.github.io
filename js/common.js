$(document).ready(function(){
    $('input[data-mask]').each(function () {
        $(this).mask($(this).attr('data-mask'));
    });
    
    // Курсор в поле воода в нужном месте
    $.fn.setCursorPosition = function (pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };
    
    $('input[data-mask]').click(function () {
        if ($(this).val() == '+7(___) ___-__-__') {
            $(this).setCursorPosition(3);
        }
    });

    if ($(window).width() <= 800) {
        $(".swap-anc").removeAttr("data-toggle");
        $(".swap-anc").removeAttr("data-target");
    }

    $('#show-txt').click(function(){
        $(this).find('+b').removeClass('hidden');
        $(this).hide()
    })

    const openFaq = $('.faq-it');
    $('.quest').click(function () {
        if (!$(this).parent().hasClass('open')) {
            $(this).parent().addClass('open');
            $(this).parent().find('.answer').slideDown(200);
        } else {
            $(this).parent().removeClass('open');
            $(this).parent().find('.answer').slideUp(200);
        }
    });

    $('.extr-close').click(function(){
        $('.extr').fadeOut(200)
    });

    $('.close-call').click(function(){
        $('.form-callback').fadeOut(200)
    });
    
    $('.show-list, .city-list span').click(function(){
        $('.city-list').toggleClass('op');
    })

    if(window.innerWidth > 768) {
        setTimeout(function () {
            $('.form-callback').fadeIn(200);
        }, 30000);
    }

    setTimeout(function () {
        $('.extr').fadeIn(200);
    }, 10000);

    $('.range').on('input', function () {
        $(this).closest('.range-cont').find('.output').text($(this).val())
    });

    $('.nav-control').click(function () {
        if (!$(this).hasClass('op')) {
            $(this).addClass('op');
            $('.menu').css('display', 'flex');
        } else {
            $(this).removeClass('op');
            $('.menu').slideUp(200);
        }
    });

    $('.item-slide').click(function(){
        $(this).find('.show-inf').slideToggle(100);
    })

    $('.selec-day_list p').click(function(){
        $(this).parent().parent().find('.insert-inf').text($(this).text());
    });

    $('.insert-inf').bind("DOMSubtreeModified",function(){
        let text = `Позвонить ${$('.select-day .insert-inf').text()} точно в ${$('.select-hour .insert-inf').text()}:${$('.select-min .insert-inf').text()}`;
        $('.form-to-call').val(text);
    });

    //плавное движение по ссылке
    $(".scroll-link").click(function (event) {
		event.preventDefault();
        if ($('.nav-control').hasClass('op')) {
            $('.nav-control').removeClass('op');
            $('.menu').slideUp(200);
        }

		var id  = $(this).attr('href'),
			top = $(id).offset().top;
		$('body,html').animate({scrollTop: top}, 800);
	});

	$(".send-form, .form, .submit-form").submit(function(){
		var form = $(this);
		var data = form.serialize();
		$.ajax({
		   	type: 'POST',
			url: form.attr('action'),
		   	data: data,

		   	success: function(){
                $('.modal').modal('hide');
                form[0].reset();
                $('#thx').modal('show');
                var timer = setInterval(function () {
                    $('#thx').modal('hide');
                }, 3000);
			}
		});
		return false;
	});

    var pageValue = window.location.href.toString();
    $(".url").attr('value', pageValue);

    $("[data-theme]").click(function(){
        $(".name-form").attr('value', $(this).data('theme'));
        $('#modal h4 span').text($(this).data('theme'))
    })

    $('#scroll-to').click(function () {
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({
                scrollTop: $(scroll_el).offset().top
            }, 1000);
        }
        return false;
    });


    $('a[href^="tel:"]').click(function (e) {
        if($(this).data('toggle') !== 'modal') {
            setTimeout(function () {
                $('#popup').modal('show');
            }, 5500)
        }
    });

    $('.opros').click(function () {
        $('.opros-val').val($(this).text())
    });

    $('.opros-da').click(function () {
        $(this).parent().hide();
        $('.opros-block').fadeIn(0);
    });

    $('.complaint').click(function (e) {
        e.preventDefault();
        $(this).parent().hide();
        $('.complaint-block').fadeIn(0);
    });

    $('.get-form').click(function () {
        $(this).parent().hide();
        $('.opros-form').fadeIn(0);
    });

    $('.radio-opros').change(function () {
        if ($(this).attr('id') == 'opros5') {
            $('.set-date').show()
        } else {
            $('.set-date').hide()
        }
    });

    $('.gallery').slick({
        slidesToShow: 4,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ]
    });

    $('#show-city').click(function () {
        $('.hidden-link').show();
        $(this).hide()
    });
});