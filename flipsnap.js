(function(window) {

var d = window.document,
	support = {
		transform3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
		touch: ('ontouchstart' in window)
	},
	touchStartEvent =  support.touch ? 'touchstart' : 'mousedown',
	touchMoveEvent =  support.touch ? 'touchmove' : 'mousemove',
	touchEndEvent =  support.touch ? 'touchend' : 'mouseup';

var Flipsnap = function(conf) {
	return (this instanceof Flipsnap) ? this.init(conf) : new Flipsnap(conf);
};

Flipsnap.prototype = {
	init: function(conf) {
		var self = this;

		self.element = conf.element;
		if (typeof conf.element === 'string') {
			self.element = d.querySelector(conf.element);
		}
		self.element.style.webkitTransitionProperty = '-webkit-transform';
		self.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
		self.element.style.webkitTransitionDuration = '0';
		self.element.style.webkitTransform = getTranslate(0);

		self.distance = conf.distance;
		self.enabled = true;
		self.position = 0;
		self.x = 0;

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
		}
	},
	refresh: function() {
		var self = this;

		var childNodes = self.element.childNodes;
		var itemLength = 0;
		for(var i = 0, len = childNodes.length; i < len; i++) {
			var node = childNodes[i];
			if (node.nodeType === 1) {
				itemLength++;
			}
		}

		self.maxPosition = itemLength - 1;
		self.maxX = - self.distance * self.maxPosition;
	},
	_setX: function(x) {
		var self = this;

		self.x = x;
		self.element.style.webkitTransform = getTranslate(x);
	},
	_touchStart: function(event) {
		var self = this;

		if (!self.enabled) {
			return;
		}

		self.element.style.webkitTransitionDuration = '0';
		self.scrolling = true;
		self.moveReady = false;
		self.startPageX = getPage(event, 'pageX');
		self.startPageY = getPage(event, 'pageY');
		self.basePageX = self.startPageX;
		self.directionX = 0;
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
			newX = self.x + distX;
			if (newX >= 0 || newX < self.maxX) {
				newX = Math.round(self.x + distX / 3);
			}
			self._setX(newX);

			self.directionX = distX > 0 ? -1 : 1;
		}
		else {
			deltaX = Math.abs(pageX - self.startPageX);
			deltaY = Math.abs(pageY - self.startPageY);
			if (deltaY > 5) {
				self.scrolling = false;
			}
			else if (deltaX > 5) {
				self.moveReady = true;
			}
		}

		self.basePageX = pageX;
	},
	_touchEnd: function(event) {
		var self = this;

		if (!this.scrolling) {
			return;
		}

		self.scrolling = false;

		var newPosition,
			x = self.x / self.distance;

		x =
			(self.directionX > 0) ? Math.floor(x) :
			(self.directionX < 0) ? Math.ceil(x) :
			Math.round(x);

		self.position = -x;
		x = x * self.distance;

		if (x > 0) {
			x = self.position = 0;
		} else if (x < self.maxX) {
			self.position = self.maxPosition;
			x = self.maxX;
		}

		self.element.style.webkitTransitionDuration = '350ms';
		self._setX(x);
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
