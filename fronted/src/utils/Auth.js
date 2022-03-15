export class Auth {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _chekRes(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(console.log(`Ошибка: ${res.status}`))
  }

  registration({password, email}) {
    return fetch(this._url + "/signup", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password,
        email
      })
    })
      .then(this._chekRes)
  }

  authorization({password, email}) {
    return fetch(this._url + "/signin", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        password,
        email
      })
    })
      .then(this._chekRes)
  }

  chekToken() {
    return fetch(this._url + "/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('jwt'),
      },
    })
      .then(this._chekRes)
  }
}

const auth = new Auth({
  url: "https://api.glmesto.nomoredomains.nomoredomains.work",
  headers: {
    "Content-Type": "application/json"
  }
})

export {auth}
