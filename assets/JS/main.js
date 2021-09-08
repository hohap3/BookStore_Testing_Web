const registerElement = document.querySelector('.header__navbar-item-link--has-modal');

const modalElement = document.querySelector('.modal');

const modalLoginElement = document.querySelector('.modal-login');

const modalCloseRegister = document.querySelectorAll('.modal__close-btn')[0];

const modalCloseLogin = document.querySelectorAll('.modal__close-btn')[1];

const modalContainerRegister = document.querySelectorAll('.modal-container')[0];

const modalContainerLogin = document.querySelectorAll('.modal-container')[1];

const modalSecondCloseRegister = document.querySelectorAll('.modal__second-close')[0];

const modalSecondCloseLogin = document.querySelectorAll('.modal__second-close')[1];

const headerSearchHistory = document.querySelector('.header__search-history-list');

const headerSearchHistoryItems = document.querySelectorAll('.header__search-history-item');

const loginElement = document.querySelector('.header__navbar-item-link--has-modal-login');


// Register
// Show modal register
registerElement.addEventListener('click',() => {
  modalElement.classList.add('open');
})

// Close button to close modal

modalCloseRegister.addEventListener('click',() => {
  modalElement.classList.remove('open');
})

// When user click on overlay , then close modal

modalElement.addEventListener('click',() => {
  modalElement.classList.remove('open');
});

// When user click on second close 

modalSecondCloseRegister.addEventListener('click',() => {
  modalElement.classList.remove('open');
})

// Tránh đi hiện tưởng nổi bọt

modalContainerRegister.addEventListener('click',(e) => {
  e.stopPropagation(); //Ngăn chặn hành vi nổi bọt
});

// Login

loginElement.addEventListener('click',() => {
  modalLoginElement.classList.add('open');
});

modalCloseLogin.addEventListener('click',() => {
  modalLoginElement.classList.remove('open');
})

modalSecondCloseLogin.addEventListener('click',() => {
  modalLoginElement.classList.remove('open');
})

modalLoginElement.addEventListener('click',() => {
  modalLoginElement.classList.remove('open');
});

modalContainerLogin.addEventListener('click',(e) => {
  e.stopPropagation();
})


// Khi người dùng rê chuột xuống , ngăn chặn hành vi mặc định

headerSearchHistory.addEventListener('mousedown',(e) => {
  e.preventDefault();

  console.log(e.target);

})

// Lấy dữ liệu từ json server rồi đổ lên website

const productHasBought = "http://localhost:3000/Product-has-bought";

function start() {
  getAllProduct((products) => {
    renderProduct(products);

    showItemCart(products);

  })
}

start();

// Get all Product has bought

function getAllProduct(callback) {
  fetch(productHasBought)
       .then((response) => response.json()) //json là json.parse chuyển đổi JSON -> Javascript types
       .then(callback)
       .catch(() => alert('Không thể kết nối đến máy chủ'));
}

// Render all Product has bought ra ngoài website

function renderProduct(products) {

  const headerCartListItem = document.querySelector('.header__cart-list-item');

  var products = products.map((product) => {
    return `
    <li class="header__cart-item header__cart-item-${product.id}">
      <a href=# class=header__cart-item-link>

      <img src=${product.img} alt="" class=header__cart-item-img>

      <div class=header__cart-item-info>
        <div class=header__cart-item-head>
          <h5 class=header__cart-item-name>${product.name}</h5>

          <div class=header__cart-price-wrap>
            <span class=header__cart-price>${product.price}</span>
            <span class=header__cart-x>x</span>
            <span class=header__cart-amount>${product.amount}</span>
          </div>

        </div>

        <div class=header__cart-item-bottom>
          <span class=header__cart-des>${product.description}</span>
          <button class=header__cart-delete onclick=handleDeleteProduct(${product.id})>
            <i class="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </a>
  </li>
    `;
  }).join('');

  headerCartListItem.innerHTML = products;
}

function handleDeleteProduct(id) {

  var isConfirmed = confirm('Bạn có muốn xóa sản phẩm này');

  if(isConfirmed) {
    const options = {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    }
  
    fetch(productHasBought+'/'+id,options)
         .then((response) => response.json())

          .then(() => {
            const productItem = document.querySelector(`.header__cart-item-${id}`);

            if(productItem)
              productItem.remove(); //Xóa đi item đã tồn tại

          })

         .catch(() => alert('Không thể kết nối đến máy chủ'));
  }

}

function showItemCart(products) {

  const headerCartNotice = document.querySelector('.header__cart-notice');

  const productItemLength = products.length;

  if(productItemLength > 0) 
    headerCartNotice.innerText = productItemLength;
  else
    headerCartNotice.innerText = '';  


}

// Slider

// var sliderIndex = 1;
// showSliders(sliderIndex);

// // Next/previous button

// function plusSliders(n) {
//   showSliders(sliderIndex += n);
// }

// // ShowSliders function

// function showSliders(n) {
//   var i;
//   var sliderImg = document.querySelectorAll('.slider-picture');

//   // Nếu mà người dùng bấm next vượt qua số lần hình ảnh có trong slider thì ta trả về giá trị 1 ban đầu
//   if(n > sliderImg.length) sliderIndex = 1;
//   // Nếu mà người dùng bấm prev thấp hơn 1 thì ta trả về hình ảnh cuối cùng
//   if(n < 1) sliderIndex = sliderImg.length;

//   // Mấy slider hình ảnh còn lại sẽ không được hiển thị
//   for(i = 0 ;i<sliderImg.length ;i++) {
//     sliderImg[i].style.display = 'none';
//   }

//   sliderImg[sliderIndex-1].style.display = 'block';

// }

// Slider

var sliderIndex = 1;
showSliders(sliderIndex);

// Next/Prev button

function plusSliders(n) {
  showSliders(sliderIndex += n);
}

function showSliders(n) {

  var i;

  const sliderImgs = document.querySelectorAll('.slider-picture');

  // Nếu mà người dùng click next vượt qua tối đa mà hình ảnh slider sãn có , ta gắn sliderIndex lại là 1 
  if(n > sliderImgs.length) sliderIndex = 1;

  // Nếu mà người dùng click preve thấp hơn tối thiểu mà hình ảnh slider sãn có , ta gắn sliderIndex lại là chính độ dài của slider img 
  if(n < 1) sliderIndex = sliderImgs.length;

  for(i = 0 ; i<sliderImgs.length ;i++) {
    sliderImgs[i].style.display = 'none';
  }

  sliderImgs[sliderIndex - 1].style.display = 'block';
}

function dateSaleOff() {

  // Lấy ra thời gian kết thúc sale off
  var countDownDate = new Date("August 12 , 2021 23:59:59").getTime();

  const time = document.querySelectorAll('.product-heading-sale-off-title')[1];

  // Ta update countdown cứ mỗi 1 giây , sử dụng hàm setInterval

  var x = setInterval(() => {

    // Lấy ra ngày hiện tại
    var now = new Date().getTime();

    // Ta lấy ngày sự kiện kết thúc - cho ngày hôm nay
    var distance = countDownDate - now;

    // Tính thời gian
    var days = Math.floor((distance / (1000 * 60 * 60 * 24)));

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Nếu mà count down kết thúc , ta kết thúc luon hàm setInterval và hiển thị ra hết hạn

    time.innerText = `${days} ngày - ${hours}:${minutes}:${seconds}`;

    if(distance < 0) {
      clearInterval(x);
      time.innerText = 'Hết hạn';
    }

  },1000)

}

dateSaleOff();
