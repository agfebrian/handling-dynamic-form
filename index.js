const baseUrlApi = "https://apicrm.foodizz.id/v1";
let urlApiCity = "";
let urlApiDistrict = "";
let urlApiVillage = "";

const body = document.querySelector("body");
const form = document.createElement("form");
const script = document.querySelector("script[data-id]");
const target = document.querySelector("script[data-target]");
const uuid = script.dataset.id;

form.setAttribute("class", "dynamic--form-fdz");
if (target) {
  const valueTarget = target.dataset.target;
  const targetElementId = document.querySelector(`#${valueTarget}`);
  targetElementId.appendChild(form);
} else {
  body.appendChild(form);
}

fetch(`${baseUrlApi}/dynamic_form/detail/${uuid}`)
  .then((res) => res.json())
  .then(async (res) => {
    const { status_code, payload } = res;

    if (status_code == 200) {
      let element;
      let result = "";
      const inputs = payload.inputs;

      for (let index = 0; index < inputs.length; index++) {
        const item = inputs[index];

        if (item.type.code.includes("select")) {
          element = await createSelect({
            label: item.label,
            field: item.field,
            require: item.require,
            value: item.value,
            code: item.type.code,
            isApi: item.type.is_api,
            api: item.type.api,
          });
          result = result + `${element}`;
        } else {
          element = createInput(
            item.label,
            item.field,
            item.type.code,
            item.require,
            item.value
          );
          result = result + `${element}`;
        }
      }

      const button = document.createElement("button");
      const textButton = document.createTextNode("Simpan");

      form.innerHTML = result;
      button.setAttribute("type", "submit");
      button.setAttribute("class", "btn-submit");
      button.appendChild(textButton);
      form.appendChild(button);

      const selectProvince = document.querySelector("[name=province_id]");
      const selectCity = document.querySelector("[name=city_id]");
      const selectDistrict = document.querySelector("[name=district_id]");
      const selectVillage = document.querySelector("[name=village_id]");

      selectProvince.addEventListener("change", (event) => {
        const select = event.target;
        dynamicOptions(urlApiCity, select.value, selectCity, "Pilih Kota");
      });

      selectCity.addEventListener("change", (event) => {
        const select = event.target;
        dynamicOptions(
          urlApiDistrict,
          select.value,
          selectDistrict,
          "Pilih Kecamatan"
        );
      });

      selectDistrict.addEventListener("change", (event) => {
        const select = event.target;
        dynamicOptions(
          urlApiVillage,
          select.value,
          selectVillage,
          "Pilih Kelurahan"
        );
      });
    }
  });

const createInput = (label, field, type, require, value) => {
  let input = "";

  switch (type) {
    case "input_text":
      input = `
      <label class="label">${label}</label>
      <input class='input' type='text' name='${field}' ${
        require ? "required" : ""
      } />
      `;
      break;
    case "input_email":
      input = `
      <label class="label">${label}</label>
      <input class='input' type='email' name='${field}' ${
        require ? "required" : ""
      } />
      `;
      break;
    case "radio":
      let radio = "";
      value.forEach((item) => {
        radio =
          radio +
          `
      <input class="check" type="radio" name='${field}' value="${item}" id="${label}" ${
            require ? "required" : ""
          } />
      <label class="check-label" for="${label}">${item}</label>
      `;
      });

      input = radio;
      break;
    case "checkbox":
      input = `
      <input class="check" type="checkbox" id="${label}" name="${field}" ${
        require ? "required" : ""
      } />
      <label class="check-label" for="${label}">${label}</label>
      `;
      break;
    case "textarea":
      input = `
      <label class="label" for="${label}">${label}</label>
      <textarea class="input" id="${label}" name="${field}" ${
        require ? "required" : ""
      }></textarea>
      `;
      break;
    case "input_date":
      input = `
      <label class="label" for="${label}">${label}</label>
      <input class="input" type="date" id="${label}" name="${field}" ${
        require ? "required" : ""
      } />
      `;
      break;
    case "input_datetime":
      input = `
      <label class="label" for="${label}">${label}</label>
      <input class="input" type="datetime" id="${label}" name="${field}" ${
        require ? "required" : ""
      } />
      `;
      break;
    case "input_time":
      input = `
      <label class="label" for="${label}">${label}</label>
      <input class="input" type="time" id="${label}" name="${field}" ${
        require ? "required" : ""
      } />
      `;
      break;
    default:
      break;
  }

  return `<div class="item">${input}</div>`;
};

const createSelect = async ({
  label,
  field,
  require,
  value,
  code,
  isApi,
  api,
}) => {
  const labelSelect = `<label for="${label}" class="label">${label}</label>`;
  const select = document.createElement("select");

  select.setAttribute("id", label);
  select.setAttribute("name", field);
  select.setAttribute("class", "select");
  if (require) {
    select.setAttribute("required", "required");
  }

  switch (code) {
    case "select_province":
      const res = await fetch(api).then((res) => res.json());
      const { status_code, payload } = res;

      if (status_code == 200) {
        const option = '<option value="">Pilih Provinsi</option>';
        select.innerHTML = option;

        payload.forEach((item) => {
          const option = document.createElement("option");
          const text = document.createTextNode(item.name);
          option.setAttribute("value", item.id.toString());
          option.appendChild(text);
          select.appendChild(option);
        });
      }
      break;
    case "select_city":
      select.innerHTML = '<option value="">Pilih Kota</option>';
      urlApiCity = api;
      break;
    case "select_district":
      select.innerHTML = '<option value="">Pilih Kecamatan</option>';
      urlApiDistrict = api;
      break;
    case "select_village":
      select.innerHTML = '<option value="">Pilih Kelurahan</option>';
      urlApiVillage = api;
      break;

    default:
      const array = value.split(",");
      array.forEach((item) => {
        const option = document.createElement("option");
        const text = document.createTextNode(item);
        option.setAttribute("value", item);
        option.appendChild(text);
        select.appendChild(option);
      });
      break;
  }

  return `<div class="item">${labelSelect} ${select.outerHTML}</div>`;
};

const dynamicOptions = async (urlAPI, value, target, placeholder) => {
  const res = await fetch(`${urlAPI}${value}`).then((res) => res.json());
  const { status_code, payload } = res;

  if (status_code == 200) {
    let options = "";
    options += `<option value="">${placeholder}</option>`;

    payload.forEach((item) => {
      options += `<option value="${item.id}">${item.name}</option>`;
    });

    target.innerHTML = options;
  }
};

const submitForm = (event) => {
  event.preventDefault();
  const payload = [];
  const button = document.querySelector(
    ".dynamic--form-fdz > button[type=submit]"
  );

  button.setAttribute("disabled", "disabled");

  for (let index = 0; index < form.length; index++) {
    const el = form[index];
    if (el.value) {
      payload.push({ field: el.getAttribute("name"), value: el.value });
    }
  }

  fetch(`${baseUrlApi}/dynamic_form/customer/add/${uuid}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      const {
        status_code,
        payload: { redirect_url },
        additional_info,
      } = res;
      if (status_code == 201) {
        alert("Terima kasih telah mengisi form");
        form.reset();
        window.location = redirect_url;
      } else {
        alert(additional_info);
      }
    })
    .finally(() => {
      button.removeAttribute("disabled");
    });
};

form.addEventListener("submit", submitForm);

// Get HTML head element
var head = document.getElementsByTagName("HEAD")[0];
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://unpkg.com/handling-dynamic-form@2.11.0/index.css";
head.appendChild(link);
