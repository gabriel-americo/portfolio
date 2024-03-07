(function() {
  "use strict";

  // Função para selecionar um ou mais elementos do DOM
  const select = (el, all = false) => {
      el = el.trim();
      return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  }

  // Função para adicionar um ouvinte de evento a um ou mais elementos do DOM
  const on = (type, el, listener, all = false) => {
      const selectEl = select(el, all);
      if (selectEl) {
          if (all) {
              selectEl.forEach(e => e.addEventListener(type, listener));
          } else {
              selectEl.addEventListener(type, listener);
          }
      }
  }

  // Função para rolar a página para um elemento específico
  const scrollto = (el) => {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  }

  // Função para alternar uma classe em um elemento
  const toggleClass = (el, className) => {
      el.classList.toggle(className);
  }

  // Adiciona ou remove classes quando o botão de navegação móvel é clicado
  on('click', '.mobile-nav-toggle', function(e) {
      toggleClass(select('#navbar'), 'navbar-mobile');
      toggleClass(this, 'bi-list');
      toggleClass(this, 'bi-x');
  });

  // Adiciona ou remove classes quando um link de navegação é clicado
  on('click', '#navbar .nav-link', function(e) {
      let section = select(this.hash);
      if (section) {
          e.preventDefault();

          let navbar = select('#navbar');
          let header = select('#header');
          let sections = select('section', true);
          let navlinks = select('#navbar .nav-link', true);

          navlinks.forEach((item) => {
              item.classList.remove('active');
          });

          this.classList.add('active');

          if (navbar.classList.contains('navbar-mobile')) {
              toggleClass(navbar, 'navbar-mobile');
              let navbarToggle = select('.mobile-nav-toggle');
              toggleClass(navbarToggle, 'bi-list');
              toggleClass(navbarToggle, 'bi-x');
          }

          if (this.hash == '#header') {
              header.classList.remove('header-top');
              sections.forEach((item) => {
                  item.classList.remove('section-show');
              });
              return;
          }

          if (!header.classList.contains('header-top')) {
              header.classList.add('header-top');
              setTimeout(function() {
                  sections.forEach((item) => {
                      item.classList.remove('section-show');
                  });
                  section.classList.add('section-show');
              }, 350);
          } else {
              sections.forEach((item) => {
                  item.classList.remove('section-show');
              });
              section.classList.add('section-show');
          }

          scrollto(this.hash);
      }
  }, true);

  // Adiciona ou remove classes quando a página é carregada
  window.addEventListener('load', () => {
      if (window.location.hash) {
          let initial_nav = select(window.location.hash);

          if (initial_nav) {
              let header = select('#header');
              let navlinks = select('#navbar .nav-link', true);

              header.classList.add('header-top');

              navlinks.forEach((item) => {
                  item.getAttribute('href') == window.location.hash ? item.classList.add('active') : item.classList.remove('active');
              });

              setTimeout(function() {
                  initial_nav.classList.add('section-show');
              }, 350);

              scrollto(window.location.hash);
          }
      }
  });

  // Adiciona uma barra de progresso quando a seção de habilidades está visível
  let skillsContent = select('.skills-content');
  if (skillsContent) {
      new Waypoint({
          element: skillsContent,
          offset: '80%',
          handler: function(direction) {
              let progress = select('.progress .progress-bar', true);
              progress.forEach((el) => {
                  el.style.width = el.getAttribute('aria-valuenow') + '%';
              });
          }
      });
  }

  // Filtra os itens do portfólio quando um filtro é clicado
  window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
          let portfolioIsotope = new Isotope(portfolioContainer, {
              itemSelector: '.portfolio-item',
              layoutMode: 'fitRows'
          });

          let portfolioFilters = select('#portfolio-flters li', true);

          on('click', '#portfolio-flters li', function(e) {
              e.preventDefault();
              portfolioFilters.forEach(function(el) {
                  el.classList.remove('filter-active');
              });
              this.classList.add('filter-active');

              portfolioIsotope.arrange({
                  filter: this.getAttribute('data-filter')
              });
          }, true);
      }
  });

  // Adiciona lightbox aos itens do portfólio
  const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
  });

  // Adiciona lightbox aos detalhes do portfólio
  const portfolioDetailsLightbox = GLightbox({
      selector: '.portfolio-details-lightbox',
      width: '90%',
      height: '90vh'
  });

  // Adiciona um slider aos detalhes do portfólio
  new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false
      },
      pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
      }
  });

})();