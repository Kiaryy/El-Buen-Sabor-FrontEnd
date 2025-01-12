import { load_bebidas, nombreBebidas } from "../show-drinks/show-drinks.mjs";
import { totalBebidas } from "../show-drinks/show-drinks.mjs";


// Referencias a los elementos del modal de platos (productModal)
const productModal = document.getElementById('productModal');
const modalImageFood = productModal.querySelector('#modal-img');
const modalNameFood = productModal.querySelector('#modal-title');
const modalDescriptionFood = productModal.querySelector('#modal-description');
const modalPriceFood = productModal.querySelector('#modal-price');
const modalPriceFoodPromo = document.querySelector('#modal-price-promo');



let totalPlatos = 0;
let totalPromos=0

// Evento para abrir el modal de platos al hacer clic en una tarjeta de comida
document.addEventListener('click', function(event) {
    if (event.target.closest('.card-food')) { 
        const foodCard = event.target.closest('.card-food');
        
        // Obtener datos del plato desde los atributos data-* de la tarjeta
        const foodName = foodCard.dataset.name;
        const foodPrice = foodCard.dataset.price;
        const foodDescription = foodCard.dataset.description;
        const foodImage = foodCard.querySelector('img').src;

        // Cargar los datos del plato en el modal
        modalImageFood.src = foodImage;
        modalNameFood.textContent = foodName;
        modalDescriptionFood.textContent = foodDescription;
        modalPriceFood.textContent = `Precio: $${foodPrice}`;

        // Reiniciar la cantidad y el texto del botón de agregar al carrito
        document.getElementById('opcion-clasica').value = 0;
        document.querySelector('.btn-agregar-carrito').textContent = `Agregar al Carrito - TOTAL: $0`;

        // Mostrar el modal del plato después de cargar los datos
        productModal.style.display = "block";
        load_bebidas(); 
    }
});

// Cerrar el modal de platos
const closeFoodModal = productModal.querySelector('.close');
closeFoodModal.onclick = function() {
    productModal.style.display = "none";
};

// Evento para cerrar los modales al hacer clic fuera de ellos
window.onclick = function(event) {
    if (event.target === productModal) {
        productModal.style.display = "none";
    }
};

// Funciones de aumentar/disminuir cantidad y actualizar el total en el modal de platos
function increaseQuantity(id) {
    const inputField = document.getElementById(`${id}`);
    console.log(inputField);
    
    let currentValue = parseInt(inputField.value);
    inputField.value = currentValue + 1;
    updateTotalFood(id); // Actualiza el total en el botón "Agregar al Carrito"
}
window.increaseQuantity = increaseQuantity;


function decreaseQuantity(id) {
    console.log(id);
    
    const inputField = document.getElementById(id);
    let currentValue = parseInt(inputField.value);
    if (currentValue > 0) {
        inputField.value = currentValue - 1;
        updateTotalFood(id); // Actualiza el total en el botón "Agregar al Carrito"
    }
}
window.decreaseQuantity = decreaseQuantity;


function updateTotalFood(tipo) {
    if (tipo=="opcion-promo") {
    
        const price = parseInt(modalPriceFoodPromo.textContent.replace('Precio: $', ''));
        const qtyClasica = parseInt(document.getElementById('opcion-promo').value);
        console.log(qtyClasica);
        
        totalPromos = price * qtyClasica; // Calcula el subtotal de los platos
        updateTotalCarrito(tipo);
    }
    else {
        const price = parseInt(modalPriceFood.textContent.replace('Precio: $', ''));

        const qtyClasica = parseInt(document.getElementById('opcion-clasica').value);
        totalPlatos = price * qtyClasica; // Calcula el subtotal de los platos
        updateTotalCarrito(tipo); // Llama a la función que actualiza el total combinado
    }
}
window.updateTotalFood = updateTotalFood; // Asegúrate de que esta función esté disponible globalmente

