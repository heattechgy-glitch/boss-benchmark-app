document.addEventListener('DOMContentLoaded', function() {
  const list = document.getElementById('sortable-list');
  let draggedItem = null;
  let placeholder = null;

  function createPlaceholder() {
    const li = document.createElement('li');
    li.className = 'placeholder';
    li.style.height = '40px';
    li.style.backgroundColor = '#e0e0e0';
    li.style.border = '2px dashed #999';
    li.style.listStyle = 'none';
    li.style.marginBottom = '8px';
    return li;
  }

  function handleDragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    setTimeout(() => {
      e.target.style.opacity = '0.4';
    }, 0);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.target.closest('li');
    if (!target || target === draggedItem || target === placeholder) return;
    
    if (!placeholder) {
      placeholder = createPlaceholder();
    }
    
    const rect = target.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    
    if (e.clientY < midpoint) {
      target.parentNode.insertBefore(placeholder, target);
    } else {
      target.parentNode.insertBefore(placeholder, target.nextSibling);
    }
  }

  function handleDragEnter(e) {
    e.preventDefault();
  }

  function handleDragLeave(e) {
    // Optional: handle visual feedback on leave
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.insertBefore(draggedItem, placeholder);
      placeholder.parentNode.removeChild(placeholder);
    }
    
    return false;
  }

  function handleDragEnd(e) {
    e.target.style.opacity = '1';
    
    if (placeholder && placeholder.parentNode) {
      placeholder.parentNode.removeChild(placeholder);
    }
    
    placeholder = null;
    draggedItem = null;
    
    // Remove any lingering drag styles
    const items = list.querySelectorAll('li');
    items.forEach(item => {
      item.style.opacity = '1';
    });
  }

  function initializeDragAndDrop() {
    const items = list.querySelectorAll('li');
    
    items.forEach(item => {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragend', handleDragEnd);
    });
    
    list.addEventListener('dragover', handleDragOver);
    list.addEventListener('dragenter', handleDragEnter);
    list.addEventListener('dragleave', handleDragLeave);
    list.addEventListener('drop', handleDrop);
  }

  // Touch support for mobile devices
  let touchStartY = 0;
  let touchedItem = null;

  function handleTouchStart(e) {
    touchedItem = e.target.closest('li');
    if (!touchedItem) return;
    
    touchStartY = e.touches[0].clientY;
    touchedItem.style.opacity = '0.4';
  }

  function handleTouchMove(e) {
    if (!touchedItem) return;
    e.preventDefault();
    
    const touchY = e.touches[0].clientY;
    const items = Array.from(list.querySelectorAll('li'));
    
    for (const item of items) {
      if (item === touchedItem) continue;
      
      const rect = item.getBoundingClientRect();
      if (touchY > rect.top && touchY < rect.bottom) {
        const midpoint = rect.top + rect.height / 2;
        if (touchY < midpoint) {
          list.insertBefore(touchedItem, item);
        } else {
          list.insertBefore(touchedItem, item.nextSibling);
        }
        break;
      }
    }
  }

  function handleTouchEnd(e) {
    if (touchedItem) {
      touchedItem.style.opacity = '1';
      touchedItem = null;
    }
  }

  function initializeTouchSupport() {
    list.addEventListener('touchstart', handleTouchStart, { passive: false });
    list.addEventListener('touchmove', handleTouchMove, { passive: false });
    list.addEventListener('touchend', handleTouchEnd);
  }

  // Initialize
  if (list) {
    initializeDragAndDrop();
    initializeTouchSupport();
  }
});
