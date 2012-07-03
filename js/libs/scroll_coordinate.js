/*global jQuery, $ */
(function ($) {
    "use strict";
    var methods = {

        coordinator: function (coordinator) {

            var coordinatorId, followers, coordinated, i, follower;
            coordinatorId = coordinator.attr('id');
            coordinator.attr('id', 'scroll_c00rdinat0r__temp');
            followers = $('.scroll_coo_context div div:only-child').parent().filter(function () {
                return $(this).attr('id') !== 'scroll_c00rdinat0r__temp' && ($(this).width() < $(this).children().first().width() || $(this).height() < $(this).children().first().height());
            });

            if (coordinatorId === undefined) {
                coordinator.removeAttr('id');
            } else {
                coordinator.attr('id', coordinatorId);
            }

            coordinated = [];
            for (i = 0; i < followers.length; i += 1) {
                follower = $(followers[i]);
                if (follower.width() === follower.children().first().width()) {
                    coordinated.push({
                        element: follower,
                        axis: "y"
                    });
                } else if (follower.height() === follower.children().first().height()) {
                    coordinated.push({
                        element: follower,
                        axis: "x"
                    });
                } else if ((follower.width() <= follower.children().first().width()) && (follower.height() <= follower.children().first().height())) {
                    coordinated.push({
                        element: follower
                    });
                }
            }

            if (coordinated.length !== 0) {
                coordinator.scroll_coordinate('lead', coordinated);
            }

        },

        lead: function (followers) {

            var elementsx, elementsy, elementsboth, leaderData, bindData, contChild, elemsx, elemsy, elemsboth, i, followerChild;

            if (followers === undefined || followers.length === 0) {
                this.scroll_coordinate('coordinator', this);
            } else {

                elementsx = [];
                elementsy = [];
                elementsboth = [];
                leaderData = (this.data('scroll_followers') === undefined) ? [] : this.data('scroll_followers');
                $.each(followers, function (i, hash) {

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

                this.data('scroll_followers', leaderData);

                if (elementsboth.length !== 0 || (elementsx.length !== 0 && elementsy.length !== 0)) {
                    this.css({
                        'overflow': 'scroll'
                    });
                } else if (elementsx.length === 0) {
                    this.css({
                        'overflow-y': 'scroll',
                        'overflow-x': 'hidden'
                    });
                } else if (elementsy.length === 0) {
                    this.css({
                        'overflow-x': 'scroll',
                        'overflow-y': 'hidden'
                    });
                } else {
                    this.css({
                        'overflow': 'hidden'
                    });
                }


                bindData = {
                    followersx: elementsx,
                    followersy: elementsy,
                    followersboth: elementsboth
                };
                this.bind("scroll", bindData, function (e) {
                    var container = $(e.target);
                    contChild = container.children('div').first();

                    elemsx = e.data.followersx;
                    elemsy = e.data.followersy;
                    elemsboth = e.data.followersboth;
                    for (i = 0; i < elemsx.length; i += 1) {
                        followerChild = elemsx[i].children('div').first();
                        followerChild.draggable({
                            axis: "x",
                            scroll: false,
                            disabled: true
                        });
                        followerChild.removeClass('ui-state-disabled');
                        followerChild.css({
                            'left': parseFloat(contChild.position().left)
                        });
                    }

                    for (i = 0; i < elemsy.length; i += 1) {
                        followerChild = elemsy[i].children('div').first();
                        followerChild.draggable({
                            axis: "y",
                            scroll: false,
                            disabled: true
                        });
                        followerChild.removeClass('ui-state-disabled');
                        followerChild.css({
                            'top': parseFloat(contChild.position().top)
                        });
                    }

                    for (i = 0; i < elemsboth.length; i += 1) {
                        followerChild = elemsboth[i].children('div').first();
                        followerChild.draggable({
                            scroll: false,
                            disabled: true
                        });
                        followerChild.removeClass('ui-state-disabled');
                        followerChild.css({
                            'top': parseFloat(contChild.position().top),
                            'left': parseFloat(contChild.position().left)
                        });
                    }
                });
            }
        },

        followersInfo: function () {
            var followers = this.data('scroll_followers');
            return (followers === undefined) ? [] : followers;
        },

        followers: function () {
            var res, followers, i;
            res = [];
            followers = this.data('scroll_followers');
            if (followers !== undefined) {
                for (i = 0; i < followers.length; i += 1) {
                    res.push(followers[i].element);
                }
            }
            return res;
        },

        isFollower: function () {
            var leaders, res;
            leaders = this.data('scroll_leaders');
            if (leaders === undefined || leaders.length === 0) {
                res = false;
            } else {
                res = true;
            }
            return res;
        },

        leadersInfo: function () {
            var res, curElem, i, curHash;
            res = [];
            curElem = this;
            $('div').each(function (i, elem) {
                var fols = $(elem).scroll_coordinate('followersInfo');
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
            var res, curElem, i, fols;
            res = [];
            curElem = this;
            $('div').each(function (i, elem) {
                fols = $(elem).scroll_coordinate('followers');
                if (fols.length !== 0) {
                    for (i = 0; i < fols.length; i += 1) {
                        // See if the two HTML elements use the same memory
                        if (curElem[0] === fols[i][0]) {
                            if ($.inArray($(elem), res) === -1) {
                                res.push($(elem));
                            }
                        }
                    }
                }
            });
            return res;
        },

        isLeader: function () {
            var followers, res;
            followers = this.data('scroll_followers');
            if (followers === undefined || followers.length === 0) {
                res = false;
            } else {
                res = true;
            }
            return res;
        }

    };

    $.fn.scroll_coordinate = function (method) {

        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return this.scroll_coordinate('coordinator', this);
        }
        $.error('Method ' + method + ' does not exist on jQuery.scroll_coordinate');
    };

}(jQuery));