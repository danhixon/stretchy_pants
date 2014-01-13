#  Stretchy Pants
“Chancho. When you are a man, sometimes you wear stretchy pants in your room. It's for fun.” - Nacho

### Put This on First

jQuery

### How to Wear

1. Put an image in a container with variable width and a fixed height (e.g. width: 100%; height: 500px; ).
2. Put on your stretchy pants.

			$('.hero-container img').stretchyPants();

As you resize the window the image will stay within the bounds of the container, two of the edges will be cropped out but the image will not be distorted.