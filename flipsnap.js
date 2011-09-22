/*
 * flipsnap.js
 *
 * Copyright 2011 PixelGrid, Inc.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version  0.1.6
 *
 */

(function(window, undefined) {

var document = window.document,
	div = document.createElement('div'),
	prefix = ['webkit', 'moz', 'o', 'ms'],
	saveProp = {},
	support = {
		transform3d: hasProp([
			'perspectiveProperty',
			'WebkitPerspective',
			'MozPerspective',
			'OPerspective',
			'msPerspective'
		]),
		transform: hasProp([
			'transformProperty',
			'WebkitTransform',
			'MozTransform',
			'OTransform',
			'msTransform'
		]),
		transition: hasProp([
			'transitionProperty',
			'WebkitTransitionProperty',
			'MozTransitionProperty',
			'OTransitionProperty',
			'msTransitionProperty'
		]),
		touch: ('ontouchstart' in window)
	},
	touchStartEvent =  support.touch ? 'touchstart' : 'mousedown',
	touchMoveEvent =  support.touch ? 'touchmove' : 'mousemove',
	touchEndEvent =  support.touch ? 'touchend' : 'mouseup';

support.cssAnimation = (support.transform3d || support.transform) && support.transition;

var Flipsnap = function(element, conf) {
	return (this instanceof Flipsnap)
		? this.init(element, conf)
		: new Flipsnap(element, conf);
};

Flipsnap.prototype = {
	init: function(element, conf) {
		var self = this;

		self.element = element;
		if (typeof element === 'string') {
			self.element = document.querySelector(element);
		}

		if (support.cssAnimation) {
			self._setStyle({
				transitionProperty: getCSSVal('transform'),
				transitionTimingFunction: 'cubic-bezier(0,0,0.25,1)',
				transitionDuration: '0ms',
				transform: getTranslate(0)
			});
		}
		else {
			self._setStyle({
				position: 'relative',
				left: '0px'
			});
		}

		self.conf = conf || {};
		self.touchEnabled = true;
		self.currentPoint = 0;
		self.currentX = 0;
		self.animate = false;

		self.refresh();

		self.element.addEventListener(touchStartEvent, self, false);
		self.element.addEventListener(touchMoveEvent, self, false);
		self.element.addEventListener(touchEndEvent, self, false);

		return self;
	},
	handleEvent: function(event) {
		var self = this;

		switch (event.type) {
			case touchStartEvent:
				self._touchStart(event);
				break;
			case touchMoveEvent:
				self._touchMove(event);
				break;
			case touchEndEvent:
				self._touchEnd(event);
				break;
			case 'click':
				self._click(event);
				break;
		}
	},
	refresh: function() {
		var self = this;

		var conf = self.conf;

		// setting max point
		self.maxPoint = conf.point || (function() {
			var childNodes = self.element.childNodes,
				itemLength = 0,
				i = 0,
				len = childNodes.length,
				node;
			for(; i < len; i++) {
				node = childNodes[i];
				if (node.nodeType === 1) {
					itemLength++;
				}
			}
			if (itemLength > 0) {
				itemLength--;
			}

			return itemLength;
		})();

		// setting distance
		self.distance = conf.distance || self.element.scrollWidth / (self.maxPoint + 1);

		// setting maxX
		self.maxX = conf.maxX ? - conf.maxX : - self.distance * self.maxPoint;

		self.moveToPoint(self.currentPoint);
	},
	hasNext: function() {
		var self = this;

		return self.currentPoint < self.maxPoint;
	},
	hasPrev: function() {
		var self = this;

		return self.currentPoint > 0;
	},
	toNext: function() {
		var self = this;

		if (!self.hasNext()) {
			return;
		}

		self.moveToPoint(self.currentPoint + 1);
	},
	toPrev: function() {
		var self = this;

		if (!self.hasPrev()) {
			return;
		}

		self.moveToPoint(self.currentPoint - 1);
	},
	moveToPoint: function(point) {
		var self = this;

		self.currentPoint = 
			(point < 0) ? 0 :
			(point > self.maxPoint) ? self.maxPoint :
			parseInt(point);

		if (support.cssAnimation) {
			self._setStyle({ transitionDuration: '350ms' });
		}
		else {
			self.animate = true;
		}
		self._setX(- self.currentPoint * self.distance)

		var ev = document.createEvent('Event');
		ev.initEvent('flipsnap.moveend', true, false);
		self.element.dispatchEvent(ev);
	},
	_setX: function(x) {
		var self = this;

		self.currentX = x;
		if (support.cssAnimation) {
			self.element.style[ saveProp.transform ] = getTranslate(x);
		}
		else {
			if (self.animate) {
				self._animate(x);
			}
			else {
				self.element.style.left = x + 'px';
			}
		}
	},
	_touchStart: function(event) {
		var self = this;

		if (!self.touchEnabled) {
			return;
		}

		if (!support.touch) {
			event.preventDefault();
		}

		if (support.cssAnimation) {
			self._setStyle({ transitionDuration: '0ms' });
		}
		else {
			self.animate = false;
		}
		self.scrolling = true;
		self.moveReady = false;
		self.startPageX = getPage(event, 'pageX');
		self.startPageY = getPage(event, 'pageY');
		self.basePageX = self.startPageX;
		self.directionX = 0;
		self.startTime = event.timeStamp;
	},
	_touchMove: function(event) {
		var self = this;

		if (!self.scrolling) {
			return;
		}

		var pageX = getPage(event, 'pageX'),
			pageY = getPage(event, 'pageY'),
			distX,
			newX,
			deltaX,
			deltaY;

		if (self.moveReady) {
			event.preventDefault();
			event.stopPropagation();

			distX = pageX - self.basePageX;
			newX = self.currentX + distX;
			if (newX >= 0 || newX < self.maxX) {
				newX = Math.round(self.currentX + distX / 3);
			}
			self._setX(newX);

			self.directionX = distX > 0 ? -1 : 1;
		}
		else {
			deltaX = Math.abs(pageX - self.startPageX);
			deltaY = Math.abs(pageY - self.startPageY);
			if (deltaX > 5) {
				event.preventDefault();
				event.stopPropagation();
				self.moveReady = true;
				self.element.addEventListener('click', self, true);
			}
			else if (deltaY > 5) {
				self.scrolling = false;
			}
		}

		self.basePageX = pageX;
	},
	_touchEnd: function(event) {
		var self = this;

		if (!self.scrolling) {
			return;
		}

		self.scrolling = false;

		var newPoint = -self.currentX / self.distance;
		newPoint =
			(self.directionX > 0) ? Math.ceil(newPoint) :
			(self.directionX < 0) ? Math.floor(newPoint) :
			Math.round(newPoint);

		self.moveToPoint(newPoint);

		setTimeout(function() {
			self.element.removeEventListener('click', self, true);
		}, 200);
	},
	_click: function(event) {
		var self = this;

		event.stopPropagation();
		event.preventDefault();
	},
	_setStyle: function(styles) {
		var self = this;
		var style = self.element.style;

		for (var prop in styles) {
			setStyle(style, prop, styles[prop]);
		}
	},
	_animate: function(x) {
		var self = this;

		var elem = self.element;
		var begin = +new Date;
		var from = parseInt(elem.style.left);
		var to = x;
		var duration = 350;
		var easing = function(time, duration) {
			return -(time /= duration) * (time - 2);
		};
		var timer = setInterval(function() {
			var time = new Date - begin;
			var pos, now;
			if (time > duration) {
				clearInterval(timer);
				now = to;
			}
			else {
				pos = easing(time, duration);
				now = pos * (to - from) + from;
			}
			elem.style.left = now + "px";
		}, 10);
	},
	destroy: function() {
		var self = this;

		self.element.removeEventListener(touchStartEvent, self);
		self.element.removeEventListener(touchMoveEvent, self);
		self.element.removeEventListener(touchEndEvent, self);
	}
};

function getTranslate(x) {
	return support.transform3d
		? 'translate3d(' + x + 'px, 0, 0)'
		: 'translate(' + x + 'px, 0)';
}

function getPage(event, page) {
	return support.touch ? event.changedTouches[0][page] : event[page];
}

function hasProp(props) {
	return some(props, function(prop) {
		return div.style[ prop ] !== undefined;
	});
}

function setStyle(style, prop, val) {
	var _saveProp = saveProp[ prop ];
	if (_saveProp) {
		style[ _saveProp ] = val;
	}
	else if (style[ prop ] !== undefined) {
		saveProp[ prop ] = prop;
		style[ prop ] = val;
	}
	else {
		some(prefix, function(_prefix) {
			var _prop = ucFirst(_prefix) + ucFirst(prop);
			if (style[ _prop ] !== undefined) {
				saveProp[ prop ] = _prop;
				style[ _prop ] = val;
				return true;
			}
		});
	}
}

function getCSSVal(prop) {
	if (div.style[ prop ] !== undefined) {
		return prop;
	}
	else {
		var ret;
		some(prefix, function(_prefix) {
			var _prop = ucFirst(_prefix) + ucFirst(prop);
			if (div.style[ _prop ] !== undefined) {
				ret = '-' + _prefix + '-' + prop;
				return true;
			}
		});
		return ret;
	}
}

function ucFirst(str) {
	return str.charAt(0).toUpperCase() + str.substr(1);
}

function some(ary, callback) {
	for (var i = 0, len = ary.length; i < len; i++) {
		if (callback(ary[i], i)) {
			return true;
		}
	}
	return false;
}

function animate(element, property, from, to, duration, easing) {
	var begin = +new Date;
	var timer = setInterval(function() {
		var time = new Date - begin;
		var pos, now;
		if (time > duration) {
			clearInterval(timer);
			now = to;
		}
		else {
			pos = easing(time, duration);
			now = pos * (to - from) + from;
		}
		element.style[property] = now + "px";
	}, 10);
}

window.Flipsnap = Flipsnap;

})(this);
