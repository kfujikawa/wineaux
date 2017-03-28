$(document)
    .ready(function () {
        getSavedWines(function (error, wine){
            if (error) {
                throw error;
            } 
            else if (wine) {
                displayVault(wine);
                displayComment(wine);
            }
            else {
                $('#user-vault').html('Your <strong>vault</strong> is currently empty.');
            }
        })
    })
// ================== METHODS ===============================//
function findById(id, callback) {
    $
        .ajax({
            url: '/vault/' + id,
            type: 'POST'
        })
        .done(function (wine) {
            callback(null, wine);

        })
        .fail(function (error) {
            callback(error, null);
        });
}

function getSavedWines(callback) {
    $
        .ajax("/vault/wines")
        .done(function (wines) {
            callback(null, wines);
        })
        .fail(function (error) {
            callback(error, wines);
        });
}

function displayVault(wine) {
    wine.forEach( function (wine){
        // console.log(wine.name);
        var $wine_detail_template = $(
            '<div class="col-sm-4 text-center">' + 
                '<h4></h4>' + 
                '<form class="target">' + 
                    '<label>Tasting Notes:</label>' +
                    '<input type="text" name="comments" class="comments">' + 
                '<button>Submit</button></form>' + 
            '</div>');
        $wine_detail_template.attr('value', wine.id);
        $wine_detail_template
            .find('h4')
            .text(wine.name);
        $('.js-wine-detail').append($wine_detail_template);
    })
}

function displayComment(wine) {

    var $comment_detail_template = $('<div class="col-sm-4 text-center"><p></p></div>');
    $comment_detail_template.attr('value', wine.comment);
    $comment_detail_template
        .find('p')
        .text(wine.comment);

    $('.js-wine-detail').append($comment_detail_template);
}

function saveWine(wine, cb) {
    $.ajax({
        url: '/vault',
        data: JSON.stringify(wine),
            method: 'POST',
            contentType: 'application/json'
        })
        .done(function (saved) {
            cb(true);
        })
        .fail(function (error) {
            cb(false)
        });
}

// ================== EVENT LISTENERS ===============================//

$('.js-search-results')
    .on('click', 'div', function () {
        // findById
        var id = $(this).attr('value');
        findById(id, function (error, wine) {
            if (error) {
                return new Error("Something went wrong.");
            }
            wine.id = id;

            saveWine(wine, function (isSaved) {
                if (isSaved) {
                    displayVault(wine);
                }
            });
        });
    });

var query = $('#search').val();
    $
        .ajax({url: '/vault/search/malbec', type: 'POST'})
        .done(function (wines) {
            for (var i = 0; i < wines.length; i++) {
                var wine = wines[i];
                var $wine_template = $('<div class="col-sm-4 text-center"><h4><small></small></h4></div><');

                $wine_template.attr('value', wine.id);
                $wine_template
                    .find('h4')
                    .text(wine.name);

                $('.js-search-results').append($wine_template);

            }

        })
        .fail(function (error) {
            console.log(error);
        });