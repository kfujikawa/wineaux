$(document)
    .ready(function () {
        // $.ajax("/vault")     .done(function (wines){         for(var i = 0; i <
        // wines.length; i++){             $('.js-vault-results').append('<li>' +
        // wines[i].name);         }     }).fail(function (error){ console.log(error);
        // });
    });

$(document).ready(function () {

    var query = $('#search').val();

    $
        .ajax({url: '/vault/search/malbec', type: 'POST'})
        .done(function (wines) {
            for (var i = 0; i < wines.length; i++) {
                console.log(wines[i]);
                var wine = wines[i];
                var $wine_template = $('<div class="col-sm-4 text-center"><span></span><img class="img-responsive"><h4><' +
                        'small></small></h4></div></li>');

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

function saveWine(wine) {
    console.log("the wine is ")
    console.log(wine);
    $.ajax({
        url: '/vault',
        data: JSON.stringify(wine),
            method: 'POST',
            contentType: 'application/json'
        })
        .done(function (wine) {
            console.log('done');
            console.log(wine);
        })
        .fail(function (error) {
            callback(error, null);
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

            console.log(wine);

            saveWine(wine);

        });

    });

$('#createform').submit(function (event) {
    console.log($(this).find("#name").val());
    console.log($(this).find("#lastName").val());
    event.preventDefault();
    $.ajax({
        url: "/wineaux/create",
        method: "POST",
        data: {
            name: $(this)
                .find("#name")
                .val(),
                lastName: $(this)
                    .find("#lastName")
                    .val()
            }
        })
        .done(function (response) {
            console.log(response);
        })
        .fail(function (failed) {
            console.log(failed);
        })
});