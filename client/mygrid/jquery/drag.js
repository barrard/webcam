var dragSrcEl = null;

	function handleDragStart(e) {
	  // Target (this) element is the source node.
	  
	  dragSrcEl = this;
	  this.style.opacity = '0.4';

	  

	  e.dataTransfer.effectAllowed = 'move';
	  e.dataTransfer.setData('text/html', this.innerHTML);
	}

	function handleDragOver(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }

	  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

	  return false;
	}

	function handleDragEnter(e) {
	  // this / e.target is the current hover target.
	  this.classList.add('over');
	}

	function handleDragLeave(e) {
	  this.classList.remove('over');  // this / e.target is previous target element.
	}
	
	function handleDrop(e) {
	  // this/e.target is current target element.

	  if (e.stopPropagation) {
	    e.stopPropagation(); // Stops some browsers from redirecting.
	  }

	  // Don't do anything if dropping the same column we're dragging.
	  if (dragSrcEl != e.target) {
	    // Set the source column's HTML to the HTML of the column we dropped on.
	    dragSrcEl.innerHTML = this.innerHTML;
	    this.innerHTML = e.dataTransfer.getData('text/html');
	  }

	  return false;
	}

function handleDragEnd(e) {
  // this/e.target is the source node.
  var drags = document.querySelectorAll('.drag');

  for(var x = 0; x<drags.length;x++){
    drags[x].classList.remove('over');
  };
}