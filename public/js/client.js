$(document)
    .ready(function () {
        getSavedWines(function (error, wine){
            if (error) {
                throw error;
            } 
            else if(wine) {
                displayVault(wine);
                displayComment(wine);
            }
        })
        displayEmptySearchResults();
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
        .done(function(results){
            callback(null, results);
        })
        .fail(function(error){
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

function addComment(wine) {
    $.ajax({
        url: '/vault/wines/comment',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(commentToSend)
        })
        .done(function (comment) {
            console.log(comment);
        })
        .fail(function (error) {
            console.log(error);
        });
}

function deleteWine(wine, cb) {
    $.ajax({
        url: '/vault/delete',
        data: JSON.stringify(wine),
            method: 'POST',
            contentType: 'application/json'
        })
        .done(function (deleted) {
            cb(true);
        })
        .fail(function (error) {
            cb(false)
        });
}

function displayVault(wine) {
    if(wine.length){
        $('.js-wine-detail').empty();
        if(wine.length <= 1){
            // console.log("less than 1" + wine);
            $('#user-vault').html("You have <strong>" + " " + wine.length + " " + "wine </strong> in your vault");
        }
        else if(wine.length > 1){
            // console.log("greater than 1" + wine);
            $('#user-vault').html("You have <strong>" + " " + wine.length + " " + "wines </strong> in your vault");
        }

        wine.forEach( function (wine){
            // console.log("for each" + wine);

            // console.log(wine.name);
            var $wine_detail_template = $(
                '<div class="col-lg-12">' + 
                    '<h4></h4>' + 
                    '<small class="deleteWine">Delete Wine</small>' +
                    '<form id="commentForm" role="form">' + 
                    '<div class="form-group">' +
                        '<label>Add Note:  </label>' +
                        '<input type="text" class="input-sm">' + 
                    '<button id="commentButton">Submit</button></form>' +
                    '<div class="col-lg-12 js-wine-comments"><div class=js-comment></div></div>' +
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

function displayComment(wines) {
    if(wines.length){

        wines.forEach( function (wines){
            var comments = wines.comments;
            var id = wines.id

            if(Array.isArray(comments)){
                console.log(comments);

                comments.forEach(function (comment){
                    var comment = comment.comment;
                    console.log("the comment" + comment);

                    var $comment_detail_template = $('<div><p></p></div>');
                    $comment_detail_template
                        .find('p')
                        .text(comment);
                        
                    $('.js-wine-comments').append($comment_detail_template);
                })  
            }
            else{
            console.log("no comment for this wine");
            var $comment_detail_template2 = $('<div><p>Nothing</p></div>');
                        
                    $('.js-wine-comments').append($comment_detail_template2);
            }
        })
    }
} //end of displayComment

// ================== EVENT LISTENERS ===============================//

//  Adding wine to vault
$('.js-search-results')
    .on('click', 'div', function () {
        // findById
        var id = $(this).attr('value');
        // console.log("This is the on click id" +id);

        findById(id, function (error, wine) {
            if (error) {
                return new Error("Something went wrong.");
            }
            wine.id = id;
            // console.log("this is findbyid the wine" + wine);

            // Save in req.session.wine
            saveWine(wine, function (isSaved) {
                if (isSaved) {
                    console.log("saved");

                    getSavedWines(function (error, wine){
                        if (error) {
                            throw error;
                        } 
                        else if(wine) {

                            // console.log("Initial display vault wine object: " + wine);
                            displayVault(wine);
                            displayComment(wine);
                        }
                    })
                }
            });
        });
    });

// Searching wine.com API for wine and displaying results
$('#searchForm').submit(function(event){
    event.preventDefault();
    var query = $('input').val();
    $('.js-search-results').empty();
    $
        .ajax({url: '/vault/search/' + query, type: 'POST'})
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

// Adding a comment to wine in Vault
$(document).on("submit", "#commentForm", function (event){
    event.preventDefault();
    var id = $(this).parent().attr('value');
    console.log(id);

    var commentToSend = {
        id: id,
        comment: $(this).find('input').val()
    }
    console.log(commentToSend);

    $
        .ajax({
            url: '/vault/wines/comment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(commentToSend)
        })
        .done(function(comment){
            console.log(comment);
        })
        .fail(function(error){
            console.log(error);
        });
})

// Delete wine
$('.js-wine-detail')
    .on('click', '.deleteWine', function () {
        // findById
        var id = $(this).attr('value');
        // console.log("This is the on click id" +id);

        findById(id, function (error, wine) {
            if (error) {
                return new Error("Something went wrong.");
            }
            wine.id = id;
            // console.log("this is findbyid the wine" + wine);

            // Save in req.session.wine
            deleteWine(wine, function (isDeleted) {
                if (isDeleted) {
                    console.log("deleted");

                    getSavedWines(function (error, wine){
                        if (error) {
                            throw error;
                        } 
                        else if(wine) {
                            displayVault(wine);
                            displayComment(wine);
                        }
                    })
                }
            });
        });
    });