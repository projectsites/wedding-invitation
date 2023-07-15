$(document).ready(function () {

    "use strict";

    // Smooth scroll to inner links

    $('.inner-link').smoothScroll({
        offset: -59,
        speed: 800
    });

    // Add scrolled class to nav

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('nav').addClass('scrolled');
        } else {
            $('nav').removeClass('scrolled');
        }
    });

    // Set nav container height for fixed nav

    if (!$('nav').hasClass('transparent')) {
        $('.nav-container').css('min-height', $('nav').outerHeight());
    }

    // Mobile toggle

    $('.mobile-toggle').click(function () {
        $('nav').toggleClass('nav-open');
    });

    $('.menu li a').click(function () {
        if ($(this).closest('nav').hasClass('nav-open')) {
            $(this).closest('nav').removeClass('nav-open');
        }
    });

    // Fade in background images

    setTimeout(function () {
        $('.background-image-holder').each(function () {
            $(this).addClass('fadeIn');
        });
        $('.header.fadeContent').each(function () {
            $(this).addClass('fadeIn');
        });
    }, 300);


    // Parallax scrolling

    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        if (window.requestAnimationFrame) {
            parallaxBackground();
            $(window).scroll(function () {
                requestAnimationFrame(parallaxBackground);
            });
        }
    } else {
        console.log("parallax 2")
        $('.parallax').removeClass('parallax');
    }

    // Radio box controls

    $('.radio-holder').click(function () {
        $(this).siblings().find('input').prop('checked', false);
        $(this).find('input').prop('checked', true);
        $(this).closest('.radio-group').find('.radio-holder').removeClass('checked');
        $(this).addClass('checked');
    });

    // Guest Reserved functions
    const reservedLimit = 4;

    // Create urlParams query string
    var urlParams = new URLSearchParams(window.location.search);
    // Get value of single parameter
    let reservedVal = urlParams.get('reserved') ? urlParams.get('reserved') : 0;

    var reservedElement = document.getElementById('reserved');
    var reservedSentenceVal = (reservedVal > 1 && reservedVal <= reservedLimit) ? `We have reserved ${reservedVal} seat(s) for you` : "Say you'll be there"
    reservedElement.innerHTML = reservedSentenceVal

    // Dynamic guest fields
    // adding field is limited by reservedLimit value
    if (reservedVal <= reservedLimit) {
        var formSection = document.getElementsByClassName('form-section');
        let formChild = formSection[0];

        function add(guestNo) {
            var newField = document.createElement('input');
            newField.setAttribute('type', 'text');
            newField.setAttribute('name', `Guest${guestNo}`);
            newField.setAttribute('class', 'guest');
            newField.setAttribute('size', 50);
            newField.setAttribute('placeholder', `Guest Name ${guestNo}`);
            formChild.firstElementChild.after(newField)
        }

        for (let i = 2; i <= reservedVal; i++) {
            add(i - 1);
        }

        // Get all appended child elements whose class are guest
        let childElements = Array.from(formChild.querySelectorAll('input[class="guest"]'));

        // Sort child elements in ascending order based on 'name' attribute
        childElements.sort((a, b) => {
            let nameA = a.getAttribute('name').toLowerCase();
            let nameB = b.getAttribute('name').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        // Append sorted child elements back to the parent
        childElements.forEach((element) => {
            formChild.appendChild(element);
        });
    }

    // Contact form code

    $('form.form-email').submit(function (e) {

        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        var thisForm = $(this).closest('form.form-email'),
            error = 0,
            originalError = thisForm.attr('original-error'),
            loadingSpinner;

        if (typeof originalError !== typeof undefined && originalError !== false) {
            thisForm.find('.form-error').text(originalError);
        }

        error = validateFields(thisForm);


        if (error === 1) {
            $(this).closest('form').find('.form-error').fadeIn(200);
            setTimeout(function () {
                $(thisForm).find('.form-error').fadeOut(500);
            }, 3000);
        } else {
            // Hide the error if one was shown
            $(this).closest('form').find('.form-error').fadeOut(200);
            // Create a new loading spinner while hiding the submit button.
            loadingSpinner = jQuery('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
            $(thisForm).find('input[type="submit"]').hide();

            jQuery.ajax({
                type: "POST",
                url: "https://script.google.com/macros/s/AKfycbz1K3JCqfhcLawpNvq7ouNGlwNXMkgPVooaW3fL_Ewwc7EcvAw1d5v6hfmx-gZl7Z7Y/exec",
                data: thisForm.serialize(),
                success: function (response) {
                    $(thisForm).find('.form-loading').remove();
                    $(thisForm).find('input[type="submit"]').show();
                    if (response.result === "success") {
                        thisForm.find('.form-success').fadeIn(1000);
                        thisForm.find('.form-error').fadeOut(1000);
                        setTimeout(function () {
                            thisForm.find('.form-success').fadeOut(500);
                        }, 5000);
                    }
                    // If error text was returned, put the text in the .form-error div and show it.
                    else {
                        // Keep the current error text in a data attribute on the form
                        thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                        // Show the error with the returned error text.
                        thisForm.find('.form-error').text(response).fadeIn(1000);
                        thisForm.find('.form-success').fadeOut(1000);
                    }
                },
                error: function (errorObject, errorText, errorHTTP) {
                    // Keep the current error text in a data attribute on the form
                    thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                    // Show the error with the returned error text.
                    thisForm.find('.form-error').text(errorHTTP).fadeIn(1000);
                    thisForm.find('.form-success').fadeOut(1000);
                    $(thisForm).find('.form-loading').remove();
                    $(thisForm).find('input[type="submit"]').show();
                }
            });
        }
        return false;
    });

    $('.validate-required, .validate-email').on('blur change', function () {
        validateFields($(this).closest('form'));
    });

    $('form').each(function () {
        if ($(this).find('.form-error').length) {
            $(this).attr('original-error', $(this).find('.form-error').text());
        }
    });

    function validateFields(form) {
        var name, error, originalErrorMessage;

        $(form).find('.validate-required[type="checkbox"]').each(function () {
            if (!$('[name="' + $(this).attr('name') + '"]:checked').length) {
                error = 1;
                name = $(this).attr('name').replace('[]', '');
                form.find('.form-error').text('Please tick at least one ' + name + ' box.');
            }
        });

        $(form).find('.validate-required').each(function () {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-email').each(function () {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        if (!form.find('.field-error').length) {
            form.find('.form-error').fadeOut(1000);
        }

        return error;
    }

});

function parallaxBackground() {
    $('.parallax').each(function () {
        var element = $(this);
        var scrollTop = $(window).scrollTop();
        var scrollBottom = scrollTop + $(window).height();
        var elemTop = element.offset().top;
        var elemBottom = elemTop + element.outerHeight();

        if ((scrollBottom > elemTop) && (scrollTop < elemBottom)) {
            if (element.is('section:first-of-type')) {
                var value = (scrollTop / 7);
                $(element).find('.background-image-holder').css({
                    transform: 'translateY(' + value + 'px)'
                });
            } else {
                var value = ((scrollBottom - elemTop) / 7);
                $(element).find('.background-image-holder').css({
                    transform: 'translateY(' + value + 'px)'
                });
            }

        }
    });
};

// Countdown code

(function () {
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    const countDown = new Date('12/09/2023').getTime(),
        x = setInterval(function () {

            const now = new Date().getTime(),
                distance = countDown - now;

            document.getElementById("days").innerText = Math.floor(distance / (day)),
                document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

            //do something later when date is reached
            if (distance < 0) {
                document.getElementById("headline").innerText = "So happy to celebrate this day with you both!";
                document.getElementById("countdown").style.display = "none";
                document.getElementById("content").style.display = "block";
                clearInterval(x);
            }
            //seconds
        }, 0)
}());