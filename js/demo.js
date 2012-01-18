$(function() {

(function simple() {
	Flipsnap('#demo-simple .flipsnap');
})();

(function distance() {
	Flipsnap('#demo-distance .flipsnap', {
		distance: 230
	});
})();

(function maxPoint() {
	Flipsnap('#demo-maxPoint .flipsnap', {
		distance: 160, // 80px * 2
		maxPoint: 3    // move able 3 times
	});
})();

(function moveend() {
	var $demo = $('#demo-moveend');
	var $pointer = $demo.find('.pointer span');
	var flipsnap = Flipsnap('#demo-moveend .flipsnap', {
		distance: 230
	});
	flipsnap.element.addEventListener('fsmoveend', function() {
		$pointer.filter('.current').removeClass('current');
		$pointer.eq(flipsnap.currentPoint).addClass('current');
	}, false);
})();

});
