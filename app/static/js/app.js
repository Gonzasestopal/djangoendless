$(document).ready(function(){
   $(window).bind('scroll', loadOnScroll);
});

// loadOnScroll handler
var loadOnScroll = function() {
   // If the current scroll position is past out cutoff point...
    if ($(window).scrollTop() > $(document).height() - ($(window).height()*2)) {
        // temporarily unhook the scroll event watcher so we don't call a bunch of times in a row
        $(window).unbind();
        // execute the load function below that will visit the JSON feed and stuff data into the HTML
        loadItems();
    }
};

var loadItems = function() {
    // If the next page doesn't exist, just quit now
    if (hasNextPage === false) {
        return false
    }
    // Update the page number
    pageNum = pageNum + 1;
    // Configure the url we're about to hit
    $.ajax({
        url: '/',
        data: {page: pageNum, text_search: searchText},
        dataType: 'json',
        success: function(data) {
            // Update global next page variable
            hasNextPage = data.hasNext;
            // Loop through all items
            var html = '';
            $.each(data.people, function(index, item) {
                html += '<h2>' + item.first_name + '</h2>'
            });
            // Pop all our items out into the page
            $('.container').append(html)
        },
        error: function(data) {
            // on 404 ...
            hasNextPage = false
        },
        complete: function(data, textStatus){
            // Turn the scroll monitor back on
            $(window).bind('scroll', loadOnScroll);
        }
    });
};