import { API_BASE_URL } from "../app-config";
const ACCESS_TOKEN = "ACCESS_TOKEN";

export function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken && accessToken != null) {
    headers.append("Authorization", "Bearer " + accessToken); //Bearer 뒤에 공백 있어야함..
  }
  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };
  if (request) {
    // GET method
    options.body = JSON.stringify(request);
  }
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          //response가 ok면 정상적인 응답 아니면 에러
          return Promise.reject(json);
        }
        return json;
      }),
    )
    .catch((error) => {
      console.log(error.status);
      if (error.status === 403) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    });
}

export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO).then((response) => {
    if (response.token) {
      localStorage.setItem(ACCESS_TOKEN, response.token);
      window.location.href = "/";
    }
  });
}

export function signout() {
  localStorage.setItem(ACCESS_TOKEN, null);
  window.location.href = "/login";
}

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO);
}
