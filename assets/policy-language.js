(function () {
  var storageKey = 'habbitPolicyLanguage';
  var supportedLanguages = ['ko', 'en'];
  var select = document.querySelector('[data-language-select]');

  function isSupported(language) {
    return supportedLanguages.indexOf(language) !== -1;
  }

  function titleKey(language) {
    return language === 'en' ? 'pageTitleEn' : 'pageTitleKo';
  }

  function textKey(language) {
    return language === 'en' ? 'i18nEn' : 'i18nKo';
  }

  function getQueryLanguage() {
    var params = new URLSearchParams(window.location.search);
    var language = params.get('lang');
    return isSupported(language) ? language : null;
  }

  function getStoredLanguage() {
    try {
      var language = window.localStorage.getItem(storageKey);
      return isSupported(language) ? language : null;
    } catch (error) {
      return null;
    }
  }

  function getBrowserLanguage() {
    var language = (navigator.language || '').toLowerCase();
    return language.indexOf('ko') === 0 ? 'ko' : 'en';
  }

  function setStoredLanguage(language) {
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (error) {
      return;
    }
  }

  function updateUrlLanguage(language) {
    var url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState(null, '', url);
  }

  function localPathWithLanguage(href, language) {
    var url = new URL(href, window.location.href);
    url.searchParams.set('lang', language);
    return url.pathname + url.search + url.hash;
  }

  function applyLanguage(language, updateUrl) {
    var nextLanguage = isSupported(language) ? language : 'ko';
    document.documentElement.lang = nextLanguage;
    document.querySelectorAll('[data-lang-content]').forEach(function (node) {
      node.classList.toggle('is-active', node.getAttribute('data-lang-content') === nextLanguage);
    });
    document.querySelectorAll('[data-i18n-ko][data-i18n-en]').forEach(function (node) {
      node.textContent = node.dataset[textKey(nextLanguage)];
    });
    document.querySelectorAll('a[data-preserve-lang]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0) {
        return;
      }
      link.setAttribute('href', localPathWithLanguage(href, nextLanguage));
    });
    var pageTitle = document.body.dataset[titleKey(nextLanguage)];
    if (pageTitle) {
      document.title = pageTitle;
    }
    if (select) {
      select.value = nextLanguage;
    }
    setStoredLanguage(nextLanguage);
    if (updateUrl) {
      updateUrlLanguage(nextLanguage);
    }
  }

  var initialLanguage = getQueryLanguage() || getStoredLanguage() || getBrowserLanguage();
  applyLanguage(initialLanguage, Boolean(getQueryLanguage()));

  if (select) {
    select.addEventListener('change', function (event) {
      applyLanguage(event.target.value, true);
    });
  }
})();
