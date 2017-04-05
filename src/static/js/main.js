jQuery(document).ready(function($) {

	$(".header__icons__open").click(function(event) {
		/* Act on the event */
		event.preventDefault();
		$(".header__menu").addClass('header__menu--responsive-active')
		$(this).addClass('header__icons__none')
		$(".header__icons__close").addClass('header__icons__active')
		$(".header__menu .header__menu__icons__close").addClass('header__menu--responsive-active')
		$(".overlay").addClass("overlay--active")
	});

	$(".header__icons__close").click(function(event) {
		/* Act on the event */
		event.preventDefault();
		console.log("tst")
		$(".overlay").removeClass("overlay--active")
		$(".header__menu").removeClass('header__menu--responsive-active')
		$(".header__icons__open").removeClass('header__icons__none')
		$(this).removeClass('header__icons__active')
		$(".header__menu .header__menu__icons__close").removeClass('header__menu--responsive-active')
	});
});
