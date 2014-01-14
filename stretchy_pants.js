jQuery.fn.calculateNaturalAspectRatio = function(callBack) {
		var img = this[0];
		var naturalWidth = img.naturalWidth;
		var naturalHeight = img.naturalHeight;
		if (naturalWidth) {
			callBack(img);
	} else { //No naturalWidth attribute in IE<9 - calculate it manually.
		var newImg = new Image();
		newImg.src = img.src;
		// if image is already loaded:
		if (newImg.complete) {
			img.naturalWidth = newImg.width;
			img.naturalHeight = newImg.height;
			callBack(img);
		} else { //load image
			$(newImg).load(function() {img.naturalWidth=newImg.width;img.naturalHeight=newImg.height; callBack(img)});
		}
	}
};
		

/*
		Fills hero container with the hero image centered in the container.
*/
jQuery.fn.stretchyPants = function(options) {
	var image = $(this);

	var data = image.data();

	var default_options = {
		container: image.parent(),
		horizontal_anchor: 'center',
		vertical_anchor: 'center',
	}
	data.options = $.extend(default_options, options);

	// set css attributes:
	image.css('position','absolute')
	data.options.container.css({
		'overflow': 'hidden',
		'position': 'relative'
	})

	function stretchImage(){
		var container = data.options.container;
		var container_aspect_ratio = container.width() / container.height();

		if(window.hero_image_aspect_ratio) {
			if(window.hero_image_aspect_ratio > container_aspect_ratio) {
			// image is more wide than container:
			var stretched_width = window.hero_image_natural_width * (container.height() / window.hero_image_natural_height)
			var offset = '-' + (stretched_width-container.width())/2.0 + 'px';
			image.css({ 'height': '100%', 'width': 'auto', 'left': offset, 'top': '0px' });
		} else { // image is more tall than container:
			var stretched_height = window.hero_image_natural_height * (container.width() / window.hero_image_natural_width)
			var offset = '-' + (stretched_height-container.height())/2.0 + 'px';
			image.css({ 'width': '100%', 'height': 'auto', 'top': offset, 'left': '0px' });
		}
		} else {
			$(image).calculateNaturalAspectRatio(function(image){
				window.hero_image_natural_width = image.naturalWidth;
				window.hero_image_natural_height = image.naturalHeight;
				window.hero_image_aspect_ratio = image.naturalWidth / image.naturalHeight;
				// call this function again ... since the window may not have resized... curse you async!
				setTimeout(stretchImage, 100);
			})
		}

	}	

	$(window).resize(function(){
		stretchImage()
	})
	window.addEventListener('orientationchange', function(){
		stretchImage();
	});
	stretchImage()
}

