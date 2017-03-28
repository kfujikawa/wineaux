$(document)
    .ready(function () {

        getSavedWines(function (error, wines) {
            if (error) {
                throw error;
            } else {
                if (wines.length) {
                    console.log(wines);
                    $('#user-vault').html('Your have <strong>' + wines.length + ' wines </strong>  in your vault.');

                    for (var i = 0; i < wines.length; i += 1) {
                        var $wine_detail_template = $('<div class="col-sm-4 text-center"><h4></h4><form class="target"><label>Tasting N' +
                                'otes:  </label><input type="text" name="comments" class="comments"><button>Submi' +
                                't</button></form></div>');
                        var wine = wines[i];
                        $wine_detail_template.attr('value', wine.id);
                        $wine_detail_template
                            .find('h4')
                            .text(wine.name);

                        $wine_detail_template
                            .find('form')
                            .submit(function (event) {
                                event.preventDefault();
                                var id = $(this)
                                    .parent()
                                    .attr('value');

                                var commentToSend = {
                                    id: id,
                                    comment: $(this)
                                        .find('input')
                                        .val()
                                };

                                console.log(commentToSend);

                                $
                                    .ajax({
                                        url: '/vault/wines/comment',
                                        type: 'POST',
                                        contentType: 'application/json',
                                        data: JSON.stringify(commentToSend)
                                    })
                                    .done(function (comment) {
                                        console.log(comment);
                                    })
                                    .fail(function (error) {
                                        console.log(error);
                                    });

                            });

                        $('.js-wine-detail').append($wine_detail_template);

                    }
                } else {
                    $('#user-vault').html('Your <strong>vault</strong> is currently empty.');
                }
            }

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
    });

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

    var $wine_detail_template = $('<div class="col-sm-4 text-center"><h4></h4><form id="target"><label>Tasting Note' +
            's:  </label><input type="text" name="comments" class="comments"><input type="sub' +
            'mit" value="Save"></input></form></div>');
    $wine_detail_template.attr('value', wine.id);
    $wine_detail_template
        .find('h4')
        .text(wine.name);

    $('.js-wine-detail').append($wine_detail_template);
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