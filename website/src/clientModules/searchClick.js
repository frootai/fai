// FrootAI: Make the search 🔍 pill clickable
// The search plugin lazy-loads — first click loads the index, second triggers search
// This script intercepts clicks on the pill and forwards them to the plugin

(function initSearchPill() {
  if (typeof document === 'undefined') return;
  
  function handleSearchClick() {
    document.addEventListener('click', function(e) {
      var pill = e.target.closest('.navbar__search');
      if (!pill) return;
      
      // Try to find and focus the input
      var input = pill.querySelector('input[type="search"], input');
      if (input) {
        e.preventDefault();
        input.focus();
        input.click();
        return;
      }
      
      // If no input yet, find the loading ring and click it
      var ring = pill.querySelector('[class*="loadingRing"], [class*="searchBar"] > div');
      if (ring) {
        ring.click();
        // Poll for the input to appear
        var attempts = 0;
        var timer = setInterval(function() {
          var newInput = pill.querySelector('input[type="search"], input');
          if (newInput) {
            newInput.focus();
            clearInterval(timer);
          }
          if (++attempts > 20) clearInterval(timer);
        }, 200);
      }
    });
  }
  
  if (document.readyState === 'complete') {
    handleSearchClick();
  } else {
    window.addEventListener('load', handleSearchClick);
  }
})();
