#  Stretchy Pants
“Chancho. When you are a man, sometimes you wear stretchy pants in your room. It's for fun.” - Nacho

### Put This on First

jQuery

### How to Wear

1. Put an image in a container with variable width and a fixed height (e.g. width: 100%; height: 500px; ).
2. Put on your stretchy pants.

		$('.hero-container img').stretchyPants();

As you resize the window the image will stay within the bounds of the container, two of the edges will be cropped out but the image will not be distorted.

See demo.html for a examples.

### Variations

By default the plugin will keep the center of the image centered in the container. You can choose to anchor the top or bottom, and left or right sides:

	// this will ensure the bottom-left of the image is always in frame
	$('.hero-container img').stretchyPants({ anchor: 'bottom-left' })
	
	// this will ensure the top of the image is always in frame
	$('.hero-container img').stretchyPants({ anchor: 'top-center' });

These are the valid anchor values:

	center-center (default), center-left, center-right,
	top-center, top-right, top-left, 
	bottom-center, bottom-right, bottom-left
	
