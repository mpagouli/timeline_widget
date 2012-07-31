$(document).ready(function(){
	
    var bar = $("<div></div>").css({
        'overflow': 'visible'
    }).appendTo("body");


    

    bar.timeline( { 
	width:'100%',
	height:'100%',
	indexes:['CarA', 'CarB', 'CarC', 'CarD', 'CarE', 'CarF', 'CarG', 'CarH', 'CarI']
	
	} );
		
});