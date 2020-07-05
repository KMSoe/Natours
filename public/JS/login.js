const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class='alert alert--${type}'>${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 3000);
};
const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios.post(`api/v1/users/signin`, {
      email,
      password,
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged In successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".logoutbtn");
const updateBtn = document.querySelector(".form-user-data");
const updatePasswordBtn = document.querySelector(".form-user-settings");
const bookingBtn = document.getElementById("book-tour");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const logout = async () => {
  try {
    const res = await axios.get(`/logout`);

    if (res.data.status === "success") {
      // showAlert('success',"Logged out successfully");
      // location.reload(true);
      location.assign("/");
    }
  } catch (error) {
    console.log(error.response.data);
    showAlert("error", "Error in logout");
  }
};
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}
const updateMe = async (formData) => {
  try {
    console.log(photo);
    const res = await axios.patch(`api/v1/users/updateMe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Successfully updated");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
if (updateBtn) {
  updateBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("photo", document.getElementById("photo").files[0]);
    updateMe(formData);
  });
}
const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios.patch(`api/v1/users/updateMypassword`, {
      passwordCurrent,
      password,
      passwordConfirm,
    });
    if (res.data.status === "success") {
      showAlert("success", "Successfully updated");
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
if (updatePasswordBtn) {
  updatePasswordBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    updatePassword(passwordCurrent, password, passwordConfirm);
  });
}
var stripe = Stripe(
  "pk_test_51GzPTtJpIWDK3qxIH8LPhjgLb56L4frLWDy3zF1HhxzMPmzmPfX3ynYJqXsS33AKJFvErvEVNXCCWZWnlunHn61q000O0A80Jp"
);
const bookTour = async (tourId) => {
  try {
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
if (bookingBtn) {
  bookingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.target.textContent = 'Processiong...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  })
}
(function () {
  var cors_api_host = "cors-anywhere.herokuapp.com";
  var cors_api_url = "https://" + cors_api_host + "/";
  var slice = [].slice;
  var origin = window.location.protocol + "//" + window.location.host;
  var open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    var args = slice.call(arguments);
    var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
    if (
      targetOrigin &&
      targetOrigin[0].toLowerCase() !== origin &&
      targetOrigin[1] !== cors_api_host
    ) {
      args[1] = cors_api_url + args[1];
    }
    return open.apply(this, args);
  };
})();
