$(document).ready(function(){
	
	var contain = $("<div></div>").css({ 'width':'100%', 'height':'90%' }).appendTo("body");
    var bar = $("<div></div>").css({
        'overflow': 'visible'
    }).appendTo(contain);


    

    bar.timeline( { 
	width:'100%',
	height:'100%',
	indexes:['CarA', 'CarB', 'CarC', 'CarD', 'CarE', 'CarF', 'CarG', 'CarH', 'CarI','CarJ', 'CarK', 'CarL', 'CarM', 'CarN', 'CarO', 'CarP']
	
	} );
		
});