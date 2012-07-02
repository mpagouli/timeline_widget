$(document).ready(function(){
	
    var bar = $("<div></div>").css({
        'overflow': 'visible',
        'border': '2px solid'
    }).appendTo("body");

    bar.timeline({
        width: '660px',
        height: '320px',
        elements: [{
            id: 1,
            //start: 1.5,
            startDate: new Date(2012, 5, 26),
            days: 7,
            index: 1,
            label: "Elem A"
        }, {
            id: 2,
            //start: 5.3, 
            startDate: new Date(2012, 5, 28),
            days: 4,
            index: 2,
            label: "Elem B"
        }, {
            id: 3,
            //start: 5.3, 
            startDate: new Date(2012, 5, 20),
            days: 17,
            index: 3,
            label: "Elem C"
        }, {
            id: 4,
            //start: 5.3, 
            startDate: new Date(2012, 5, 2),
            endDate: new Date(2012, 5, 22),
            //days: 21,
            index: 4,
            label: "Elem D"
        }, {
            id: 5,
            //start: 5.3, 
            startDate: new Date(2012, 5, 1),
            days: 10,
            index: 5,
            label: "Elem E"
        }]
    });


    
    bar.bind('time_element_clicked', function(event, elem){
        var dialog = $('<div></div>')
        .addClass("ui-widget ui-widget-content ui-corner-all")
        .css({ 'width': '100px', 'height': '200px', 'padding': '10px' })
        .html('<p>Start Date: '+elem.startDate.format('d/m/yyyy')+'</br>End Date: '+ elem.endDate.format('d/m/yyyy') +'</p>')
        .dialog({
            autoOpen: false,
            title: elem.label,
            position: "center"
        });
        dialog.dialog('open');
        
    });

    bar.bind('time_legend_clicked', function(event, elems){
        var elems_str = elems[0].label;
        for(var i=1; i<elems.length; i++){
            if(i === 1) { elems_str += ', ';}
            elems_str += elems[i].label
        }
        var dialog = $('<div></div>')
        .addClass("ui-widget ui-widget-content ui-corner-all")
        .css({ 'width': '100px', 'height': '200px', 'padding': '10px' })
        .html('<p>Elements in row: '+elems_str+'</p>')
        .dialog({
            autoOpen: false,
            title: elems.length+' elements in row',
            position: "center"
        });
        dialog.dialog('open');
    });

    $('#inc').bind('click', {el:bar}, function(e) {
        var unitW = e.data.el.data("timeline").options.unit_width;
        var unitH = e.data.el.data("timeline").options.row_height;
        //var vieportUnits = e.data.el.data("timeline").options.viewport_units;
        e.data.el.data("timeline").setOption('unit_width', { number: unitW.number*2, unit: unitW.unit } );
        e.data.el.data("timeline").setOption('row_height', { number: unitH.number*2, unit: unitH.unit } );
        //e.data.el.data("timeline").setOption('viewport_units', viewport_units*2);
    });

    $('#decr').bind('click', {el:bar}, function(e) {
        var unitW = e.data.el.data("timeline").options.unit_width;
        var unitH = e.data.el.data("timeline").options.row_height;
        //var vieportUnits = e.data.el.data("timeline").options.viewport_units;
        if(unitW.number/2 >= 120 && unitH.number/2 >= 40){
            e.data.el.data("timeline").setOption('unit_width', { number: unitW.number/2, unit: unitW.unit } );
            //e.data.el.data("timeline").setOption('viewport_units', viewport_units/2);
            e.data.el.data("timeline").setOption('row_height', { number: unitH.number/2, unit: unitH.unit } );
        }
        else if(unitW.number/2 >= 120){
             e.data.el.data("timeline").setOption('unit_width', { number: unitW.number/2, unit: unitW.unit } );
             //e.data.el.data("timeline").setOption('viewport_units', viewport_units/2);
        }
        else if(unitH.number/2 >= 40){
            e.data.el.data("timeline").setOption('row_height', { number: unitH.number/2, unit: unitH.unit } );
        }
        
    });


});