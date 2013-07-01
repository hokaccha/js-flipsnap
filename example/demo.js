$(function() {

if (!$('.demo').length) return;

(function simple() {
	Flipsnap('#demo-simple .flipsnap');
})();

(function img() {
	Flipsnap('#demo-img .flipsnap');
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

(function transitionDuration() {
	Flipsnap('#demo-transitionDuration .flipsnap', {
		distance: 230,
		transitionDuration: 150
	});
})();

(function pointmove() {
	var $demo = $('#demo-pointmove');
	var $pointer = $demo.find('.pointer span');
	var flipsnap = Flipsnap('#demo-pointmove .flipsnap', {
		distance: 230
	});
	flipsnap.element.addEventListener('fspointmove', function() {
		$pointer.filter('.current').removeClass('current');
		$pointer.eq(flipsnap.currentPoint).addClass('current');
	}, false);

	var $next = $demo.find(".next").click(function() {
		flipsnap.toNext();
	});
	var $prev = $demo.find(".prev").click(function() {
		flipsnap.toPrev();
	});
	flipsnap.element.addEventListener('fspointmove', function() {
		$next.attr("disabled", !flipsnap.hasNext());
		$prev.attr("disabled", !flipsnap.hasPrev());
	}, false);
})();

(function touchevents() {
	var $demo = $('#demo-touchevents');
	var $event = $demo.find('.event span');
	var $detail = $demo.find('.detail');
	var flipsnap = Flipsnap('#demo-touchevents .flipsnap', {
		distance: 230
	});
	flipsnap.element.addEventListener('fstouchstart', function(ev) {
		$event.text('fstouchstart');
	}, false);

	flipsnap.element.addEventListener('fstouchmove', function(ev) {
		$event.text('fstouchmove');
		$detail.text(JSON.stringify({
			delta: ev.delta,
			direction: ev.direction
		}, null, 2));
	}, false);

	flipsnap.element.addEventListener('fstouchend', function(ev) {
		$event.text('fstouchend');
		$detail.text(JSON.stringify({
			moved: ev.moved,
			originalPoint: ev.originalPoint,
			newPoint: ev.newPoint,
			cancelled: ev.cancelled
		}, null, 2));
	}, false);
})();

(function cancelmove() {
	var $demo = $('#demo-cancelmove');
	var flipsnap = Flipsnap('#demo-cancelmove .flipsnap', {
		distance: 230
	});
	flipsnap.element.addEventListener('fstouchmove', function(ev) {
		if (ev.direction === -1) {
			ev.preventDefault();
		}
	}, false);
})();

(function refresh() {
	var $demo = $("#demo-refresh");
	var $flipsnap = $demo.find('.flipsnap');
    var distance = 230;
    var padding = 30;
	var flipsnap = Flipsnap("#demo-refresh .flipsnap", {
		distance: distance
	});
	var width = distance + padding;

	// append new item
	$demo.find(".add").click(function() {
		var newNumber = $flipsnap.find(".item").size() + 1;
		var $item = $("<div>").addClass("item").text(newNumber);
		width += distance;
		$flipsnap.append($item).width(width);
		flipsnap.refresh();
	});

	// remove last item
	$(".remove").click(function() {
		var $items = $flipsnap.find(".item");
		if ($items.size() <= 0) return;
		width -= distance;
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
	flipsnap.element.addEventListener('fspointmove', function() {
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
	var $demo = $('#demo-disableTouch');
	var flipsnap = Flipsnap('#demo-disableTouch .flipsnap', {
		distance: 230,
		disableTouch: true
	});

	// disable check
	$demo.find('.isDisable').change(function() {
		flipsnap.disableTouch = $(this).is(':checked');
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
	flipsnap.element.addEventListener('fspointmove', function() {
		$next.attr("disabled", !flipsnap.hasNext());
		$prev.attr("disabled", !flipsnap.hasPrev());
	}, false);
})();

$('.sample a').click(function(e) {
  e.preventDefault();
  var $a = $(this);
  var $code = $a.parents('.sample').find('pre');
  $code.slideToggle('fast', function() {
    $a.text($code.is(':visible') ? 'hide code' : 'show code');
  });
});

});
