/* Resize event handling for responsive flipsnaps */

var flipsnaps = Array();
		
$('.flipsnap').each(function(i){
			
	var flipsnap = Flipsnap(this);
			
	flipsnaps.push(flipsnap);
			
});

$(window).resize(function() { // When the window is resized...
			
	var sl = flipsnaps[fi]; // Access Flipsnap() object

	var mP = sl._maxPoint+1; // Getstotal actual children/items
								
	sl.distance = sl.element.offsetWidth / mP; // Force internal values update
	sl._distance = sl.element.offsetWidth / mP; // Force internal values update
				
	sl.currentX = -(sl.element.offsetWidth / mP) * sl.currentPoint; // Use % for currentX - force update
				
	sl._maxX = -(sl.element.offsetWidth / mP) * mP; // Force internal values update
}
