const burger = document.querySelector(".header__burger");

burger.addEventListener("click", (e) => {
    const navMenu = document.querySelector(".header__nav");

    burger.classList.toggle("header__burger_active");
    navMenu.classList.toggle("header__nav_open")
})


// Experience Tab Navigation
const gapMediaQuery = window.matchMedia("(max-width: 768px)");
const phoneMediaQuery = window.matchMedia("(max-width: 576px)");

const tabButtons = document.querySelectorAll(".experience__tab-button");

if (gapMediaQuery.matches) {
    drawTabNaigationIndicator()
}

tabButtons.forEach(tabButton => {
    tabButton.addEventListener("click", e => {
        const tabNavigation = e.target.parentElement;
        const tabContent = tabNavigation.nextElementSibling;

        tabNavigation.querySelector(".experience__tab-button_active").classList.remove("experience__tab-button_active");
        e.target.classList.add("experience__tab-button_active");
        tabContent.style.opacity = 0;
        tabContent.addEventListener("transitionend", () => {
            tabContent.querySelector(".experience__tab-body_active").classList.remove("experience__tab-body_active");
            tabContent.style.opacity = ""
            tabContent.querySelector("." + e.target.dataset.tab).classList.add("experience__tab-body_active");
        }, { once: true})

        if (gapMediaQuery.matches) {
            drawTabNaigationIndicator();
        }
    })
})

gapMediaQuery.addEventListener("change", e => {
    if (e.matches) {
        drawTabNaigationIndicator()
    }
})

phoneMediaQuery.addEventListener("change", e => {
    if (e.matches) {
        drawTabNaigationIndicator()
    }
})

function drawTabNaigationIndicator() {
    const tabNavigation = document.querySelector(".experience__navigation");
    const activeTabButton = tabNavigation.querySelector(".experience__tab-button_active");
    let tabIndicator = tabNavigation.querySelector(".experience__navigation-indicator");

    tabIndicator.style.cssText = `
        left: ${activeTabButton.getBoundingClientRect().x - 16 + tabNavigation.scrollLeft}px;
        width: ${activeTabButton.offsetWidth}px;
    `
}

function formValidate(form) {

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const emailField = form.email;
    const nameField = form.name;

    let errors = 0;
    if (nameField.value.trim() === "") {
        nameField.classList.add("contacts__input_error");
        errors++;
    }

    if (!validateEmail(emailField.value)) {
        emailField.classList.add("contacts__input_error");
        errors++;
    }

    return errors
}

function disableInputs(form, disabled = true) {
    for (let i = 0; i < form.elements.length; i++) {
        form.elements[i].disabled = disabled
    }
}

function animOnScroll () {
    function startAnim(el) {
        el.classList.add("_anim_start");
        el.classList.remove("_anim");
    }

    const animateElements = document.querySelectorAll("._anim");

    if (animateElements.length) {
        for (let i = 0; i < animateElements.length; i++) {
            const elementRect = animateElements[i].getBoundingClientRect();
            
            if (elementRect.height > window.innerHeight) {
                if (elementRect.top < window.innerHeight - window.innerHeight / animateElements[i].dataset.animPoint) {
                    startAnim(animateElements[i])
                } 
            } else {
                if (elementRect.top < window.innerHeight - elementRect.height / animateElements[i].dataset.animPoint) {
                    startAnim(animateElements[i])
                } 
            }
        }
    }
}

async function sendForm(form) {
    const data = new FormData(form);
    
    disableInputs(form);

    const response = await fetch("https://app.aaccent.su/js/confirm.php", {
        method: "POST",
        body: data
    })

    if (response.ok) {
        setTimeout(() => {
            document.body.classList.add("_lock")
            document.querySelector(".contacts__popup").classList.add("contacts__popup_open")
        }, 3000)
        
    } else {
        console.log("Network error")
    }    

}

const subscribeForm = document.forms["subscribe-form"];
const requireFields = subscribeForm.querySelectorAll(".contacts__input_require");
const popup = document.querySelector(".contacts__popup");

for (let i = 0; i < requireFields.length; i++) {
    requireFields[i].addEventListener("input", e => {
        e.target.classList.remove("contacts__input_error")
    }) 
}

subscribeForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const errors = formValidate(subscribeForm);

    if (errors === 0) {
        sendForm(subscribeForm)
    } else {
        console.log("Fill require fields")
    }
})

window.addEventListener("scroll", animOnScroll)

popup.addEventListener("click", (e) => {
    if (e.target.closest(".contacts__popup-close") || e.target.classList.contains("contacts__popup-container")) {
        popup.classList.remove("contacts__popup_open");
        subscribeForm.reset();
        disableInputs(subscribeForm, false)
        popup.addEventListener("transitionend", (e) => {
            if (!e.target.classList.contains("contacts__popup-open")) {
                document.body.classList.remove("_lock")
            }
        })
    }
})

new Swiper(".portfolio__slider", {
    slidesPerView: 1.1,
    spaceBetween: 10,
    slidesOffsetAfter: 20,
    breakpoints: {
        480: {
            slidesPerView: 2,
            spaceBetween: 20,
            slidesOffsetAfter: 0
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 20
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 56
        }
    },
    navigation: {
        prevEl: ".portfolio__slider-arrow-prev",
        nextEl: ".portfolio__slider-arrow-next"
    }
})

const fullPageSlider = new Swiper(".page", {
    direction: "vertical",
    slidesPerView: "auto",

    slideClass: "page__screen",
    slideActiveClass: "page__screen_active",
    slideNextClass: "page__screen_next",
    slidePrevClass: "page__screen_prev",
    wrapperClass: "page__wrapper",

    observer: true,
    observeSlideChildren: true,
    observeParents: true,

    mousewheel: {
        sensitivity: 1
    },

    on: {
        init: function() {

        },

        slideChange: function () {

        },

        resize: function () {
            if (fullPageSlider.slides[fullPageSlider.realIndex].offsetHeight > fullPageSlider.wrapperEl.offsetHeight) {
                fullPageSlider.params.freeMode = true;
                fullPageSlider.init()
                console.log("free mode on")
            } else {
                console.log("free mode off")
            }
        }
    }
})

setTimeout(animOnScroll, 300)