export function updateTotalCarrito(tipo) {
    if (tipo=="opcion-promo") {
        const total=totalPromos
        console.log(document.querySelector('.btn-agregar-carrito-promo'));
        
        document.querySelector('.btn-agregar-carrito-promo').textContent = `Agregar al Carrito - TOTAL: $${total}`;
    }else{

        const total = totalPlatos + totalBebidas; // Suma los subtotales de platos y bebidas
        document.querySelector('.btn-agregar-carrito').textContent = `Agregar al Carrito - TOTAL: $${total}`;
    }
}

// Agregar al carrito
let button_add = document.querySelector('.btn-agregar-carrito');
const carritoPlato = document.querySelector("#pedido ul");
let shopping_cart = 0;


button_add.addEventListener("click", () => {


    let qtyBebida = parseInt(document.getElementById('opcion-bebidas').value); // Cantidad seleccionad
    let name = modalNameFood.textContent; 
    let qtyPlato = parseInt(document.getElementById('opcion-clasica').value); // Cantidad seleccionada
   
    let pricePlato = parseInt(modalPriceFood.textContent.replace('Precio: $', ''));
    console.log(pricePlato);
    
    let total_price_plato = (pricePlato * qtyPlato); 

    if (qtyPlato > 0) {
        // Verifica si el producto ya está en el carrito
        let existingItem = Array.from(carritoPlato.querySelectorAll('.item-carrito')).find(item => 
            item.textContent.includes(name)
        );
        if (existingItem) {
            showToast('Ya tenes el plato en el carrito', 2500);
            
        }else{      
            if (nombreBebidas) {
                
                let newItem = document.createElement("li");
                newItem.classList.add("item-carrito");
                newItem.innerHTML = `${nombreBebidas} x${qtyBebida} <span>$${totalBebidas}</span>`;
                shopping_cart += totalBebidas;
                carritoPlato.appendChild(newItem);
                update_cart_plato(shopping_cart);
            } 

                let newItem = document.createElement("li");
                newItem.classList.add("item-carrito");
                newItem.innerHTML = `${name} x${qtyPlato} <span>$${total_price_plato}</span>`;
                shopping_cart += total_price_plato;
                carritoPlato.appendChild(newItem);
                update_cart_plato(shopping_cart);
                showToast('Producto agregado al carrito correctamente', 1500);
            
        }
    }
});

// Función para actualizar el total en el carrito
let total_carrito_plato = document.getElementById('total-pedido');
function update_cart_plato(total) {
    total_carrito_plato.innerHTML = `TOTAL: $${total}`;
}



// Notificaciones
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message; // Establece el mensaje
    toast.classList.add('show');
    
    // Quitar la notificación después del tiempo especificado
    setTimeout(() => {
        toast.classList.add('hide'); // Añade clase para iniciar animación de salida
    }, duration - 500); // Restamos 500 ms para iniciar la animación antes
    
    // Ocultar completamente después de la animación
    setTimeout(() => {
        toast.classList.remove('show', 'hide');
    }, duration);
}

// Modo edición del carrito
const buttonEditCart = document.querySelector('#editar-carrito'); // Botón "Editar Carrito"
let editMode = false;

// Función para alternar el modo edición
buttonEditCart.addEventListener("click", () => {
    editMode = !editMode;
    carritoPlato.classList.toggle('edit-mode'); // Añade una clase para dar feedback visual
    if (editMode) {
        showToast('Selecciona un item para eliminar', 2000);
    }
});

// Evento para eliminar un item al hacer clic en él en modo edición
carritoPlato.addEventListener("click", (event) => {
    if (editMode && event.target.closest('.item-carrito')) {
        const item = event.target.closest('.item-carrito');
        
        // Obtener el precio del producto y restarlo del total
        const priceText = item.querySelector('span').textContent.replace('$', '');
        const itemPrice = parseInt(priceText);
        shopping_cart -= itemPrice;

        // Eliminar el item del carrito y actualizar el total
        item.remove();
        update_cart_plato(shopping_cart);
        showToast('Producto eliminado del carrito', 1500);
    }
});


