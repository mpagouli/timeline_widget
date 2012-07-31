/*global jQuery, $ */
/*jslint nomen:true*/ (function ($) {
    "use strict";

    /************************* _TIMELINE_ELEMENT ***************************/
    $.widget("jblackbird._timeline_element", $.ui.mouse, {

        //default options
        options: {
            id: undefined,
            start: undefined,
            startDate: undefined,
            end: undefined,
            endDate: undefined,
            size: undefined,
            days: undefined,
            label: undefined,
            index: undefined,
            row: undefined,
            elementClicked: function(){},
            elementDBLClicked: function(){}//,
            //elementBind: function(){}
        },

        //initialization 
        _create: function () {
            var bindInfo, eData, widget, dblclick;
            this.element.addClass('timeline_element').bind('click',{widget:this},function(e){
                //e.data.widget.element.trigger('elementClicked', [e.data.widget.options]);
                //e.data.widget._trigger('elementClicked', null, e.data.widget.options);
                //e.data.widget.options.elementClicked(e.data.widget.options);
                setTimeout(function () {
                    dblclick = parseInt(e.data.widget.element.data('double'), 10);
                    if (dblclick > 0) {
                        e.data.widget.element.data('double', dblclick-1);
                    } else {
                        e.data.widget.options.elementClicked(e.data.widget.options);
                    }
                }, 200);
            }).bind ('dblclick', {widget:this}, function(e) {
                e.data.widget.element.data('double', 2);
                 e.data.widget.options.elementDBLClicked(e.data.widget.options);
            });

            /*bindInfo = this.options.elementBind(this.options);
            if(bindInfo!==undefined && bindInfo.e!==undefined && bindInfo.cb !== undefined){
                eData = (bindInfo.data === undefined)? {elem:this.options} : $.extend({},this.options,bindInfo.data);
                this.element.bind(bindInfo.e, bindInfo.cb);
            }*/
            
        }

    });


    /************************* _TIMELINE_LEGEND ***************************/
    $.widget("jblackbird._timeline_legend", $.ui.mouse, {

        //default options
        options: {
            row_elems: [],
            legendClicked: function(){},
            legendDBLClicked: function(){}
        },

        //initialization 
        _create: function () {
            var widget, dblclick;
            this.element.bind('click',{widget:this},function(e){
                //e.data.widget.element.trigger('time_legend_clicked', [e.data.widget.options.row_elems]);
                //e.data.widget._trigger('legendClicked', null, e.data.widget.options.row_elems);
                //e.data.widget.options.legendClicked(e.data.widget.options.row_elems);
                setTimeout(function () {
                    dblclick = parseInt(e.data.widget.element.data('double'), 10);
                    if (dblclick > 0) {
                        e.data.widget.element.data('double', dblclick-1);
                    } else {
                        e.data.widget.options.legendClicked(e.data.widget.options.row_elems);
                    }
                }, 200);
            }).bind ('dblclick', {widget:this}, function(e) {
                e.data.widget.element.data('double', 2);
                e.data.widget.options.legendDBLClicked(e.data.widget.options.row_elems);
            });
        }
        
    });


    /************************* _WORKING SET ***************************/
    $.widget("jblackbird._working_set", $.ui.mouse, {

        //default options
        options: {
            theme:'theme',
            unit_width: {
                number: 40,
                unit: 'px'
            },
            row_height: {
                number: 40,
                unit: 'px'
            },
            drag_opts: {},
            width: {
                number: 1000,
                unit: 'px'
            },
            height: {
                number: 1000,
                unit: 'px'
            },
            elements: [],
            elementStyle: function(){},
            elementClicked: function(){},
            wsStyle: function(){},
            elementDBLClicked: function(){}//,
            //elementBind: function(){}
        },

        //initialization 
        _create: function () {
            var width, height, unit_width, ws_style;
            width = this._getSizeString(this.options.width);
            height = this._getSizeString(this.options.height);
            unit_width = this._getSizeString({
                number: this.options.unit_width.number,
                unit: this.options.unit_width.unit
            });

            ws_style = this.options.wsStyle(this.options.unit_width, this.options.row_height, this.options.width, this.options.height);
            ws_style = (ws_style !== undefined)? ws_style : 'working_set_' + this.options.theme; 
            this.element.addClass('working_set').addClass(ws_style).draggable(this.options.drag_opts);
            this.element.css({
                'width': width,
                'height': height,
                'background-size': unit_width
            });
            this.refresh();
        },

        _getSizeString: function (size_hash) {
            return size_hash.number + size_hash.unit;
        },

        setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            this.refresh();
        },

        setOptions: function (options) {
            $.Widget.prototype._setOptions.apply(this, arguments);
            this.refresh();
        },

        refresh: function () {
            this._renderElements();
        },

        clear: function () {
            this._clearElements();
        },

        _clearElements: function () {
            $('.working_set').empty();
        },

        _renderElements: function () {
            var i;
            for (i = 0; i < this.options.elements.length; i += 1) {
                this._renderElement(this.options.elements[i]);
            }
        },

        _renderElement: function (time_element) { 
            var options, newElement, style_class;
            newElement = $("<div class='timeline_element'></div>").appendTo('.working_set');
            newElement.attr('id', 'elem' + time_element.id);
            
            //this._trigger('elementStyle', null, time_element);
            style_class = this.options.elementStyle(time_element);
            newElement.addClass('timeline_element_' + this.options.theme);
            if(style_class !== undefined) { 
                newElement.addClass(style_class); 
            }
            newElement.css({
                //'position': 'absolute',
                'margin-top': (this.options.row_height.number / 4) + this.options.row_height.unit,
                'margin-bottom': (this.options.row_height.number / 4) + this.options.row_height.unit,
                'height': (this.options.row_height.number / 2) + this.options.row_height.unit,
                'width': this.options.unit_width.number * time_element.size + 'px',
                'left': this.options.unit_width.number * time_element.start + 'px',
                'top': time_element.row * this.options.row_height.number + 'px'
            });

            time_element.elementClicked = this.options.elementClicked;
            time_element.elementDBLClicked = this.options.elementDBLClicked;
            newElement._timeline_element(time_element);
        }
    });


    /******************* _VIEWPORT WIDGET ***************************/
    $.widget("jblackbird._viewport", $.ui.mouse, {

        //default options
        options: {
            width: {
                number: 300,
                unit: 'px'
            },
            height: {
                number: 300,
                unit: 'px'
            }
        },

        //initialization
        _create: function () {
            var width, height;
            width = this._getSizeString(this.options.width);
            height = this._getSizeString(this.options.height);
            this.element.addClass('viewport');
            this.element.css({
                'width': width,
                'height': height
            });
        },

        checkBoundaries: function (justTriggerEvent) {

            var isDraggable, dragged, father, fatherStartX, fatherStartY, draggedw, draggedh, fatherw, fatherh, offsetX, offsetY, foffsetX, foffsetY, followers, i, axis, elem;
            isDraggable = this.element.children().first().draggable('option', 'enabled');
            if (isDraggable) {
                this.element.bind("dragstop", function (event, ui) {

                    dragged = $(event.target);
                    father = dragged.parent();

                    fatherStartX = parseFloat(father.position().left);
                    fatherStartY = parseFloat(father.position().top);

                    draggedw = dragged.width();
                    draggedh = dragged.height();
                    fatherw = father.width();
                    fatherh = father.height();

                    offsetX = parseFloat(dragged.position().left);
                    offsetY = parseFloat(dragged.position().top);
                    foffsetX = parseFloat(father.position().left) - fatherStartX;
                    foffsetY = parseFloat(father.position().top) - fatherStartY;
                    //alert('CHILD (TOP LEFT) --> ('+ offsetX+" "+offsetY+')'); 
                    //alert('PARENT (TOP LEFT) --> ('+ foffsetX+" "+foffsetY+')');  

                    var boundariesReached = [];

                    if (offsetX > foffsetX) {
                        offsetX = foffsetX;
                        boundariesReached.push('left');
                    }
                    if (offsetY > foffsetY) {
                        offsetY = foffsetY;
                        boundariesReached.push('top');
                    }
                    if (offsetX + draggedw < foffsetX + fatherw) {
                        offsetX = foffsetX + fatherw - draggedw;
                        boundariesReached.push('right');
                    }
                    if (offsetY + draggedh < foffsetY + fatherh) {
                        offsetY = foffsetY + fatherh - draggedh;
                        boundariesReached.push('bottom');
                    }

                    if (justTriggerEvent === undefined || !justTriggerEvent) {
                        // Move dragged element inside boundaries as well as all its drag followers
                        dragged.css({
                            'top': offsetY,
                            'left': offsetX
                        });
                        if (dragged.drag_coordinate('isLeader')) {
                            followers = dragged.drag_coordinate('followersInfo');
                            for (i = 0; i < followers.length; i += 1) {
                                axis = followers[i].axis;
                                elem = followers[i].element;

                                if (axis === undefined) {
                                    elem.css({
                                        'top': offsetY,
                                        'left': offsetX
                                    });
                                } else if (axis === 'x') {
                                    elem.css({
                                        'left': offsetX
                                    });
                                } else if (axis === 'y') {
                                    elem.css({
                                        'top': offsetY
                                    });
                                }
                            }
                        }
                    }

                    if (boundariesReached.length !== 0) {
                        dragged.trigger('boundariesReached', [boundariesReached]);
                    }

                });
            }
        },

        _getSizeString: function (size_hash) {
            return size_hash.number + size_hash.unit;
        }


    });


    /******************* TIMELINE WIDGET ***************************/
    $.widget("jblackbird.timeline", $.ui.mouse, {


        //default options
        options: {
            theme: 'theme',
            width: '',
            height: '',
            //unit:'px',
            elements: [],
            ws_elements: [],
            unit_width: {
                number: 80,
                unit: 'px'
            },
            viewport_units: 5,
            working_set_units: 30,
            row_height: {
                number: 40,
                unit: 'px'
            },
            viewport_elements: undefined,
            headers: [],
            legend_width: {
                number: 50,
                unit: 'px'
            },
            min_width: '450px',
            min_height: '320px',
            h_label_css: {
                'font-family': '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
                'font-size': '10px',
                'font-style': 'normal',
                'font-weight': 'bold',
                //'padding': '0px 0px',
                'text-align': 'center'
            },
            legend_css: {
                'font-family': 'Verdana',
                'font-size': '10px',
                'font-style': 'normal',
                'font-weight': 'bold',
                'padding': '12px 5px',
                'text-align': 'center'//,
                //'border-top': '1px solid black'
            },
            indexes: [],
            legendsDraggable:false,
            legendsLeftPosition: undefined,
            legendsZIndex: 1000,
            elementStyle : function(){},
            elementClicked: function(){},
            legendClicked: function(){},
            legendDBLClicked: function(){},
            legendStyleText: function(){},
            elementDBLClicked: function(){},
            headerStyleText: function(){},
            timelineImg: function(){},
            wsStyle: function(){},
            //elementBind: function(){}
        },

        _setSize: function (typ, val) {
            if (typ === 'width') {
                this.options.width = val;
            } else if (typ === 'height') {
                this.options.height = val;
            }
        },

        _initGiven: function (min, def, typ) {

            var given, parent_number, pixels, minEquivalent;

            // Initialize size to its' minimum value
            given = $.extend({}, min);

            // Get given size value            
            if (typ === 'width' && this.options.width !== '') {
                given = this._getSizeHash(this.options.width);
            } else if (typ === 'height' && this.options.height !== '') {
                given = this._getSizeHash(this.options.height);
            }

            // If given value is invalid then set size to default value        
            if (given === 'invalid') {
                this._setSize(typ, def.number + def.unit);
                given = $.extend({}, def);
            }

            // If given size is percent convert it to pixels
            if (given.unit === '%') {
                parent_number = (typ === 'width') ? this.element.parent().width() : this.element.parent().height();
                pixels = ((parent_number * given.number) / 100).toFixed(2);
                this._setSize(typ, pixels + 'px');
                given = {
                    number: pixels,
                    unit: 'px'
                };
            }

            // If given size is less than its' minimum value set it to minimum value            
            minEquivalent = (given.unit !== min.unit) ? this._convert(min, given.unit) : min.number;
            if (minEquivalent === 'invalid') {
                this._setSize(typ, (typ === 'width') ? this.options.min_width : this.options.min_height);
                given = $.extend({}, min);
            } else if (given.number < minEquivalent) {
                this._setSize(typ, minEquivalent + given.unit);
                given.number = minEquivalent;
            }

            // Return given size initialized value
            return given;
        },

        _initWidths: function () {
            var def_viewport_width, ws_width, default_width, min_width, given_width;
            def_viewport_width = this.options.unit_width.number * this.options.viewport_units;
            ws_width = this.options.unit_width.number * this.options.working_set_units;
            default_width = {
                number: def_viewport_width + this.options.legend_width.number,
                unit: this.options.unit_width.unit
            };
            min_width = this._getSizeHash(this.options.min_width);
            given_width = this._initGiven(min_width, default_width, 'width');

            return {
                timeline: given_width,
                ws_viewport: given_width.number - this.options.legend_width.number,
                ws: ws_width,
                legends_viewport: this.options.legend_width.number
            };
        },

        _initHeights: function () {
            var def_viewport_height, ws_height, headers_viewport_height, default_height, min_height, given_height;
            headers_viewport_height = this._getHeadersDivHeight(this.options.headers);
            min_height = this._getSizeHash(this.options.min_height);
            if(this.options.viewport_elements !== undefined){
                def_viewport_height = this.options.row_height.number * this.options.viewport_elements;
                ws_height = (this.options.viewport_elements > this.options.elements.length) ? def_viewport_height : this.options.row_height.number * this.options.elements.length;
                default_height = {
                    number: def_viewport_height + headers_viewport_height,
                    unit: this.options.row_height.unit
                };  
            }
            else{
                var c = this._getSizeHash(this.options.height);
                def_viewport_height = this._convert(c, this.options.row_height.unit);
                ws_height = def_viewport_height;
                default_height = {
                    number: def_viewport_height,
                    unit: this.options.row_height.unit
                };
            }
            given_height = this._initGiven(min_height, default_height, 'height');
            

            return {
                timeline: given_height,
                ws_viewport: given_height.number - headers_viewport_height,
                ws: ws_height,
                //ws: given_height.number - headers_viewport_height,
                headers_viewport: headers_viewport_height
            };
        },


        _sortWSElements: function (elems, old, typ) {

            var help, rowIndex, sorted, f, indexesToRemove, i;
            help = $.extend([], elems);
            rowIndex = 1;
            sorted = [];

            while (help.length > 0) {

                f = help[0];
                f.row = rowIndex;
                indexesToRemove = [];
                sorted.push(f);
                help.splice(0, 1);
                for (i = 0; i < help.length; i += 1) {
                    //if (help[i].startDate.getTime() >= f.endDate.getTime() || help[i].endDate.getTime() <= f.startDate.getTime()) {
                    if (help[i].start >= f.end || help[i].end <= f.start) {
                        help[i].row = rowIndex;
                        indexesToRemove.push(i);
                        sorted.push(help[i]);
                    }
                }
                for (i = 0; i < indexesToRemove.length; i += 1) {
                    help.splice(indexesToRemove[i], 1);
                }
                rowIndex += 1;

            }

            /*var y = "BEFORE: ";
            for(var i=0; i<sorted.length; i++){ y += "id:"+sorted[i].id+"-index:"+sorted[i].row+" "; }
            alert(y);*/

            if (old !== undefined) {
                sorted = this._keepOldIndexes(sorted, old);
            }

            /*var x = "AFTER: ";
            for(var i=0; i<sorted.length; i++){ x += "id:"+sorted[i].id+"-index:"+sorted[i].row+" "; }
            alert(x);*/

            return sorted;
        },

        _keepOldIndexes: function (sorted, old) {

            var res, j, i;
            res = $.extend([], sorted);
            for (j = 0; j < old.length; j += 1) {
                for (i = 0; i < res.length; i += 1) {
                    if (res[i].id === old[j].id && res[i].row !== old[j].row) {
                        this._switchIndexes(res, res[i].row, old[j].row);
                    }
                }
            }
            return res;
        },

        _switchIndexes: function (elems, newIndex, oldIndex) {
            var i;
            for (i = 0; i < elems.length; i += 1) {
                if (elems[i].row === newIndex) {
                    elems[i].row = oldIndex;
                } else if (elems[i].row === oldIndex) {
                    elems[i].row = newIndex;
                }
            }
        },


        _loadWS: function (around, timeline_widths, timeline_heights, oldElems) {

            var ws_boundaries, header_width, ws_viewport_center, ws_center, centerDiff, quotient, wsOffsetX, unitsBef, typ, typFormat, headerStart, wsElemsHash, headerUnits, headerEnd, wsElems;
            ws_boundaries = {};

            //Load elements according to working set bounds
            header_width = this.options.headers[0].header_span * this.options.unit_width.number;

            if ($(".ws_container").width() < $(".working_set").width()) {

                // We need to centralize the working set in its container
                ws_viewport_center = $(".ws_container").width() / 2;
                ws_center = $(".working_set").width() / 2;
                centerDiff = Math.abs(ws_viewport_center - ws_center);
                quotient = Math.round(centerDiff / header_width);
                wsOffsetX = -1 * quotient * header_width;
                $(".working_set").css({
                    'top': 0,
                    'left': wsOffsetX
                });
                $(".headers").css({
                    'top': 0,
                    'left': wsOffsetX
                });

            }

            unitsBef = Math.abs(wsOffsetX / header_width);
            headerUnits = this.options.headers[0].header_span;
            

            if ($.type(around) === 'date') { //Date base header

                around.setHours(0, 0, 0, 0);
                headerStart = new Date(around.getTime());

                // Base Header parameters
                typ = this.options.headers[0].type;
                typFormat = this.options.headers[0].type_format;

                if(typ === 'date'){
                    //this.options.headers[0].type = 'date';
                    //this.options.headers[0].type_format = 'dd/m/yy';
                    headerStart.setDate(headerStart.getDate() - unitsBef);
                    headerEnd = new Date(headerStart.getTime());
                    headerEnd.setDate(headerStart.getDate() + Math.round(this.options.working_set_units / headerUnits) - 1);
                }
                else if(typ === 'month'){ 
                    headerStart.setMonth(headerStart.getMonth() - unitsBef);
                    headerStart.setDate(1);
                    headerEnd = new Date(headerStart.getTime());
                    headerEnd.setMonth(headerStart.getMonth() + Math.round(this.options.working_set_units / headerUnits) - 1);
                }
                else if(typ === 'year'){
                    headerStart.setFullYear(headerStart.getFullYear() - unitsBef);
                    headerStart.setDate(1);
                    headerStart.setMonth(0);
                    headerEnd = new Date(headerStart.getTime());
                    headerEnd.setFullYear(headerStart.getFullYear() + Math.round(this.options.working_set_units / headerUnits) - 1);
                }

                this.options.headers[0].start = headerStart;

                //Working Set Elements to be loaded
                wsElemsHash = this._getWSElements(headerStart, headerEnd, headerUnits, typ);
                wsElems = wsElemsHash.elems;
                if(wsElemsHash.undefinedIndex){
                    wsElems = this._sortWSElements(wsElems, oldElems, typ);
                }
                this.options.ws_elements = $.extend([], wsElems);

                $(".working_set")._working_set('clear');
                $(".working_set")._working_set({
                    'elements': this.options.ws_elements
                })._working_set('refresh');

                ws_boundaries = {
                    start: new Date(headerStart.getTime()),
                    end: new Date(headerEnd.getTime())
                };
            }

            this._clearHeaders();
            this._setHeaders(timeline_widths.ws);

            this._clearLegends();
            this._setLegends(timeline_heights.ws);

            return ws_boundaries;

        },

        _monthsDiff: function (date1, date2) {
            var m1, y1, m2, y2, months, moveBackward, days, one_day, percent, m_days, before, after;
            one_day = 24 * 60 * 60 * 1000;
            moveBackward = date1 > date2;
            m1 = date1.getMonth();
            y1 = date1.getFullYear();
            m2 = date2.getMonth();
            y2 = date2.getFullYear();
            
            months = Math.abs( ((y2 - y1) * 12) + m2 - m1);
            date1.setFullYear(y2);
            date1.setMonth(m2);

            days = Math.abs( (date1.getTime() - date2.getTime()) / one_day );
            m_days = new Date(y2, m2 + 1, 0).getDate();
            percent = (days * 100) / m_days;

            if(moveBackward){
                if(date1 < date2){
                    months -= (percent/100);
                }
                else{
                    months += (percent/100);
                }
            }else{
                if(date1 < date2){
                    months += (percent/100);
                }
                else{
                    months -= (percent/100);
                }
            }

            return months;
        },

        _getWSElements: function (headerStart, headerEnd, headerSpan, typ) { //alert( this._monthsDiff(new Date(2012,5,26),new Date(2012,6,2)));

            var elems, wsElems, i, newElem, one_day, endDate, siz, diff, newElemStart, newElemStop, one_sec, one_min, one_hour, one_month, one_year, undefinedIndex;
            elems = this.options.elements;
            undefinedIndex = false;
            wsElems = [];
            for (i = 0; i < elems.length; i += 1) {
                newElem = $.extend({}, elems[i]);
                if ($.type(elems[i].startDate) === 'date') {

                    one_sec = 1000;
                    one_min = 60 * one_sec;
                    one_hour = 60 * one_min;
                    one_day = 24 * one_hour;


                    if (newElem.endDate === undefined) {
                        endDate = new Date(newElem.startDate.getTime());
                        endDate.setDate(newElem.startDate.getDate() + newElem.days - 1);
                        newElem.endDate = endDate;
                        siz = newElem.days;
                    } else {
                        //siz = Math.ceil((newElem.endDate.getTime() - newElem.startDate.getTime()) / (one_day)) + 1;
                        siz = (newElem.endDate.getTime() - newElem.startDate.getTime()) / one_day + 1;
                        newElem.size = siz;
                    }

                    if(typ === 'month'){
                        siz = this._monthsDiff(new Date(newElem.startDate.getTime()),new Date(newElem.endDate.getTime()));
                        newElem.size = siz;
                    }
                    else if(typ === 'year'){
                        siz = (this._monthsDiff(new Date(newElem.startDate.getTime()),new Date(newElem.endDate.getTime()))) / 12;
                        newElem.size = siz;
                    }

                    if(siz < 0.1){
                        siz = 0.1;
                    }
                    newElem.size = siz;

                    if (newElem.startDate.getTime() <= headerEnd.getTime() && newElem.endDate.getTime() >= headerStart.getTime()) {
                        // Element belongs to working set  
                        if(typ === 'date'){
                            //diff = Math.ceil((newElem.startDate.getTime() - headerStart.getTime()) / (one_day));
                            diff = (newElem.startDate.getTime() - headerStart.getTime()) / one_day; 
                        }
                        else if(typ === 'month'){
                            diff = this._monthsDiff(new Date(newElem.startDate.getTime()),new Date(headerStart.getTime()));
                        }
                        else if (typ === 'year'){
                            diff = this._monthsDiff(new Date(newElem.startDate.getTime()),new Date(headerStart.getTime()))/12;
                        }
                        
                        newElemStart = diff * headerSpan;
                        newElem.size *= headerSpan;
                        newElemStop = newElemStart + newElem.size * this.options.unit_width.number - 1;
                        newElem.start = newElemStart;
                        newElem.end = newElemStop;

                        if(newElem.index === undefined){
                            undefinedIndex = true;
                        }
                        else{
                            newElem.row = this._getIndexRow(newElem.index);
                            if(newElem.row === -1){
                                undefinedIndex = true;
                            }
                        }

                        wsElems.push(newElem);
                    }
                }
            }
            return { elems:wsElems, undefinedIndex:undefinedIndex};
        },

        _getIndexRow: function(ind){
            var r;
            if(this.options.indexes.length !== 0){
                r = this.options.indexes.indexOf(ind);
                if(r!==-1) {r = r+1;}
                return r;
            }
            return -1;
        },

        //initialization
        _create: function () {

            var timeline_widths, timeline_heights, width_unit, height_unit, headersCont, headers, header, legendsCont, baseHeader, legends, image, wrapper, widget, triggerelementStyle, workSetCont, workSet, ws_boundaries, newAround;
            if (this.options.headers.length === 0) {
                this._initializeHeaders();
            }

            timeline_widths = this._initWidths();
            timeline_heights = this._initHeights();
            width_unit = timeline_widths.timeline.unit;
            height_unit = timeline_heights.timeline.unit;

            this.element.addClass('timeline').css({
                'width': this._getSizeString(timeline_widths.timeline),
                'height': this._getSizeString(timeline_heights.timeline),
                'overflow': 'hidden'
            });

            headersCont = $("<div class='headers_container'></div>").appendTo(this.element).css({
                'position': 'relative'//,
                //'border-left': '1px solid'
            })._viewport({
                width: {
                    number: timeline_widths.ws_viewport,
                    unit: width_unit
                },
                height: {
                    number: timeline_heights.headers_viewport,
                    unit: height_unit
                }
            });
            headers = $("<div class='headers'></div>").appendTo('.headers_container');
            header = $("<div class='timeline_header'></div>").appendTo('.headers');

            legendsCont = $("<div class='legends_container'></div>").appendTo(this.element).css({
                'float': 'left'
            }).css({
                'position': 'relative'
            })._viewport({
                width: {
                    number: timeline_widths.legends_viewport,
                    unit: width_unit
                },
                height: {
                    number: timeline_heights.ws_viewport,
                    unit: height_unit
                }
            });

            legends = $("<div class='timeline_legend'></div>").css({
                'width': this.options.legend_width.number + this.options.legend_width.unit,
                'height': timeline_heights.ws + this.options.unit_width.unit
            }).appendTo('.legends_container');

            if(this.options.legendsLeftPosition!==undefined){
                if(this.options.legendsZIndex === undefined) { this.options.legendsZIndex = 1000; }
                $('.legends_container').css({'zIndex':this.options.legendsZIndex,'left':this.options.legendsLeftPosition});
            }

            if(this.options.legendsDraggable){
                if(this.options.legendsZIndex === undefined) { this.options.legendsZIndex = 1000; }
                $(".legends_container").draggable({ axis:"x", appendTo: "body", zIndex:this.options.legendsZIndex });
                $(".legends_container").bind('dragstop', {widget:this}, function(e) { $(e.target).css({'zIndex':e.data.widget.options.legendsZIndex}); });
            }

            /*$('.legends_container').bind('time_legend_clicked', function(event, elems){ 
                //alert(elems.row_elems.length);
            });*/


            wrapper = $("<div class='timeline_wrapper'></div>").appendTo(this.element).css({
                'width': timeline_widths.ws_viewport + this.options.unit_width.unit,
                'height': timeline_heights.ws_viewport + this.options.row_height.unit,
                'overflow': 'hidden',
                'float': 'left',
                'background-size': this._getSizeString({
                    number: this.options.unit_width.number * 2,
                    unit: this.options.unit_width.unit
                })
            });

            workSetCont = $("<div class='ws_container'></div>").appendTo('.timeline_wrapper').css({
                'float': 'left'
            }).css({
                'position': 'relative'
            })._viewport({
                width: {
                    number: timeline_widths.ws_viewport,
                    unit: width_unit
                },
                height: {
                    number: timeline_heights.ws_viewport,
                    unit: height_unit
                }
            }).css({
                'overflow-y': 'scroll',
                'overflow-x': 'hidden'
            });


            //widget = this;
            //triggerelementStyle = function(event, data){ widget._trigger('elementStyle', null, data); 
            //triggerelementStyle = this.options.elementStyle;

            workSet = $("<div></div>").appendTo('.ws_container')._working_set({ 
                theme: this.options.theme,
                unit_width: this.options.unit_width,
                row_height: this.options.row_height,
                width: {
                    number: timeline_widths.ws,
                    unit: this.options.unit_width.unit
                },
                height: {
                    number: timeline_heights.ws,
                    unit: this.options.row_height.unit
                },
                elementStyle: this.options.elementStyle,
                elementClicked: this.options.elementClicked,
                elementDBLClicked: this.options.elementDBLClicked,
                wsStyle: this.options.wsStyle
                //elementBind: this.options.elementBind
            });

            /*$(".headers_container").position({
                my: "left bottom",
                at: "left top",
                of: $(".ws_container")
            });
            $(".legends_container").position({
                my: "right top",
                at: "left top",
                of: $(".ws_container")
            });*/


            image = this.options.timelineImg(this.options.legend_width, {number: timeline_heights.headers_viewport , unit: height_unit});
            image = (image === undefined || image.src === undefined)? { src: '', style_class: 'timeline_image_' + this.options.theme } : image;
            if(image.style_class === undefined) { image.style_class = 'timeline_image_' + this.options.theme; }
            if(image.alt === undefined) { image.alt = ''; }

            if(image.parent_class === undefined) {image.parent_class = 'timeline_image_container_' + this.options.theme;}
            $('<div></div>').prependTo(this.element).addClass('timeline_image_container').addClass(image.parent_class).css({
                'width': (this.options.legend_width.number-1) + this.options.legend_width.unit,
                'height': timeline_heights.headers_viewport + height_unit//,
                //'line-height': timeline_heights.headers_viewport + height_unit
            });
            $('<img src="'+image.src+'" />').prependTo('.timeline_image_container').addClass('timeline_image').addClass(image.style_class).attr('alt',image.alt);
            if(image.width !== undefined) { $('.timeline_image').css({'width':image.width}); }
            if(image.height !== undefined) { $('.timeline_image').css({'height':image.height}); }
            if(image.title !== undefined) {$('.timeline_image').attr('title',image.title);}

            ws_boundaries = this._loadWS(new Date(), timeline_widths, timeline_heights);

            $(".working_set").draggable({
                axis: 'x'
            });
            $(".working_set").drag_coordinate('lead', [{
                element: $(".headers"),
                axis: 'x'
            }]);

            $(".ws_container").scroll_coordinate('lead', [{
                element: $(".legends_container"),
                axis: 'y'
            }]);

            $(".ws_container")._viewport('checkBoundaries', true);

            $(".ws_container").bind('boundariesReached', {
                timeline: this
            }, function (event, boundaries) {

                if (boundaries.length !== 0) {
                    /*
                    var mess = "Working Set reached "; 
                    for(var i=0; i<boundaries.length; i++){
                      mess += "the "+boundaries[i]+" boundary";
                      if( i < boundaries.length-1) { mess += ", "; }  
                      else if(boundaries.length>1) { mess += "and "; }
                    } 
                    mess += ".";
                    alert(mess)*/
                    if($.inArray('left', boundaries) !== -1 || $.inArray('right', boundaries) !== -1){
                        baseHeader = event.data.timeline.options.headers[0];
                        newAround = new Date(ws_boundaries.start.getTime());
                        if ($.inArray('right', boundaries) !== -1) {
                            newAround = new Date(ws_boundaries.end.getTime());
                            if(baseHeader.type === 'date'){
                                newAround.setDate(newAround.getDate() - Math.round(event.data.timeline.options.viewport_units/baseHeader.header_span) + 1);
                            }
                            else if(baseHeader.type === 'month'){
                                newAround.setMonth(newAround.getMonth() - Math.round(event.data.timeline.options.viewport_units/baseHeader.header_span) + 1);
                            }
                            else if(baseHeader.type === 'year'){
                                newAround.setFullYear(newAround.getFullYear() - Math.round(event.data.timeline.options.viewport_units/baseHeader.header_span) + 1);
                            }
                        }
                        ws_boundaries = event.data.timeline._loadWS(newAround, timeline_widths, timeline_heights, $.extend([], event.data.timeline.options.ws_elements));
                    }
                }

            });

            /*$(".ws_container").bind('time_element_clicked', function(event, elem){
                //alert(elem.label);
            });*/
        },


        _getRowElements: function (elems, ind) {
            var res, i;
            res = [];
            for (i = 0; i < elems.length; i += 1) {
                if (elems[i].row === ind) {
                    res.push(elems[i]);
                }
            }
            return res;
        },

        _clearLegends: function () {
            $(".timeline_legend").empty();
        },

        _setLegends: function (ws_height) {
            var rows, elems, css, j, row_elems, elems_label, paddingLeft, paddingRight, paddingTop, paddingBottom, style_class, style_text;
            rows = Math.round(ws_height / this.options.row_height.number);
            elems = this.options.ws_elements;
            css = this.options.legend_css;

            for (j = 0; j < rows; j += 1) {

                row_elems = this._getRowElements(elems, j);

                //this._trigger('legendStyleText',null, row_elems);
                style_text = this.options.legendStyleText(row_elems);

                //elems_label = (row_elems.length!==0)? (row_elems.length + ((row_elems.length === 1) ? " element" : " elements") ) : "";
                elems_label = (row_elems.length!==0)? row_elems[0].index : "";
                if(this.options.indexes.length !== 0) {
                    elems_label = this.options.indexes[j-1];
                }
                
                style_class = "timeline_legend_" + this.options.theme;
                if(style_text !== undefined){
                    if(style_text.text !== undefined){
                        elems_label = style_text.text;
                    }
                    if(style_text.style !== undefined){
                        style_class = style_text.style;
                    }
                }

                if (row_elems.length === 0 || j === 0) {
                    $('<div></div>').appendTo(".timeline_legend").css({
                        'top': j * this.options.row_height.number + this.options.row_height.unit,
                        'left': '0px'
                    })
                    .css(css)
                    .text(elems_label)
                    .addClass(style_class);
                } else {
                    /*var elems_label = "";
                    for(var k=0; k<row_elems.length; k += 1){ 
                        elems_label += row_elems[k].label +" " ;
                    }*/
                    
                    $('<div></div>').appendTo(".timeline_legend").css({
                        'top': j * this.options.row_height.number + this.options.row_height.unit,
                        'left': '0px'//,
                        //'border-top': '1px solid'
                    })
                    .css(css)
                    .addClass(style_class)
                    .text(elems_label)
                    ._timeline_legend({ 
                        row_elems: $.extend([], row_elems), 
                        legendClicked: this.options.legendClicked,
                        legendDBLClicked: this.options.legendDBLClicked });

                }


                paddingLeft = this._getSizeHash($('.timeline_legend div').css('padding-left')).number;
                paddingRight = this._getSizeHash($('.timeline_legend div').css('padding-right')).number;
                paddingTop = this._getSizeHash($('.timeline_legend div').css('padding-top')).number;
                paddingBottom = this._getSizeHash($('.timeline_legend div').css('padding-bottom')).number;
                $(' .timeline_legend div').css({
                    'width': this.options.legend_width.number - paddingLeft - paddingRight + this.options.legend_width.unit,
                    'height': this.options.row_height.number - paddingTop - paddingBottom - 1 + this.options.row_height.unit
                });

            }
        },

        _getHeadersDivHeight: function (headers) {
            var h, i;
            h = 0;
            for (i = 0; i < headers.length; i += 1) {
                h += headers[i].header_height;
            }
            return h;
        },

        _initializeHeaders: function () {
            var header = [{
                //Only one header by default
                header_height: 40,
                header_span: 1,
                type: 'date',
                type_format: 'ddd d mmm yyyy',
                label_css: {
                    'font-family': '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
                    'font-size': '11px',
                    'font-style': 'normal',
                    //'line-height': '40'+this.options.unit_width.unit,
                    'font-weight': 'bold',
                    'padding': '12px 5px'
                },
                start: new Date(),
                step: 1
            }
            /*,
            {
                header_height: 20,
                header_span: 7,
                type: '" + this.options.theme',
                type_format: 'week',
                label_css : {  'font-family': 'Verdana',
                               'font-size':'10px',
                               'font-style':'normal', 
                               'font-weight':'bold',
                               'padding': '3px 3px',
                               'text-align':'center'},
                start: 1,
                step: 1           }*/
];
            this._setOptions({
                'headers': header
            });
        },

        _setLabels: function (i, header_width, ws_width) {
            var header, labels_count, now, appendTo, css, label_text, j, paddingLeft, paddingRight, paddingTop, paddingBottom, style_text, style_class;
            header = this.options.headers[i];
            labels_count = Math.round(ws_width / header_width);
            now = header.start;
            appendTo = (i === 0) ? '.timeline_header' : '#header_layer' + i;
            css = $.extend({}, this.options.h_label_css, header.label_css);
            label_text = (header.type === 'date') ? now.format(header.type_format) : ((header.type === 'month') ? now.format("mmmm") : ((header.type === 'year') ? now.format("yyyy") : header.type_format + " " + now));

            for (j = 0; j < labels_count; j += 1) {

                style_text = this.options.headerStyleText(now);
                style_class = "timeline_header_" + this.options.theme;
                if(style_text !== undefined){
                    if(style_text.text !== undefined){
                        label_text = style_text.text;
                    }
                    if(style_text.style !== undefined){
                        style_class = style_text.style;
                    }
                }

                $('<div></div>').appendTo(appendTo).css({
                    'top': '0px',
                    'left': j * header_width + this.options.unit_width.unit//,
                    //'border-right': '1px solid'
                })
                .css(css)
                .text(label_text)
                .addClass(style_class);
                paddingLeft = this._getSizeHash($(appendTo + ' div').css('padding-left')).number;
                paddingRight = this._getSizeHash($(appendTo + ' div').css('padding-right')).number;
                paddingTop = this._getSizeHash($(appendTo + ' div').css('padding-top')).number;
                paddingBottom = this._getSizeHash($(appendTo + ' div').css('padding-bottom')).number;
                $(appendTo + ' div').css({
                    'width': header_width - paddingLeft - paddingRight - 1 + this.options.unit_width.unit,
                    'height': header.header_height - paddingTop - paddingBottom + this.options.row_height.unit
                });
                if (header.type === 'date') {
                    now.setDate(now.getDate() + header.step);
                    label_text = now.format(header.type_format);
                } else if (header.type === 'month') {
                    now.setMonth(now.getMonth() + header.step);
                    label_text = now.format(header.type_format);
                } else if (header.type === 'year') {
                    now.setFullYear(now.getFullYear() + header.step);
                    label_text = now.format(header.type_format);
                } else {
                    label_text = header.type_format + " " + (j + 2) * now;
                }
            }

        },

        _movePreviousDown: function (i, baseE, offs, headers) {
            var prevSum, j;
            if (i === 1) {
                baseE.css({
                    'top': offs + this.options.row_height.unit
                });
            } else {
                prevSum = 0;
                for (j = 1; j < i; j += 1) {
                    prevSum += headers[j].header_height;
                    $("#header_layer" + j).css({
                        'top': offs - prevSum + this.options.row_height.unit
                    });
                }
                baseE.css({
                    'top': offs + this.options.row_height.unit
                });
            }
        },

        _clearHeaders: function () {
            $(".timeline_header").empty();
        },

        _setHeaders: function (ws_width) {
            var headers, header_width, baseE, offs, layer_header_width, i;
            headers = this.options.headers;
            header_width = headers[0].header_span * this.options.unit_width.number;
            baseE = $('.timeline_header').css({
                'height': headers[0].header_height + this.options.row_height.unit,
                'background-size': header_width + 'px',
                'width': ws_width + 'px'

            });
            this._setLabels(0, header_width, ws_width);
            if (headers.length > 1) {
                offs = 0;
                layer_header_width = headers[1].header_span * header_width;
                for (i = 1; i < headers.length; i += 1) {
                    offs += headers[i].header_height;
                    this._movePreviousDown(i, baseE, offs, headers);
                    layer_header_width = (i !== 1) ? headers[i].header_span * layer_header_width : layer_header_width;
                    $("<div id='header_layer" + i + "' class='timeline_header'></div>").prependTo('.headers');
                    $('#header_layer' + i).css({
                        'height': headers[i].header_height + this.options.row_height.unit,
                        'width': ws_width + 'px'//,
                        //'border-bottom': '1px solid'
                    });
                    this._setLabels(i, layer_header_width, ws_width);
                }
            }
        },

        //option setters
        setOption: function (key, value) { 
            $.Widget.prototype._setOption.apply(this, arguments);
            this._refresh();
        },
        _setOptions: function (options) {
            $.Widget.prototype._setOptions.apply(this, arguments);
        },

        getUnitWidth: function () { alert('called');
            return this.options.unit_width;
        },

        _refresh: function(){
            this.element.empty();
            this.element.removeClass('timeline');
            this._create();
        },

        _getSizeString: function (size_hash) {
            return size_hash.number + size_hash.unit;
        },

        _getSizeHash: function (size_string) {
            var regex, num;
            //regex = /^[0-9]+[\.]{0,1}[0-9]+/;  
            regex = /^[0-9]+(?:\.[0-9]+){0,1}/;

            if (regex.test(size_string)) {
                num = size_string.match(regex);
                if (size_string === num) {
                    return {
                        number: parseFloat(size_string),
                        unit: 'px'
                    };
                }
                return {
                    number: parseFloat(num),
                    unit: size_string.split(num)[1]
                };
            }
            return 'invalid';
        },

        _convert: function (size_hash, unit) {
            var from_to = size_hash.unit + "_" + unit;
            switch (from_to) {
            case 'em_pt':
                return (size_hash.number * 12);
            case 'em_px':
                return (size_hash.number * 16);

            case 'pt_em':
                return ((size_hash.number / 12).toFixed(2));
            case 'pt_px':
                return (((size_hash.number * 16) / 12).toFixed(2));

            case 'px_pt':
                return (((size_hash.number * 12) / 16).toFixed(2));
            case 'px_em':
                return ((size_hash.number / 16).toFixed(2));
            case 'px_px':
                return size_hash.number;
            case 'pt_pt':
                return size_hash.number;
            case 'em_em':
                return size_hash.number;  

            default:
                return 'invalid';
            }
        },

        _destroy: function () {
            this.element.empty();
            this.element.removeClass('timeline');
            $.Widget.prototype.destroy.call(this);
        },

    });

}(jQuery));
/*jslint nomen:false*/