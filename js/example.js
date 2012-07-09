$(document).ready(function(){
	
    var bar = $("<div></div>").css({
        'overflow': 'visible'//,
        //'border': '1px solid'
    }).appendTo("body");


    var defineElemColor = function(time_elem){
        //alert(time_elem.id);
        var style_class = 'confirmed';
        if(time_elem.id === 4 ) { style_class = 'departed'; }
        if(time_elem.id === 2 ) { style_class = 'cancelled'; }
        if(time_elem.id === 1 ) { style_class = 'departed'; }
        if(time_elem.id === 5 ) { style_class = 'departed'; }
        if(time_elem.id === 6 ) { style_class = 'pending'; }
        /*time_elem.css_class = 'confirmed';
        if(time_elem.id === 4 ) { time_elem.css_class = 'departed'; }
        if(time_elem.id === 2 ) { time_elem.css_class = 'cancelled'; }
        if(time_elem.id === 1 ) { time_elem.css_class = 'departed'; }
        if(time_elem.id === 5 ) { time_elem.css_class = 'departed'; }
        if(time_elem.id === 6 ) { time_elem.css_class = 'pending'; } */
        return style_class;
    };

    var showElemInfo = function(elem){
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
    };

    var showLegendInfo = function(elems){
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
    };

    var defineLegend = function(elems){
       if(elems.length!==0){
            return {style: 'leg'};
       }
       return {text:'No elems'};
    };

    var defineHeaderStyle = function(dat){ //alert(dat)
       if(dat.getDate() === new Date().getDate()){
            return {style: 'leg'};
       }
       return {text: 'one very big'+dat.format('dddd d mmmm yyyy')};
    };

    var setImgStyleAltSize = function(w,h){
        var ww,hh;
        ww = (w.number-20) + w.unit;
        hh = (h.number-10) + h.unit;
       return { src:'images/clock.png', title:'Time Flies', width:ww, height:hh, style_class: 'myimg' };
    };

    var defineWSStyle = function(uw,rh,w,h){
       return 'myws';
    };

    var elementDBL = function(elem){

        var showElemInfo = function(event,ui){
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
        };

      return {
        e: 'dblclick',
        data: { elem: elem },
        cb: showElemInfo
      };
    };

    bar.timeline({
        unit_width: { number:120, unit:'px' },
        legend_width: { number:80 , unit:'px' },
        //viewport_elements:10,
        /*width: '680px',*/
        /*height: '320px',*/
        width: '1180px',
        height:'500px',
        //theme: 'blueskip',
        //elementStyle: defineElemColor,
        //legendStyleText: defineLegend,
        elementClicked: showElemInfo,
        elementDBLClicked: showElemInfo,
        legendClicked: showLegendInfo,
        legendDBLClicked: showLegendInfo,
        //indexes:['CarA', 'CarB', 'CarC', 'CarD', 'CarE', 'CarF', 'CarG', 'CarH', 'CarI'], 
        //headerStyleText: defineHeaderStyle,
        //elementBind: elementDBL,
        //timelineImg: setImgStyleAltSize,
        //wsStyle: defineWSStyle,
        //legendsDraggable:true,
        //legendsLeftPosition:'300px',
        //legendsZIndex:10000,
        elements: [{
            id: 1,
            startDate: new Date(2012, 5, 26),
            days: 7,
            index: 'CarA',
            label: "Reserv A"
        }, {
            id: 2,
            startDate: new Date(2012, 5, 28),
            days: 4,
            index: 'CarB',
            label: "Reserv B"
        }, {
            id: 3, 
            startDate: new Date(2012, 5, 20),
            days: 17,
            index: 'CarC',
            label: "Reserv C"
        }, {
            id: 4,
            startDate: new Date(2012, 5, 2),
            endDate: new Date(2012, 5, 22),
            //days: 21,
            index: 'CarB',
            label: "Reserv D"
        }, {
            id: 5,
            startDate: new Date(2012, 5, 1),
            days: 10,
            index: 'CarD',
            label: "Reserv E"
        }, {
            id: 6,
            startDate: new Date(2012, 6, 10),
            days: 5,
            index: 'CarE',
            label: "Reserv F"
        }]
    });


    //var bb = bar.data( "timeline" );
    //alert(bb.options.unit_width.number);

    //bar.bind('timelinetime_element_drawn', function(ev, el) { alert('dasdasdasdasdasd'); } );

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