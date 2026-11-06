(() => {
  const filterButtons = Array.from(document.querySelectorAll('.filter-chip'));
  const searchInput = document.getElementById('terminal-search');
  const cards = Array.from(document.querySelectorAll('.card'));
  const sections = Array.from(document.querySelectorAll('.node-section'));
  const emptyState = document.getElementById('empty-state');
  const resetBtn = document.getElementById('reset-filter-btn');
  const statusRegion = document.getElementById('filter-status');

  let activeFilter = 'all';
  let announceTimer = null;

  function applyFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    for (const card of cards) {
      const categories = (card.dataset.category || '').split(/\s+/);
      const tags = (card.dataset.tags || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCategory = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesQuery = !query || tags.includes(query) || text.includes(query);

      const isVisible = matchesCategory && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount++;
      }
    }

    for (const section of sections) {
      const hasVisibleCard = section.querySelector('.card:not([hidden])') !== null;
      section.hidden = !hasVisibleCard;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }

    if (statusRegion) {
      clearTimeout(announceTimer);
      announceTimer = setTimeout(() => {
        statusRegion.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
      }, 200);
    }
  }

  for (const btn of filterButtons) {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter || 'all';
      for (const b of filterButtons) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeFilter = 'all';
      for (const b of filterButtons) {
        b.setAttribute('aria-pressed', String(b.dataset.filter === 'all'));
      }
      if (searchInput) {
        searchInput.value = '';
      }
      applyFilters();
    });
  }

  // Keyboard shortcut: press '/' to focus search input
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      const tag = document.activeElement?.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        searchInput?.focus();
      }
    } else if (e.key === 'Escape' && document.activeElement === searchInput && searchInput.value) {
      searchInput.value = '';
      applyFilters();
    }
  });
})();
