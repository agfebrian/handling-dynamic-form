const form = document.querySelector(".dynamic--form-fdz");
const button = document.querySelector(
  ".dynamic--form-fdz > button[type=submit]"
);
const baseUrlApi = "https://apicrm.foodizz.id";

const submitForm = (event) => {
  event.preventDefault();
  const payload = [];

  button.setAttribute("disabled", "disabled");

  for (let index = 0; index < form.length; index++) {
    const el = form[index];
    if (el.value) {
      payload.push({ field: el.getAttribute("name"), value: el.value });
    }
  }

  fetch(
    `${baseUrlApi}/dynamic_form/customer/add/1219839e-963b-11ed-8b58-0242ac110002`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      const { status_code, additional_info } = res;
      if (status_code == 201) {
        alert("Success create customer");
        form.reset();
      } else {
        alert(additional_info);
      }
    })
    .finally(() => {
      button.removeAttribute("disabled");
    });
};

const selectProvince = document.querySelector("[name=province_id]");
const selectCity = document.querySelector("[name=city_id]");
const selectDistrict = document.querySelector("[name=district_id]");
const selectVillage = document.querySelector("[name=village_id]");

selectProvince.addEventListener("change", (event) => {
  const select = event.target;
  const urlAPI = `${baseUrlApi}/dynamic_form/location/city/list/`;
  dynamicOptions(urlAPI, select.value, selectCity, "Pilih Kota");
});

selectCity.addEventListener("change", (event) => {
  const select = event.target;
  const urlAPI = `${baseUrlApi}/dynamic_form/location/district/list/`;
  dynamicOptions(urlAPI, select.value, selectDistrict, "Pilih Kecamatan");
});

selectDistrict.addEventListener("change", (event) => {
  const select = event.target;
  const urlAPI = `${baseUrlApi}/dynamic_form/location/village/list/`;
  dynamicOptions(urlAPI, select.value, selectVillage, "Pilih Kelurahan");
});

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
