$(document).ready(function() {
    
    // Register Form Validation -----------------------------------------------------------------------------------------------------
    var $form = $('#registerForm');

    $form.on('submit', function(e) {
        if($form.find('input[name="password"]').val().length < 6) {
            alert('Parola trebuie sa fie de minim 6 caractere!');
            return false;
        }else if($form.find('input[name="password"]').val() !== $form.find('input[name="passwordConfirm"]').val()) {
            alert('Parolele nu coincid!');
            return false;
        } else  {
            return true;
        }
    });

// vendor CRUD Products -----------------------------------------------------------------------------------------------------
    var $productModal = $('#productModal');
    var $productForm = $('#productForm');

    $($productForm).on('submit', function(e) {
        e.preventDefault();

        var url = $productForm.attr('action');
        var method = $productForm.attr('method');
        var name = $productForm.find('input[name="name"]').val();
        var price = $productForm.find('input[name="price"]').val();

        $.ajax({
            url: url,
            method: method,
            data: {
                name: name,
                price: price
            },
            success: function(response) {
                if( method === 'POST') {
                var html = 
                `<li class="liProduct">
                    <strong>${response.name}</strong>,
                    price: <span>${response.price}</span>
                    !!Recent adaugat!!
                    <button class="btn editProductBtn" data-toggle="modal" data-target="#editModal" data-id="${response.id}">Edit</button>
                    <button class="btn deleteProductBtn" data-id="${response.id}">Delete</button>
                </li>`;
                $('.ulProducts').append(html);
                alert('Produs adaugat cu succes!');
                } else { 
                    let $li = $(`.ulProducts`).find(`li[data-id="${response.id}"]`);
                    $li.find('strong').html(response.name);
                    $li.find('span').html(response.price);
                    alert('Produs editat cu succes!');
                }
                $productModal.modal('hide');
                console.log(response);
            }, 
            error: function(error) {
                console.log(error);
            }
        });
    });

    $('.addProductBtn').on('click', function() {
        $productModal.find('.modal-title').html('Adauga Produs');
        $productModal.find('.modal-footer button[type="submit"]').html('Adauga');

        $productForm.attr('action', '/account/vendor/add/product');
        $productForm.attr('method', 'POST');

        $productForm.find('input[name="name"]').val('');
        $productForm.find('input[name="price"]').val('');

        $productModal.modal('show');
    });

    $('.editProductBtn').on('click', function() {
        var id = $(this).data('id');
        $productModal.find('.modal-title').html('Editeaza Produs');
        $productModal.find('.modal-footer button[type="submit"]').html('Editeaza');

        $productForm.attr('action', `/account/vendor/edit/product/${id}`);
        $productForm.attr('method', 'PUT');

        $.ajax({
            url: `/account/vendor/my-product/${id}`,
            method: 'get',
            success: function(response) {
                $productForm.find('input[name="name"]').val(response.name);
                $productForm.find('input[name="price"]').val(response.price);
            },
            error: function(error) {
                console.log(error);
            }
        });

        $productModal.modal('show');
    });

    $('.deleteProductBtn').on('click', function() {
        var id = $(this).data('id');
        $.ajax({
            url: `/account/vendor/delete/product/${id}`,
            method: 'delete',
            success: function(response) {
                $(`.ulProducts`).find(`li[data-id="${id}"]`).remove();
                alert('Produs sters cu succes!');
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    // Orders -----------------------------------------------------------------------------------------------------
    $('.buyBtn').on('click', function(e) {
        e.preventDefault();
        var id = $(this).data('id');
        var url = `/buy/product/${id}`;
        var method = 'POST';

        $.ajax({
            url: url,
            method: method,
            success: function(response) {
                console.log(response);
                alert('Produs Cumparat cu succes!');
            }, 
            error: function(error) {
                console.log(error);
                alert('Produsul nu a putut fi cumparat!');
            }
        });
    });

    // Search Products -----------------------------------------------------------------------------------------------------
    
});

