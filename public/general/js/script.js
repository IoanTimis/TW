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
    var csrf_token = $('input[name="csrf_token"]').val();

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
                csrf_token: csrf_token,
                name: name,
                price: price
            },
            success: function(response) {
                if( method === 'POST') {
                var html = 
                `<div class="col" data-id="${ response.id }">
                    <div class="card h-100">
                        <img src="/images/pantof.jpeg" class="card-img-top" alt="Product Image">
                        <div class="card-body text-center">
                            <h5 class="card-title">${ response.name }</h5>
                            <p class="card-text">${ response.price }</p>
                            <a href="#" class="btn btn-danger deleteProductBtn" data-id="${ response.id }">Delete</a>
                            <a href="#" class="btn btn-primary editProductBtn" data-id="${ response.id }">Edit</a>
                        </div>
                    </div>
                </div>`;
                $('.row').append(html);
                alert('Produs adaugat cu succes!');
                } else { 
                    let $col = $(`.row`).find(`.col[data-id="${response.id}"]`);
                    $col.find('.card-title').html(name).val(response.name);
                    $col.find('.card-text').html(price).val(response.price);
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
        var $col = $(this).closest('.col');
        $.ajax({
            url: `/account/vendor/delete/product/${id}`,
            method: 'delete',
            data: {
                csrf_token: csrf_token
            },
            success: function(response) {
                $col.remove();
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
            data: {
                csrf_token: csrf_token        
            },
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

