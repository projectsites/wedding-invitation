"use strict";

// app script url
const appScriptUrl = "https://script.google.com/macros/s/AKfycbwmV5-PLxo-kmIQYb5Ycq4OWUwa2RQUb8aXg-rqT6ATDJrYa2fDG5Egs3g9sLgzjSni/exec";

// get current url/params
let params = window.location.search;
// disable/enable right click value
const disableRightClick = true;

// set its current url to logo
let a = document.getElementById('logo');
a.href = params;

// audio volume
let bgAudio = document.getElementById("bg-audio");
bgAudio.volume = 0.04;

// disable right click
if (disableRightClick) {
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

$(document).ready(function () {

    "use strict";

    // Smooth scroll to inner links
    $('.inner-link').smoothScroll({
        offset: -59,
        speed: 800
    });

    /* ----- TYPING EFFECT ----- */
    // let typingEffect = new Typed(".typedText", {
    //     strings: ["Randy &amp; Alyssa"],
    //     loop: true,
    //     typeSpeed: 100,
    //     backSpeed: 80,
    //     backDelay: 2000
    // })

    // SCROLL REVEAL ANIMATION
    const srTop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 2000,
        reset: true
    });

    srTop.reveal('.header', {});
    srTop.reveal('.header-headline', { delay: 100 });
    srTop.reveal('.header-countdown-timer', { delay: 200 });
    srTop.reveal('.header-text', { delay: 300 });

    srTop.reveal('.details-2-first-pic', { interval: 500 });

    srTop.reveal('.rsvp-2-headline', { delay: 100 });

    srTop.reveal('.gallery', { delay: 200 });

    const srLeft = ScrollReveal({
        origin: 'left',
        distance: '80px',
        duration: 2000,
        reset: true
    });

    srLeft.reveal('.details-2-entourage', { interval: 500 });

    srLeft.reveal('.details-2-title', { delay: 200 });
    srLeft.reveal('.details-1-title', { delay: 100 });

    const srRight = ScrollReveal({
        origin: 'right',
        distance: '80px',
        duration: 2000,
        reset: true
    });


    srRight.reveal('.details-1-info', { interval: 200 });

    srRight.reveal('.google-map', { delay: 300 });
    
    srRight.reveal('.form-wrapper', { delay: 200 });

    srRight.reveal('.details-2-details', { interval: 200 });

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

    // audio autoplay when user interact/scroll with the page
    function handleScroll() {
        var audio = document.getElementById('bg-audio');
        audio.play(); // Play the audio
    }
    window.addEventListener('scroll', handleScroll);

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

    const reserevedMessage = `We have reserved <u>${reservedVal}</u> seats in your name`;
    const defaultMessage = "Say you'll be there";

    var reservedElement = document.getElementById('reserved');
    var reservedSentenceVal = (reservedVal > 1 && reservedVal <= reservedLimit) ? reserevedMessage : defaultMessage;
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
            newField.setAttribute('id', 'guest');
            newField.setAttribute('class', 'validate-guests');
            newField.setAttribute('size', 50);
            newField.setAttribute('placeholder', `Guest Name ${guestNo}`);
            formChild.firstElementChild.after(newField)
        }

        for (let i = 2; i <= reservedVal; i++) {
            add(i - 1);
        }

        // Get all appended child elements whose id are guest
        let childElements = Array.from(formChild.querySelectorAll('input[id="guest"]'));

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

    // reset form value
    function resetFormValue() {
        let name = document.getElementById('name');
        let contact = document.getElementById('contact');
        let guests = document.getElementsByClassName('validate-guests');

        name.value = '';
        contact.value = '';
        Array.from(guests).forEach(guest => {
            guest.value = '';
        })
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

        if (error === 2) {
            $(this).closest('form').find('.guest-required-notice').fadeIn(200);
        } else if (error === 1) {
            $(this).closest('form').find('.form-error').fadeIn(200);
            setTimeout(function () {
                $(thisForm).find('.form-error').fadeOut(500);
            }, 3000);
        } else {
            // Hide the error if one was shown
            $(this).closest('form').find('.form-error').fadeOut(200);
            $(this).closest('form').find('.guest-required-notice').fadeOut(200);
            // Create a new loading spinner while hiding the submit button.
            loadingSpinner = jQuery('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
            $(thisForm).find('input[type="submit"]').hide();

            // Get the modal
            const popupModal = document.getElementById("rsvp-image-popup");
            const popupModalImg = document.getElementById("rsvp-image");

            // Get the <span> element that closes the modal
            const span = document.getElementsByClassName("close")[0];

            // When the user clicks on <span> (x), close the modal
            span.onclick = function () {
                popupModal.style.display = "none";
            }

            jQuery.ajax({
                type: "POST",
                url: appScriptUrl,
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

                        // display the popup modal image after 1 second
                        setTimeout(function () {
                            popupModal.style.display = "block";
                            popupModalImg.src = "images/rsvp.png";
                        }, 1000);
                        // reset the value of input fields
                        resetFormValue();
                    }
                    // If error text was returned, put the text in the .form-error div and show it.
                    else {
                        // Keep the current error text in a data attribute on the form
                        thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
                        // Show the error with the returned error text.
                        thisForm.find('.form-error').text(response.message).fadeIn(1000);
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

    $('.validate-required, .validate-contact, .validate-guests').on('blur change', function () {
        validateFields($(this).closest('form'));
    });

    $('form').each(function () {
        if ($(this).find('.form-error').length) {
            $(this).attr('original-error', $(this).find('.form-error').text());
        }
    });

    function validateFields(form) {
        var name, errorStatus, originalErrorMessage;

        $(form).find('.validate-required[type="checkbox"]').each(function () {
            if (!$('[name="' + $(this).attr('name') + '"]:checked').length) {
                errorStatus = 1;
                name = $(this).attr('name').replace('[]', '');
                form.find('.form-error').text('Please tick at least one ' + name + ' box.');
            }
        });

        $(form).find('.validate-guests').each(function () {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                errorStatus = 2;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-contact').each(function () {
            if (!/^\d{11}$/.test($(this).val())) {
                form.find('.form-error').text('Please input valid contact number.');
                $(this).addClass('field-error');
                errorStatus = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-required').each(function () {
            if ($(this).val() === '') {
                form.find('.form-error').text('Please fill out required fields');
                $(this).addClass('field-error');
                errorStatus = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        if (!form.find('.field-error').length) {
            form.find('.form-error').fadeOut(1000);
        }

        return errorStatus;
    }

});

function onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}

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
