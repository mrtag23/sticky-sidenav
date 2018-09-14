// TODO: Refactor that code dude :/

(function ($) {
  // Global elements
  var $window = $(window),
    scrollSpeed = 700,
    // Using suffixed sections ID to stop default browser jump to anchor section.
    sectionSuffix = '-section',
    // Define generic elements sizes.
    headerHeight = 60,
    mobileDropdownHeight = 67,
    activeLinkFlag = 'is-active',
    $mobileDropdownBtn = $('.js-anchor-links__nav-control');

  // Adjusts top offset depending on additional fixed positioned elements.
  // customOffset can be defined for special cases, i.e. on manual scroll sidenav should stick right after user scrolls past header,
  // but on sidenav link click/anchor redirect, screen should scroll past header AND dropdown so content is not covered behind dropdown.
  var windowOffsetAdjust = function(customOffset) {
    customOffset = customOffset || 0;

    return headerHeight + customOffset;
  };

  // Implements `scroll to` functionality for sidebar links(using simple animation).
  $('.js-anchor-links__menu-link').on('click', function () {
    var $section = $(this.hash + sectionSuffix),
      additionalOffset = $window.width() < 1024 ? windowOffsetAdjust(mobileDropdownHeight) : windowOffsetAdjust();

    $('html, body').animate({
      scrollTop: ($section.offset().top - additionalOffset + 1)
    }, scrollSpeed);

    // Also close dropdown if on mobile.
    if ($window.width() < 1024) {
      $('.js-anchor-links__nav-control').trigger('click');
    }
  });

    /*
      Updates nav item status on scroll
      - adds/remove activeLinkFlag class name.
      - updates dropdown button text.
     */
    updateNavItemStatus = function() {
      var scrollTop = $window.scrollTop(),
        additionalOffset = $window.width() < 1024 ? windowOffsetAdjust(mobileDropdownHeight) : windowOffsetAdjust();

      $('.js-anchor-links__menu-link').each(function () {
        var $this = $(this),
          linkTopOffset = $($this.attr('href') + sectionSuffix).offset().top - additionalOffset;

        if (scrollTop >= linkTopOffset) {
          $('.js-anchor-links__menu-link').not($this).removeClass(activeLinkFlag);
          $mobileDropdownBtn.text($this.text());
          $this.addClass(activeLinkFlag);
        }
      })
    };

  $window.on('scroll', updateNavItemStatus);


  /*
    - Performs all needed offset calculations.
    - Fixes/un-fixes sidebar.
   */
  var $sidebar = $('.anchor-links__sidebar'),
    $nav = $('.anchor-links__nav '),
    $anchorLinks = $('.anchor-links'),
    additionalOffset = windowOffsetAdjust(),
    navViewportOffset = $sidebar.offset(),
    anchorLinksViewportOffset = $anchorLinks.offset(),
    stickyFlag = 'anchor-links__sidebar--sticky',
    absoluteFlag = 'anchor-links__sidebar--absolute',
    navOffset = navViewportOffset.top,
    anchorLinksOffset = anchorLinksViewportOffset.top + $anchorLinks.outerHeight(),

    // Calculates nav/window offsets and sets/un-sets nav as fixed.
    fixNav = function() {
      var pageOffset = window.pageYOffset + additionalOffset,
        pageSidebarOffset = pageOffset + $nav.outerHeight();

      if (navOffset < 1) {
        navOffset = $('.anchor-links__sidebar').offset().top;
      }

      if (pageOffset > navOffset && pageSidebarOffset < anchorLinksOffset) {
        $sidebar.addClass(stickyFlag).removeClass(absoluteFlag);
      } else if (pageOffset > navOffset && pageSidebarOffset > anchorLinksOffset) {
        // Add absoluteFlag as well in case the page was reloaded from not top position.
        $sidebar.addClass(stickyFlag).addClass(absoluteFlag);
      } else if (pageOffset > navOffset && pageSidebarOffset < anchorLinksOffset) {
        $sidebar.removeClass(absoluteFlag);
      } else {
        $sidebar.removeClass(stickyFlag);
      }
    };

  // Probably better call on window.load so the sections are loaded properly before calculation start.
  $window.on('scroll', fixNav);


  // Simple dropdown toggler, visible on mobile only.
  var $anchorMobileNav = $('.js-anchor-links__nav-control');

  $($anchorMobileNav).on('click', function () {
    var $this = $(this),
      $nav = $this.parents('.anchor-links__nav').eq(0);

    $nav.toggleClass('anchor-links__nav--active');
  });

  $($anchorMobileNav).keypress(function(e){
    // Detect enter key.
    if(e.which === 13){
      $anchorMobileNav.click();
    }
  });


  // Implements `scroll to` functionality when a url hash is present.
  $window.on('load', function () {
    if (window.location.hash) {
      var additionalOffset = $window.width() < 1024 ? windowOffsetAdjust(mobileDropdownHeight) : windowOffsetAdjust();

      $('body, html').animate({
        scrollTop: ($(window.location.hash + sectionSuffix).offset().top - additionalOffset + 1) + 'px'
      }, scrollSpeed)
    }
  });
})(jQuery);