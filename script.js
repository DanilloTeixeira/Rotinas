// Marca visualmente o item referente à página atual no menu lateral.
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navigation-list a').forEach((link) => {
    const linkPage = link.getAttribute('href').replace('./', '');
    const isCurrentPage = linkPage === currentPage;

    link.classList.toggle('active', isCurrentPage);
    link.toggleAttribute('aria-current', isCurrentPage);
  });
});
