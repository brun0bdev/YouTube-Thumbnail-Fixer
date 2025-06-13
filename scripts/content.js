function applyStyles() {
    const styleId = 'youtube-thumbnail-fixer-style';
    let styleElement = document.getElementById(styleId);
  
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
  
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '' || 
                      window.location.href.includes('youtube.com/?') ||
                      window.location.href === 'https://www.youtube.com/';
    
    if (!isHomePage) {
      console.log("YouTube Thumbnail Fixer: Not on home page, skipping styles.");
      return;
    }

    const css = `
      #contents.ytd-rich-grid-renderer {
        display: grid !important;
        grid-template-columns: repeat(5, 1fr) !important;
        gap: 16px !important;
        max-width: none !important;
        width: 100% !important;
      }
      
      ytd-rich-item-renderer {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      
      ytd-rich-item-renderer ytd-thumbnail,
      ytd-rich-item-renderer ytd-thumbnail a,
      ytd-rich-item-renderer ytd-thumbnail #thumbnail {
        width: 100% !important;
        display: block !important;
      }
      
      ytd-rich-item-renderer .yt-core-image,
      ytd-rich-item-renderer img[src*="ytimg.com"],
      ytd-rich-item-renderer img[src*="ggpht.com"] {
        width: 100% !important;
        height: auto !important;
        object-fit: cover !important;
        aspect-ratio: 16/9 !important;
      }
      
      @media (max-width: 1600px) {
        #contents.ytd-rich-grid-renderer {
          grid-template-columns: repeat(4, 1fr) !important;
        }
      }
      
      @media (max-width: 1200px) {
        #contents.ytd-rich-grid-renderer {
          grid-template-columns: repeat(3, 1fr) !important;
        }
      }
      
      @media (max-width: 900px) {
        #contents.ytd-rich-grid-renderer {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
      
      /* Force override any conflicting YouTube styles */
      ytd-rich-grid-renderer[is-in-first-column] #contents {
        display: grid !important;
      }
    `;
  
    styleElement.textContent = css;
    console.log("YouTube Thumbnail Fixer: Styles applied.");
  }

  setTimeout(applyStyles, 1000);
  
  const observer = new MutationObserver((mutations) => {
    if (!window.location.pathname || window.location.pathname === '/') {
      let contentChanged = false;
      
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && 
                (node.tagName === 'YTD-RICH-ITEM-RENDERER' || 
                 node.querySelector && node.querySelector('ytd-rich-item-renderer'))) {
              contentChanged = true;
              break;
            }
          }
          if (contentChanged) break;
        }
      }
      
      if (contentChanged) {
        setTimeout(applyStyles, 500);
      }
    }
  });
  
  const contentArea = document.querySelector('#contents.ytd-rich-grid-renderer');
  if (contentArea) {
    observer.observe(contentArea, { childList: true, subtree: false });
  }
  
  let lastUrl = location.href;
  const checkUrlChange = () => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (currentUrl.includes('youtube.com') && 
          (!currentUrl.includes('/watch') && !currentUrl.includes('/shorts'))) {
        setTimeout(applyStyles, 1000);
      }
    }
  };
  
  setInterval(checkUrlChange, 2000);
  
  // Note: YouTube's class names and structure change frequently.
  // If this doesn't work:
  // Right-click on a thumbnail on the YouTube homepage and select "Inspect".
  // Look for elements like 'yt-core-image', 'ytd-rich-item-renderer', etc.
  // Update the CSS selectors in the 'css' variable above to match current structure.
  // Reload the extension (in chrome://extensions/) and refresh YouTube.
  // Check the browser console for any error messages.
