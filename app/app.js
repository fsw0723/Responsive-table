'use strict';

angular.module('myApp', []).
directive('responsiveTable', function ($window) {
    return {
        restrict: 'E',
        templateUrl: 'table.html',
        link: function (scope, element) {
            var w = angular.element($window);

            var switched = false;
            var updateTables = function() {
                if ((w[0].innerWidth < 767) && !switched ){
                  switched = true;
                  $("table.responsive").each(function(i, element) {
                    splitTable($(element));
                  });
                  return true;
                }
                else if (switched && (w[0].innerWidth > 767)) {
                  switched = false;
                  $("table.responsive").each(function(i, element) {
                    unsplitTable($(element));
                  });
                }
            };

          	function splitTable(original)
          	{
          		original.wrap("<div class='table-wrapper' />");

          		var copy = original.clone();
          		copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
          		copy.removeClass("responsive");

          		original.closest(".table-wrapper").append(copy);
          		copy.wrap("<div class='pinned' />");
          		original.wrap("<div class='scrollable' />");

              setCellHeights(original, copy);
          	}

          	function unsplitTable(original) {
              original.closest(".table-wrapper").find(".pinned").remove();
              original.unwrap();
              original.unwrap();
          	}

            function setCellHeights(original, copy) {
              var tr = original.find('tr'),
                  tr_copy = copy.find('tr'),
                  heights = [];

              tr.each(function (index) {
                var self = $(this),
                    tx = self.find('th, td');

                tx.each(function () {
                  var height = $(this).outerHeight(true);
                  heights[index] = heights[index] || 0;
                  if (height > heights[index]) heights[index] = height;
                });

              });

              tr_copy.each(function (index) {
                $(this).height(heights[index]);
              });
            }


            scope.getWindowWidth = function () {
                return {
                    'w': w[0].innerWidth
                };
            };
            scope.$watch(scope.getWindowWidth, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;
                updateTables();



            }, true);

            w.bind('resize', function () {
                updateTables();
                scope.$apply();
            });

            w.bind('redraw', function(){
                switched=false;updateTables();
            });
        }
    };
});
