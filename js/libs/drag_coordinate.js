(function ($) {
    "use strict";
    var methods = {

        coordinator: function (coordinator) {

            var coordinatorId, followers, i, coordinated, follower;
            coordinatorId = coordinator.attr('id');
            coordinator.attr('id', 'drag_c00rdinat0r__temp');

            followers = $('.drag_coo_context div div:only-child').filter(function () {
                return $(this).attr('id') !== 'drag_c00rdinat0r__temp' && ($(this).width() > $(this).parent().width() || $(this).height() > $(this).parent().height());
            });
            if (coordinatorId === undefined) {
                coordinator.removeAttr('id');
            } else {
                coordinator.attr('id', coordinatorId);
            }

            coordinated = [];
            for (i = 0; i < followers.length; i += 1) {
                follower = $(followers[i]);
                if (follower.parent().width() === follower.width()) {
                    coordinated.push({
                        element: follower,
                        axis: "y"
                    });
                } else if (follower.parent().height() === follower.height()) {
                    coordinated.push({
                        element: follower,
                        axis: "x"
                    });
                } else if (follower.parent().width() <= follower.width() && follower.parent().height() <= follower.height()) {
                    coordinated.push({
                        element: follower
                    });
                }
            }

            if (coordinated.length !== 0) {
                coordinator.drag_coordinate('lead', coordinated);
            }

        },

        lead: function (whom_where) {

            var elementsx, elementsy, elementsboth, leaderData, leaderOffsetX, leaderOffsetY, bindData;
            if (whom_where === undefined || whom_where.length === 0) {
                this.drag_coordinate('coordinator', this);
            } else {
                elementsx = [];
                elementsy = [];
                elementsboth = [];
                leaderData = (this.data('drag_followers') === undefined) ? [] : this.data('drag_followers');

                $.each(whom_where, function (i, hash) {

                    if (hash.element !== undefined) {

                        if (hash.axis !== undefined) {

                            switch (hash.axis) {
                            case 'x':
                                elementsx.push(hash.element);
                                break;
                            case 'y':
                                elementsy.push(hash.element);
                                break;
                            default:
                                elementsboth.push(hash.element);
                            }

                        } else {
                            elementsboth.push(hash.element);
                        }

                        if ($.inArray(hash, leaderData) === -1) {
                            leaderData.push(hash);
                        }
                    }
                });

                this.data('drag_followers', leaderData);

                $(elementsx).draggable({
                    scroll: false
                });
                $(elementsy).draggable({
                    scroll: false
                });
                $(elementsboth).draggable({
                    scroll: false
                });
                this.draggable({
                    scroll: false
                });

                this.bind("drag", function (event, ui) {

                    leaderOffsetX = parseFloat(
                        $(ui.helper[0]).position().left
                    );
                    leaderOffsetY = parseFloat(
                        $(ui.helper[0]).position().top
                    );
                    $.each(elementsboth, function (j, elem) {
                        elem.css({
                            'left': leaderOffsetX,
                            'top': leaderOffsetY
                        });
                    });

                    $.each(elementsx, function (j, elem) {
                        elem.css({
                            'left': leaderOffsetX
                        });
                    });

                    $.each(elementsy, function (j, elem) {
                        elem.css({
                            'top': leaderOffsetY
                        });
                    });

                });

                this.bind("dragstop", function (event, ui) {
                    
                        leaderOffsetX = parseFloat(
                            $(ui.helper[0]).position().left
                        );
                        leaderOffsetY = parseFloat(
                            $(ui.helper[0]).position().top
                        );
                        $.each(elementsboth, function (j, elem) {
                            elem.css({
                                'left': leaderOffsetX,
                                'top': leaderOffsetY
                            });
                        });

                        $.each(elementsx, function (j, elem) {
                            elem.css({
                                'left': leaderOffsetX
                            });
                        });

                        $.each(elementsy, function (j, elem) {
                            elem.css({
                                'top': leaderOffsetY
                            });
                        });

                });
            }
        },

        followersInfo: function () {
            var followers = this.data('drag_followers');
            return (followers === undefined) ? [] : followers;
        },

        followers: function () {
            var res, followers, i;
            res = [];
            followers = this.data('drag_followers');
            if (followers !== undefined) {
                for (i = 0; i < followers.length; i += 1) {
                    res.push(followers[i].element);
                }
            }
            return res;
        },

        isFollower: function () {
            var leaders = this.data('drag_leaders');
            if (leaders === undefined || leaders.length === 0) {
                return false;
            }
            return true;
        },

        leadersInfo: function () {
            var res, curElem, i, fols, curHash;
            res = [];
            curElem = this;
            $('div').each(function (i, elem) {
                fols = $(elem).drag_coordinate('followersInfo');
                if (fols.length !== 0) {
                    for (i = 0; i < fols.length; i += 1) {
                        // See if the two HTML elements use the same memory
                        if (curElem[0] === fols[i].element[0]) {
                            curHash = (fols[i].axis === undefined) ? {
                                element: $(elem)
                            } : {
                                element: $(elem),
                                axis: fols[i].axis
                            };
                            if ($.inArray(curHash, res) === -1) {
                                res.push(curHash);
                            }
                        }
                    }
                }
            });
            return res;
        },

        leaders: function () {
            var res, curElem, i, fols, curHash;
            res = [];
            curElem = this;
            $('div').each(function (i, elem) {
                fols = $(elem).drag_coordinate('followers');
                if (fols.length !== 0) {
                    for (i = 0; i < fols.length; i += 1) {
                        // See if the two HTML elements use the same memory
                        if (curElem[0] === fols[i][0]) {
                            res.push($(elem));
                        }
                    }
                }
            });
            return res;
        },

        isLeader: function () {
            var followers = this.data('drag_followers');
            if (followers === undefined || followers.length === 0) {
                return false;
            }
            return true;
        }

    };

    $.fn.drag_coordinate = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return this.drag_coordinate('coordinator', this);
        }
        $.error('Method ' + method + ' does not exist on jQuery.drag_coordinate');
    };

}(jQuery));