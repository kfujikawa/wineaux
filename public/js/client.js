$(document)
    .ready(function () {
        getSavedWines(function (error, wine) {
            if (error) {
                throw error;
            } else if (wine) {
                displayVault(wine);
                displayComment(wine);
            }
        })
        displayEmptySearchResults();
    })
// ======================== METHODS ===============================//
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
        .ajax('/vault/wines')
        .done(function (wines) {
            callback(null, wines);
        })
        .fail(function (error) {
            callback(error, wines);
        });
}

function getSearchResults(callback) {
    var query = $('#search').val();
    $
        .ajax({
            url: 'vault/search/' + query,
            type: 'POST'
        })
        .done(function (results) {
            callback(null, results);
        })
        .fail(function (error) {
            callback(error, null);
        });
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

function addComment(commentData, cb) {
    $
        .ajax({
            url: '/vault/wines/comment',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(commentData)
        })
        .done(function (comment) {
            cb(null, comment);
        })
        .fail(function (error) {
            cb(new Error('Something went wrong...'), null);
        });
}

function deleteWine(id, cb) {
    $
        .ajax({
            url: '/vault/' + id,
            method: 'DELETE'
        })
        .done(function (deleted) {
            cb(true);
        })
        .fail(function (error) {
            cb(false)
        });
}

function displayVault(wine) {
    if (wine.length) {
        $('.js-wine-detail').empty();
        if (wine.length <= 1) {
            $('#user-vault').html("You have <strong> " + wine.length + " wine </strong> in your vault");
        } else if (wine.length > 1) {
            $('#user-vault').html("You have <strong> " + wine.length + " wines </strong> in your vault");
        }

        wine
            .forEach(function (wine) {
                var $wine_detail_template = $(
                    '<div class="col-lg-12 js-single-wine">' + 
                        '<h4></h4>' + 
                            '<small class="deleteWine">Delete Wine</small>' +
                            '<form class="commentForm" role="form">' +
                            '<div class="commentText">' +
                            '<label class="commentLabel">Comment:</label>' +
                                '<input type="text" class="input">' +
                                '<button class="button" id="commentButton">Submit</button>' +
                            '</form>' +
                            '<div class="col-lg-12">' +
                                '<ul class="js-wine-comments"></ul>' +
                            '</div>' +
                    '</div>');
                $wine_detail_template.attr('value', wine.id);
                $wine_detail_template
                    .find('h4')
                    .text(wine.name);
                $('.js-wine-detail').append($wine_detail_template);
            })
    } else {
        $('#user-vault').html('Your <strong>vault</strong> is currently empty');
    }
}

function displayEmptySearchResults() {
    $('.js-vault').html("Search For A Wine To Add It To Vault");
}

function displayComment(comments) {

    if (comments.length) {
        comments
            .forEach(function (data) {
                var ul = $('div[value="' + data.id + '"]').find('.js-wine-comments');
                for (var i = 0; i < data.comments.length; i++) {
                    $(ul).append('<li class="list-group-item-wine">' + data.comments[i].comment);
                }
            });
    }
    else {
        console.log("No comment");
    }
}

// ================== EVENT LISTENERS ===============================//
// Searching wine.com API for wine and displaying results
$('#searchForm')
    .submit(function (event) {
        event.preventDefault();
        var query = $('input').val();
        $('.js-search-results').empty();
        $
            .ajax({
                url: '/vault/search/' + query,
                type: 'POST'
            })
            .done(function (wines) {
                for (var i = 0; i < wines.length; i++) {
                    var wine = wines[i];
                    var $wine_template = $('<div class="col-sm-4 text-center"><h4><small></small></h4></div><');
                    $wine_template.attr('value', wine.id);
                    $wine_template
                        .find('h4')
                        .text(wine.name);
                    $('.js-search-results').append($wine_template);
                    $('.js-vault').html("Select A Wine To Add It To Vault");
                }
            })
            .fail(function (error) {
                console.log(error);
            });
    })

//  Adding wine to vault when clicking on search result
$('.js-search-results').on('click', 'div', function () {
    // findById
    var id = $(this).attr('value');
    // console.log("This is the on click id" +id);

    findById(id, function (error, wine) {
        if (error) {
            return new Error("Something went wrong.");
        }
        wine.id = id;
        // console.log("this is findbyid the wine" + wine); Save in req.session.wine
        saveWine(wine, function (isSaved) {
            if (isSaved) {
                console.log("saved");

                getSavedWines(function (error, wine) {
                    if (error) {
                        throw error;
                    } else if (wine) {

                        displayVault(wine);
                    }
                })
            }
        });
    });
});

// Adding a comment to a saved wine in Vault
$(document).on("submit", ".commentForm", function (event) {
    event.preventDefault();
    var id = $(this)
        .parent()
        .attr('value');
    console.log(id);

    var comment = {
        id: id,
        comment: $(this)
            .find('input')
            .val()
    }
    addComment(comment, function (error, comment) {
        if (error) {
            console.log(error);
        } else {
            $(this)
                .find('.js-wine-comments')
                .append('<li class="list-group-item-wine">' + comment.comment);
        }
    }.bind(this));
});

// Deleting a wine saved in Vault
$('.js-wine-detail').on('click', '.deleteWine', function () {

    var id = parseInt($(this).parents('div').attr('value'));

    findById(id, function (error, wine){
        if(error){
            return new Error("Cant get wine");
        }
        else {    
            deleteWine(id, function (isDeleted) {
                if (isDeleted) {
                    console.log("deleted");
                    $(this)
                        .parent()
                        .remove();
                    getSavedWines(function (error, wine){
                        if(error){
                            throw error;
                        } else if (wine){
                            displayVault(wine);
                        }
                    })
                }
            }.bind(this));
        }
    })
})