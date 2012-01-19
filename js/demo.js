$(function() {

if (!$('.demo').length) return;

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

(function refresh() {
	var $demo = $("#demo-refresh");
	var $flipsnap = $demo.find('.flipsnap');
	var flipsnap = Flipsnap("#demo-refresh .flipsnap", {
		distance: 230
	});
	var width = 270;

	// append new item
	$demo.find(".add").click(function() {
		var newNumber = $flipsnap.find(".item").size() + 1;
		var $item = $("<div>").addClass("item").text(newNumber);
		width += 230;
		$flipsnap.append($item).width(width);
		flipsnap.refresh();
	});

	// remove last item
	$(".remove").click(function() {
		var $items = $flipsnap.find(".item");
		if ($items.size() <= 1) return;
		width -= 230;
		$items.last().remove().width(width);
		flipsnap.refresh();
	});
})();


(function link() {
	Flipsnap('#demo-link .flipsnap', {
		distance: 230
	});

	var $a = $('#demo-link .item a');
	// click event
	$a.eq(1).click(function(e) {
		e.preventDefault();
		alert("clicked");
	});

	// click event and link
	$a.eq(2).click(function(e) {
		alert("clicked and link to index");
	});
})();

(function nextprev() {
	var $demo = $('#demo-nextprev');
	var flipsnap = Flipsnap('#demo-nextprev .flipsnap', {
		distance: 230
	});
	var $next = $demo.find(".next").click(function() {
		flipsnap.toNext();
	});
	var $prev = $demo.find(".prev").click(function() {
		flipsnap.toPrev();
	});
	flipsnap.element.addEventListener('fsmoveend', function() {
		$next.attr("disabled", !flipsnap.hasNext());
		$prev.attr("disabled", !flipsnap.hasPrev());
	}, false);
})();

(function moveToPoint() {
	var $demo = $('#demo-moveToPoint');
	var flipsnap = Flipsnap('#demo-moveToPoint .flipsnap', {
		distance: 230
	});
	var $num = $demo.find('.num');
	$demo.find('.go').click(function() {
		flipsnap.moveToPoint($num.val() - 1);
	});
})();

(function disableTouch() {
	var $demo = $('#demo-touchDisable');
	var flipsnap = Flipsnap('#demo-touchDisable .flipsnap', {
		distance: 230,
		touchDisable: true
	});

	// disable check
	$demo.find('.isDisable').change(function() {
		flipsnap.conf.touchDisable = $(this).is(':checked');
	});

	// Go btn
	var $num = $demo.find('.num');
	$demo.find('.go').click(function() {
		flipsnap.moveToPoint($num.val() - 1);
	});

	// next, prev btn
	var $next = $demo.find(".next").click(function() {
		flipsnap.toNext();
	});
	var $prev = $demo.find(".prev").click(function() {
		flipsnap.toPrev();
	});
	flipsnap.element.addEventListener('fsmoveend', function() {
		$next.attr("disabled", !flipsnap.hasNext());
		$prev.attr("disabled", !flipsnap.hasPrev());
	}, false);
})();

});
