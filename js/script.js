var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var siteNameError = document.getElementById("siteNameError");
var siteURLError = document.getElementById("siteURLError");
var submitBtn = document.getElementById("submitBtn");
var updateBtn = document.getElementById("updateBtn");
var tableData = document.getElementById("tableData");
var searchTextBox = document.getElementById("searchTextBox");
var siteList = [];

if (localStorage.getItem("siteList") !== null) {
  siteList = JSON.parse(localStorage.getItem("siteList"));
  display();
}

submitBtn.onclick = function () {
  addOrUpdateSite();
};

siteName.onkeyup = function () {
  isSiteNameValid();
};

function isSiteNameValid() {
  var regex = /^(\w)[A-Za-z0-9 ]{3,}$/;
  return isValid(
    regex,
    siteName,
    siteNameError,
    "please enter at least 3 characters or numbers or underscore "
  );
}

siteUrl.onkeyup = function () {
  isSiteURLValid();
};

function isSiteURLValid() {
  var regex = /^(http:\/\/)?(www.)(\w)[A-Za-z0-9 ]+(.)\w*$/;
  return isValid(
    regex,
    siteUrl,
    siteURLError,
    "please enter valid url starts with http://www. or www."
  );
}

function isValid(regex, textbox, errorObject, errorMessage) {
  var result = regex.test(textbox.value);
  if (result == false) {
    errorObject.innerHTML = errorMessage;
    textbox.classList.add("is-invalid");
    textbox.classList.remove("is-valid");
  } else {
    errorObject.innerHTML = "";
    textbox.classList.add("is-valid");
    textbox.classList.remove("is-invalid");
  }
  return result;
}

function addOrUpdateSite(index) {
  if (isSiteNameValid() && isSiteURLValid()) {
    var site = {
      name: siteName.value,
      url: siteUrl.value,
    };
    console.log("site ", site);

    if (index >= 0) {
      siteList.splice(index, 1, site);
    } else {
      siteList.push(site);
    }

    console.log("site list ", siteList);
    localStorage.setItem("siteList", JSON.stringify(siteList));
    fireSuccessAddSweetAlert();
    clearForm();
    display();
  } else {
    fireErrorSweetAlert();
  }
}

function updateSite(index) {
  siteName.value = siteList[index].name;
  siteUrl.value = siteList[index].url;
  updateBtn.classList.remove("d-none");
  submitBtn.classList.add("d-none");

  updateBtn.onclick = function () {
    addOrUpdateSite(index);
  };
}

function display(searchValue) {
  var box = "";
  var isSearchBy = typeof searchValue !== "undefined" && searchValue.length > 0;

  for (var i = 0; i < siteList.length; i++) {
    var name = isSearchBy
      ? siteList[i].name.replace(
          searchValue,
          `<span style="color: #d28006;">${searchValue}</span>`
        )
      : siteList[i].name;

    if (
      typeof searchValue == "undefined" ||
      searchValue.length == 0 ||
      (typeof searchValue !== "undefined" &&
        siteList[i].name.includes(searchValue))
    ) {
      box += `
          <tr>
          <td>${i + 1}</td>
          <td>${name}</td>
          <td>
            <a href='${
              siteList[i].url
            }' class="btn btn-success" target="_blank">
              <i class="fa-solid fa-eye"></i> Visit
            </a>
          </td>
          
          <td>
            <button class="btn btn-primary" onclick='updateSite(${i})'>
            <i class="fa-solid fa-pen-to-square"></i> Update
            </button>
          </td>
          <td>
            <button class="btn btn-danger" onclick='deleteSite(${i})'>
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </td>
        </tr>
          `;
    }
  }
  tableData.innerHTML = box;
}

searchTextBox.onkeyup = function () {
  searchProcess();
};
function searchProcess() {
  var searchValue = searchTextBox.value;
  display(searchValue);
}

function deleteSite(index) {
  siteList.splice(index, 1);
  display();
}

function clearForm() {
  siteName.value = "";
  siteUrl.value = "";
  siteName.classList.remove("is-valid");
  siteUrl.classList.remove("is-valid");
}

function fireErrorSweetAlert() {
  Swal.fire({
    title: "",
    html: `
          <div class="text-start fs-6">
          Site Name or Url is not valid, Please follow the rules below :
      
          <div><i class="fa-regular fa-circle-right text-danger mt-3 me-2"></i>Site name must contain at least 3 characters</div>
          <div><i class="fa-regular fa-circle-right text-danger me-2"></i>Site URL must be a valid one</div>
          </div>
          `,
    showCloseButton: true,
  });
}

function fireSuccessAddSweetAlert() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Site has been saved",
    showConfirmButton: false,
    timer: 1500,
  });
}
