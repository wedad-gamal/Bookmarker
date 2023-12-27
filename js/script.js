var siteName = document.getElementById("siteName");
var siteUrl = document.getElementById("siteUrl");
var siteNameError = document.getElementById("siteNameError");
var siteURLError = document.getElementById("siteURLError");
var submitBtn = document.getElementById("submitBtn");
var tableData = document.getElementById('tableData');

var siteList = [];

if(siteList.length == 0){
    var list = localStorage.getItem('siteList');
    siteList = JSON.parse(list);
    display();
}

submitBtn.onclick = function () {
  addSite();
};

siteName.onkeyup = function () {
  isSiteNameValid();
};
function isSiteNameValid() {
  var regex = /^\w{3,}$/;
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
  var regex =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
  return isValid(
    regex,
    siteUrl,
    siteURLError,
    "please enter valid url starts with http://www."
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

function addSite() {

  if (isSiteNameValid() && isSiteURLValid() ) {  
    var site = {
        name: siteName.value,
        url: siteUrl.value,
      };
      console.log("site ", site);
    
      siteList.push(site);
      console.log("site list ", siteList);
      localStorage.setItem("siteList", JSON.stringify(siteList));            
      fireSuccessAddSweetAlert();
      clearForm();
      display();
  }else{    
    console.log( `name: ${siteName.value},
        url: ${siteUrl.value}`);
    console.log('is not valid data');  
    fireErrorSweetAlert();
    return;
  }
}


function display(){
    var box ='';
    for(var i=0; i< siteList.length; i++){
        box +=`
        <tr>
        <td>${i+1}</td>
        <td>${siteList[i].name}</td>
        <td>
          <a href='${siteList[i].url}' class="btn btn-success" target="_blank">
            <i class="fa-solid fa-eye"></i> Visit
          </a>
        </td>
        <td>
          <button class="btn btn-danger" onclick='deleteSite(${i})'>
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </td>
      </tr>
        `;
    }
    tableData.innerHTML = box;
}


function deleteSite(index){
    siteList.splice(index, 1);
    display();
}

function clearForm(){
    siteName.value='';
    siteUrl.value='';    
    siteName.classList.remove("is-valid");       
    siteUrl.classList.remove("is-valid");   
}

function fireErrorSweetAlert(){
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

function fireSuccessAddSweetAlert(){
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Site has been saved",
        showConfirmButton: false,
        timer: 1500
      });
}