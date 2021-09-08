
// Function Constructor

function Validator(options) {

  // Tạo hàm đề tìm kiếm element cha

  function getParentElement(element,selector) {
    // Sử dụng vòng lặp while để tìm kiếm element cha
    while(element.parentElement) {
      // Nếu tìm thấy element cha mà trùng khớp với selector thì trả về element đó
      if(element.parentElement.matches(selector))
        return element.parentElement;
      // Nếu không tìm thấy , ta gắn element đó thành element cha mới và tiếp tục tìm 
      element = element.parentElement;  
    }
  }

  // Tạo ra hàm riêng để xử lý rỗi
  function Validate(inputElement,rule) {
    
    var getParent = getParentElement(inputElement,options.formGroup);

    // Lưu từng value object vào rules
    var rules = selectorRule[rule.selector];

    var errorSelector = getParent.querySelector(options.errorSelector);

    var errorMessage;

    // Sử dụng vòng lặp để lấy ra từng rule
    for(let index in rules) {
      
      switch(inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[index](formElement.querySelector(rule.selector+':checked'))
          break;  
        default:
          errorMessage = rules[index](inputElement.value);
      }

      if(errorMessage) break;
    }

    if(errorMessage) {
      
      errorSelector.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
      getParent.classList.add('invalid'); 
    }
    else {
      errorSelector.innerHTML = '';
      getParent.classList.remove('invalid'); 
    }

    return !errorMessage;
  }

  const formElement = document.querySelector(options.form);

  // Tạo ra object rỗng để lưu từng giá trị rule check
  var selectorRule = {};

  if(formElement) { 

    formElement.onsubmit = (e) => {
      e.preventDefault(); //Ngăn chặn hành vi mặc định

      let isFormValid = true;

      options.rules.forEach((rule) => {
        var inputElement = formElement.querySelector(rule.selector);

        let isValid = Validate(inputElement,rule);

        if(!isValid)
         isFormValid = false;

      })

      // Nếu mà người dùng nhập đầy đủ thông tin , ta hiển thị ra thông tin người dùng
      if(isFormValid) {
        if(typeof options.onSubmit === 'function') {

          var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

         var formValue = Array.from(enableInputs).reduce((value,input) => {
          
            switch(input.type) {
              case 'radio':
                if(input.matches(':checked'))
                  value[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                break;    
              default:
                value[input.name] = input.value;
            }

            return value;
          },{})
        }

        options.onSubmit(formValue);
      }
      else
        alert('Vui lòng nhập đầy đủ thông tin');

    }

    // Duyệt qua từng rules
    options.rules.forEach((rule) => {
      var inputElements = document.querySelectorAll(rule.selector); //Trả về nodeList

      // Nếu selectorRule là array thì ta mới thêm vào function check
      if(Array.isArray(selectorRule[rule.selector]))
        selectorRule[rule.selector].push(rule.check);
      // Nếu không phải là array , thì ta lấy luôn phần tử đầu tiên
      else
       selectorRule[rule.selector] = [rule.check];

      Array.from(inputElements).forEach((inputElement) => {
        
        // Khi người dùng blur chuột ra ngoài
        inputElement.onblur = () => {
          Validate(inputElement,rule);
        }

        // Khi người dùng đang điền thông tin
        inputElement.oninput = () => {
          var getParent = getParentElement(inputElement,options.formGroup);
          var errorSelector = getParent.querySelector(options.errorSelector);
          errorSelector.innerHTML = '';
          getParent.classList.remove('invalid');
        }

        // Khi người dùng thay đổi select
        // inputElement.onchange = () => {
        //   validator(inputElement,rule);
        // }
      });
    })
  }

}

// Rules
/**
 * 1. Khi người dùng nhập sai , hiển thị thông báo lỗi
 * 2. Khi người dùng đúng , hiển thị undefined
 */

Validator.isRequired = (selector,formElement) => {
  return {
    selector:selector,
    check:(value) => {
      switch(document.querySelector(`${formElement} ${selector}`).type) {
        case 'radio':
        case 'checkbox':
          return value ? undefined : 'Vui lòng đánh vào trường này!';
        default:
          return value.trim() ? undefined : 'Vui lòng điền vào trường này';
      }
    }
  }
}

Validator.isEmail = (selector) => {
  return {
    selector:selector,
    check:(value) => {
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return value.match(regexEmail) ? undefined : 'Vui lòng nhập email hợp lệ';
    }
  }
}

Validator.minLengthPassword = (selector,min) => {
  return {
    selector:selector,
    check:(value) => {
      return value.length >= min ? undefined : `Vui lòng nhập mật khẩu có kí tự từ ${min} trở lên`;
    }
  }
}

Validator.isConfirmedPassword = (selector,isConfirmed) => {
  return {
    selector:selector,
    check:(value) => {
      return value === isConfirmed() ? undefined : 'Mật khẩu nhập lại không trùng!';
    }
  }
}