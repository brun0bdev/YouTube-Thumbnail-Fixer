function applyStyles() {
    const styleId = 'youtube-thumbnail-fixer-style';
    let styleElement = document.getElementById(styleId);
  
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
  
    const css = `
      ytd-rich-item-renderer {
        max-width: calc(19% - 10px) !important; 
        margin-right: 10px !important; 
        margin-bottom: 20px !important; 
      }     
    `;
    
    styleElement.textContent = css;
    console.log("YouTube Thumbnail Fixer: Styles applied.");
  }
  
  applyStyles();
  
  // YouTube uses dynamic loading, so we need to re-apply styles when new content is loaded.
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        applyStyles();
        break; 
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
