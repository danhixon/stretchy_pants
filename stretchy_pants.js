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
	// There is probably a way cooler jQuery way to make this 
	// work with multiple images but this works for now.
	if($(this).size() > 1)
	{
		$(this).each(function(ix, img){
			$(img).stretchyPants(options);
		});
		return $(this);
	}
	var image = $(this)
	var data = image.data();

	var default_options = {
		container: image.parent(),
		horizontal_anchor: 'center',
		vertical_anchor: 'center',
	}
	data.options = $.extend(default_options, options);

	// set css attributes:
	image.css('position','absolute')
	data.options.container.css('overflow', 'hidden')

	current_positioning = data.options.container.css('position').toLowerCase();
	if(current_positioning !== 'relative' || current_positioning !== 'absolute')
	{
		data.options.container.css('position', 'relative')
	}

	function stretchImage(){
		var container = data.options.container;
		var container_aspect_ratio = container.width() / container.height();

		if(data.hero_image_aspect_ratio) {
			if(data.hero_image_aspect_ratio > container_aspect_ratio) {
			// image is more wide than container:
			var stretched_width = data.hero_image_natural_width * (container.height() / data.hero_image_natural_height)
			var offset = '-' + (stretched_width-container.width())/2.0 + 'px';
			image.css({ 'height': '100%', 'width': 'auto', 'left': offset, 'top': '0px' });
		} else { // image is more tall than container:
			var stretched_height = data.hero_image_natural_height * (container.width() / data.hero_image_natural_width)
			var offset = '-' + (stretched_height-container.height())/2.0 + 'px';
			image.css({ 'width': '100%', 'height': 'auto', 'top': offset, 'left': '0px' });
		}
		} else {
			$(image).calculateNaturalAspectRatio(function(image){
				data.hero_image_natural_width = image.naturalWidth;
				data.hero_image_natural_height = image.naturalHeight;
				data.hero_image_aspect_ratio = image.naturalWidth / image.naturalHeight;
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
	stretchImage();
	return $(this);
}

