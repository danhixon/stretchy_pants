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
	
/* allow IE to peacefully ignore console statements  */	
if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};

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

	if($(this).size() === 0)
	{
		console.error("Selector Not found: " + (this.selector || 'cannot discover selector with jQuery ' + $.fn.jquery));	
		return $(this);
	}
	// here we go:
	var image = $(this)
	if(!$(this).is('img'))
	{
		console.error("You must select an image. This is not an image: " + (this.selector || '[cannot discover selector with jQuery]' + $.fn.jquery));	
		return $(this);
	}
	var data = image.data();

	var default_options = {
		container: image.parent(),
		anchor: $(this).data('stretchy-anchor') || 'center-center',
		fitVerticals: false,
		autoStretch: true
	}
	data.options = $.extend(default_options, options);

	// set css attributes:
	image.css('position','absolute')
	data.options.container.css('overflow', 'hidden')

	current_positioning = data.options.container.css('position').toLowerCase();
	
	if(current_positioning.search(/relative|absolute/i) === -1)
	{
		data.options.container.css('position', 'relative')
	}

	function stretchImage(){
		if(data.hero_image_aspect_ratio) {
			image.css(getCSS());
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

	function getCSS(){
		var container = data.options.container;
		var container_aspect_ratio = container.width() / container.height();
		
		if(data.options.fitVerticals === true && data.hero_image_aspect_ratio < 1){
			return {
				'margin': '0 auto',
				'float': 'none',
				'left': 'auto',
				'position': 'relative', 
				'height': '100%',
				'width': 'auto'
			}
		}

		if(data.hero_image_aspect_ratio > container_aspect_ratio) {
			// image is more wide than container:
			var stretched_width = data.hero_image_natural_width * (container.height() / data.hero_image_natural_height)
			var center_offset = '-' + (stretched_width-container.width())/2.0 + 'px';
			var css = { 'height': '100%', 'width': 'auto' };
			getPositionValuesAlt(css, center_offset, 0);
			return css;
		} else { // image is more tall than container:
			var stretched_height = data.hero_image_natural_height * (container.width() / data.hero_image_natural_width)
			var center_offset = '-' + (stretched_height-container.height())/2.0 + 'px';
			var css = { 'width': '100%', 'height': 'auto'};
			getPositionValuesAlt(css, 0, center_offset);
			return css;
		}
	}

	function getPositionValuesAlt(css, center_offset_for_left, center_offset_for_top){
		var vertical_alignment = data.options.anchor.split('-')[0];
		var horizontal_alignment = data.options.anchor.split('-')[1];
		if(vertical_alignment==='center'){
			css['top'] = center_offset_for_top;
		} else {
			css[vertical_alignment] = '0px';
			css[otherAlignment(vertical_alignment)] = 'auto';
		}
		if(horizontal_alignment==='center'){
			css['left'] = center_offset_for_left;
		} else {
			css[horizontal_alignment] = '0px';
			css[otherAlignment(horizontal_alignment)] = 'auto';
		}
		return css;
	}

	function otherAlignment(alignment){
		if(alignment==='top'){
			return 'bottom';
		}
		if(alignment==='bottom'){
			return 'top';
		}
		if(alignment==='left'){
			return 'right';
		}
		if(alignment==='right'){
			return 'left';
		}
	}
	
	if(data.options.autoStretch){

		$(window).resize(function(){
			stretchImage()
		})
		if(window.addEventListener){
			window.addEventListener('orientationchange', function(){
				stretchImage();
			});	
		}
		
		stretchImage();
	} else {
		$(this).data.stretchImage = stretchImage
	}

	return $(this);
}

