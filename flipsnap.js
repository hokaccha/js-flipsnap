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
	support = {
		transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
		touch: ('ontouchstart' in window)
	},
	touchStartEvent =  support.touch ? 'touchstart' : 'mousedown',
	touchMoveEvent =  support.touch ? 'touchmove' : 'mousemove',
	touchEndEvent =  support.touch ? 'touchend' : 'mouseup';

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
		self.element.style.webkitTransitionProperty = '-webkit-transform';
		self.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
		self.element.style.webkitTransitionDuration = '0';
		self.element.style.webkitTransform = getTranslate(0);

		self.conf = conf || {};
		self.touchEnabled = true;
		self.currentPoint = 0;
		self.currentX = 0;

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

		self.element.style.webkitTransitionDuration = '350ms';
		self._setX(- self.currentPoint * self.distance)

		var ev = document.createEvent('Event');
		ev.initEvent('flipsnap.moveend', true, false);
		self.element.dispatchEvent(ev);
	},
	_setX: function(x) {
		var self = this;

		self.currentX = x;
		self.element.style.webkitTransform = getTranslate(x);
	},
	_touchStart: function(event) {
		var self = this;

		if (!self.touchEnabled) {
			return;
		}

		if (!support.touch) {
			event.preventDefault();
		}

		self.element.style.webkitTransitionDuration = '0';
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

window.Flipsnap = Flipsnap;

})(this);
