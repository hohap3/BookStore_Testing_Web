function Validator2(options) {

  const formLoginElement = document.querySelector(options.formLogin);

  // Tạo hàm riêng để tìm thẻ cha

  function getParentElement(element,select) {

    while(element.parentElement) {

      // Nếu tìm thấy element trùng khớp với element mà select truyền vào , thì ta trả về element đó luôn
      if(element.parentElement.matches(select))
        return element.parentElement;
      
      element = element.parentElement;  

    }

  }

  // Tạo ra hàm xử lý riêng
  function Validate2(inputElement,rule) {

    var getParent = getParentElement(inputElement,options.formGroup);

    var errorSelector = getParent.querySelector(options.errorSelector);

    var rules = ruleSelector[rule.selector];

    var errorMessage;

    // Sử dụng for in để gắn lỗi vào errorMessage

    for(let index in rules) {
      switch(inputElement.type) {
        case 'checkbox':
        case 'radio':
          errorMessage = rules[index](formLoginElement.querySelector(rule.selector+':checked'));
          break;  
        default:
          errorMessage = rules[index](inputElement.value);  
      }
      if(errorMessage) break;  
    }
    // Nếu có lỗi
    // Hiển thị lỗi và màu đỏ quanh thẻ cha
    if(errorMessage) {
      errorSelector.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
      getParent.classList.add('invalid');
    }
    // Nếu không có lỗi
    // Loại bỏ hiển thị lỗi và màu đỏ quanh thẻ cha
    else {
      errorSelector.innerHTML = '';
      getParent.classList.remove('invalid');
    }

    return !errorMessage;
  }

  // Ta tạo ra object dùng để lưu trữ dữ liệu từng function check
  var ruleSelector = {};

  
  if(formLoginElement) {

    formLoginElement.onsubmit = (e) => {
      e.preventDefault(); //Ngăn chặn hành vi mặc định

      let isFormValid = true;

      options.rules.forEach((rule) => {
        var inputElement = formLoginElement.querySelector(rule.selector);

        let isValid = Validate2(inputElement,rule);

        if(!isValid)
          isFormValid = false;

      })
      // Nếu mà người dùng nhập đầy đủ thông tin , thì sẽ hiển thị ra thông tin người dùng đó
      if(isFormValid) {

        if(typeof options.onSubmit === 'function') {

          var enableInputs = formLoginElement.querySelectorAll('[name]:not([disabled])');
          // Trả về nodeList

          var result = Array.from(enableInputs).reduce((values,input) => {
            values[input.name] = input.value;
            return values;
          },{})

          options.onSubmit(result);
        }
      //Không thì sẽ báo lỗi 
      }
      else
        window.alert('Vui lòng điền đầy đủ thông tin');

    }

    options.rules.forEach((rule) => {

      
      // Nếu mà ruleSelector[rule.selector] có phải là array không
      // Nếu là array thì ta thêm từng function check vào
      if(Array.isArray(ruleSelector[rule.selector]))
        ruleSelector[rule.selector].push(rule.check);
      else
        ruleSelector[rule.selector] = [rule.check]; //Nếu không , ta lấy phần tử đầu tiên làm array luôn
      
      
      var inputElements = formLoginElement.querySelectorAll(rule.selector);
      // Trả về 1 nodeList

      // Sử dụng Array from để chuyển đổi sang thành array
      Array.from(inputElements).forEach((inputElement) => {

        // Khi người dùng blur chuột ra ngoài
        inputElement.onblur = () => {
          Validate2(inputElement,rule);
        }

        // Khi người dùng thực hiện input
        inputElement.oninput = () => {
          var getParent = getParentElement(inputElement,options.formGroup);
          var errorSelector = getParent.querySelector(options.errorSelector);
          errorSelector.innerHTML = '';
          getParent.classList.remove('invalid');
        }

      })

    });

  }


}

// Rules
/**
 * 1. Khi người dùng thực hiện sai thì hiển thị ra lỗi
 * 2. Khi người dùng đúng thì hiển thị ra undefined
 */

Validator2.isRequired = (selector,form) => {
  return {
    selector:selector,
    check:(value)=> {
      return value.trim() ? undefined : 'Vui lòng điền vào trường này!';
    }
  }
}

Validator2.isEmail = (selector) => {
  return {
    selector:selector,
    check:(value)=> {
      const emailRegex =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return value.match(emailRegex) ? undefined : 'Email nhập không hợp lệ!';
    }
  }
}