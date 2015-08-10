0.6.3  / 2015-08-10
====================

* Fix bug of animation #56 (@babatakao)

0.6.2  / 2014-01-14
====================

* Fix event handling
* Use touch locus' angle to decide whether to stop the browser default scrolling behavior (@zhouqicf)

0.6.1  / 2014-01-09
====================

* Fix bug, touchend event has not fired on Android Chrome #30 #22
* event.stopPropagation cause the events of the upper node can't trigger (@zhouqicf)

0.6.0  / 2013-11-18
====================

* Fix Panning broken on Internet Explorer #26
* Fix can't prevent form elements' default behavior (@zhouqicf)
* Add AMD support (@nulltask)

0.5.6  / 2013-07-01
====================

* Fix, `refresh` did not work when items is zero.

0.5.5  / 2013-06-10
====================

* Fix, Only assign intentionally passed event data values #24 (mattbasta)

0.5.4  / 2013-06-05
====================

* Fix bug for Fix bug for Windows8 + IE10 #23 (don't use MSPointer Events)

0.5.3  / 2013-03-06
====================

* Fix bug `transitionDuration` when not support cssAnimation
* Fix img draggable in Window8 Chrome and Firefox

0.5.2  / 2013-03-06
====================

* Fix bug `transitionDuration`
* Fix, error only load script on not support `addEventlistener` browser

0.5.1  / 2013-03-05
====================

* Fix, Mouse event don't work in Window8 Chrome and Firefox. #20

0.5.0  / 2013-03-01
====================

* Add touch events, `fstouchstart`, `fstouchmove`, `fstouchend` #19 (chr15m)
* Per transition duration #18 (chr15m)
* `fsmoveend` event rename to `fspointmove`
* Fix maxPoint bug #17
* Fix multi touch bug #5

0.4.1  / 2012-12-06
====================

* Fix #14. Thanks to Neotag
* Add `transitionDuration` option. Thanks to Neotag

0.4.0  / 2012-11-16
====================

* IE10 for touch device support. Fix #13
