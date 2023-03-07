import './style.css';

const $ = (q) => {
  let els = document.querySelectorAll(q);
  if (els.length > 1) {
    return els;
  } else if (els.length === 1) {
    return els[0];
  }
};

let state = 'main_screen';
let active = 'empty';
let inactive = 'empty';

function toggle(root_element) {
  if (root_element.getAttribute('data-toggled') === 'n') {
    root_element.setAttribute('data-toggled', 'y');
    root_element.style.backgroundColor = 'black';
  } else {
    root_element.setAttribute('data-toggled', 'n');
    root_element.style.backgroundColor = 'aqua';
  }
}

function add_modifier(object_title, object_operator, object_value) {
  let modifier = document.createElement('div');
  let object_content = object_title + ': ' + object_operator + object_value;

  modifier.className = 'modifier';
  modifier.id = 'mod' + $('#modifiers_container').childElementCount;
  $('#modifiers_container').appendChild(modifier);
  modifier.setAttribute('data-title', object_title);
  modifier.setAttribute('data-operator', object_operator);
  modifier.setAttribute('data-value', object_value);
  modifier.setAttribute('data-toggled', 'n');

  let label = document.createElement('label');
  label.className = 'wrapper';
  label.htmlFor = modifier.id + '_check';
  label.innerText = object_content;
  label.id = modifier.id + '_wrapper';
  $('#' + modifier.id).appendChild(label);

  let checkbox = document.createElement('input');
  checkbox.id = modifier.id + '_check';
  checkbox.className = 'label_input';
  checkbox.type = 'checkbox';
  $('#' + label.id).appendChild(checkbox);
  checkbox.addEventListener('change', (e) => {
    toggle(modifier);
  });
}

function add_category(object_title, object_value) {
  let category = document.createElement('div');
  let object_content = object_title + ': ' + object_value;

  category.className = 'category';
  category.id = 'cat' + $('#categories_container').childElementCount;
  $('#categories_container').appendChild(category);
  category.setAttribute('data-title', object_title);
  category.setAttribute('data-value', object_value);
  category.setAttribute('data-toggled', 'n');

  let label = document.createElement('label');
  label.className = 'wrapper';
  label.htmlFor = category.id + '_check';
  label.innerText = object_content;
  label.id = category.id + '_wrapper';
  $('#' + category.id).appendChild(label);

  let checkbox = document.createElement('input');
  checkbox.id = category.id + '_check';
  checkbox.className = 'label_input';
  checkbox.type = 'checkbox';
  $('#' + label.id).appendChild(checkbox);
  checkbox.addEventListener('change', (e) => {
    toggle(category);
  });
}

function button_logic(data, operator_label, value_label) {
  if (data === 'C') {
    operator_label.innerText = '';
    value_label.innerText = '';
  } else if (data === 'B') {
    value_label.innerText = value_label.innerText.substring(
      0,
      value_label.innerText.length - 1
    );
  } else if (data === '+') {
    operator_label.innerText = data;
  } else if (data === '-') {
    operator_label.innerText = data;
  } else {
    value_label.innerText += data;
  }
}

function transform_class(class_name, effect) {
  let c = $(class_name);
  let e = effect;
  c.forEach((object) => {
    object.style.transform = e;
  });
}

function bigbutton() {
  if (state === 'main_screen' || state === 'object_add') {
    screen_switch();
  }

  if (state === 'modifier_construct') {
    let mo_Empty = $('#mo_label').innerText === '';
    let mv_Empty = $('#mv_label').innerText === '';
    let mt_Empty = $('#mc_entry').value === '';

    if (mo_Empty || mv_Empty || mt_Empty) {
      return;
    } else {
      add_modifier(
        $('#mc_entry').value,
        $('#mo_label').innerText,
        $('#mv_label').innerText
      );
      $('#mc_entry').value = '';
      $('#mo_label').innerText = '';
      $('#mv_label').innerText = '';
      screen_switch();
    }
  }

  if (state === 'category_construct') {
    let cv_Empty = $('#cv_label').innerText === '';
    let ct_Empty = $('#cc_entry').value === '';

    if (cv_Empty || ct_Empty) {
      return;
    } else {
      add_category($('#cc_entry').value, $('#cv_label').innerText);
      $('#cc_entry').value = '';
      $('#cv_label').innerText = '';
      screen_switch();
    }
  }
}

function screen_switch() {
  if (state === 'main_screen') {
    state = 'object_add';
  } else if (state === 'object_add' && active === $('#modifiers_add')) {
    state = 'modifier_construct';
  } else if (state === 'object_add' && active === $('#categories_add')) {
    state = 'category_construct';
  } else if (state === 'modifier_construct' || state === 'category_construct') {
    state = 'main_screen';
  }
  transition();
}

function transition() {
  if (state === 'object_add') {
    transform_class('.main_container', 'scale(0,0)');
    transform_class('.options_container', 'scale(1,1)');
    $('#big_btn').innerText = '[...]';
  } else if (state === 'modifier_construct') {
    transform_class('.options_container', 'scale(0,0)');
    $('.modifier_constructor').style.transform = 'scale(1, 1)';
    $('#big_btn').innerText = '✓';
  } else if (state === 'category_construct') {
    transform_class('.options_container', 'scale(0,0)');
    $('.category_constructor').style.transform = 'scale(1, 1)';
    $('#big_btn').innerText = '✓';
  } else if (state === 'main_screen') {
    transform_class('.main_container', 'scale(1, 1)');
    $('.modifier_constructor').style.transform = 'scale(0,0)';
    $('.category_constructor').style.transform = 'scale(0,0)';
    $('#big_btn').innerText = '+';
  }
}

function set_active(element) {
  if (active === element) {
    return;
  } else {
    active = element;
    active.style.backgroundColor = 'beige';
  }
}

function set_inactive(element) {
  if (inactive === element) {
    return;
  } else {
    inactive = element;
    inactive.style.backgroundColor = 'rgb(187, 255, 0)';
  }
}

$('#modifiers_add').addEventListener('click', (e) => {
  set_active($('#modifiers_add'));
  set_inactive($('#categories_add'));
  $('#big_btn').innerText = '[...]>';
});

$('#categories_add').addEventListener('click', (e) => {
  set_active($('#categories_add'));
  set_inactive($('#modifiers_add'));
  $('#big_btn').innerText = '>[...]';
});

$('#big_btn').addEventListener('click', (e) => {
  bigbutton();
});

$('.cat_num_btn').forEach((object) => {
  object.addEventListener('click', (e) => {
    button_logic(
      object.getAttribute('data-value'),
      $('#co_label'),
      $('#cv_label')
    );
  });
});

$('.mod_num_btn').forEach((object) => {
  object.addEventListener('click', (e) => {
    button_logic(
      object.getAttribute('data-value'),
      $('#mo_label'),
      $('#mv_label')
    );
  });
});
