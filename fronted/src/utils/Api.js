export class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _getHeaders() {
    const jwt = localStorage.getItem("jwt");
    return {
      "Authorization" : jwt,
      'Content-Type' : 'application/json'
    }
  }

  changeLikeCardStatus(id, isLiked) {
    if(isLiked === true) {
      return fetch(`${this._url}/cards/${id}/likes`, {
        method: 'DELETE',
        headers: this._getHeaders()
      })
        .then((res) => {
          return this._chekRes(res)
        });
    } else {
      return fetch(`${this._url}/cards/${id}/likes`, {
        method: 'PUT',
        headers: this._getHeaders()
      })
        .then((res) => {
          return this._chekRes(res)
        });
    }
  }

  _chekRes(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(console.log(`Ошибка: ${res.status}`))
  }

  getAllCards() {
   return fetch(`${this._url}/cards`, {
    method: "GET",
    headers: this._getHeaders()
  })
    .then(this._chekRes)
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: this._getHeaders()
    })
      .then(this._chekRes)
  }

  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  uploadAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  postNewCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(data)
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._getHeaders()
    })
      .then((res) => {
        return this._chekRes(res)
      })
  }
  }

  const api = new Api({
    url: "https://api.glmesto.nomoredomains.nomoredomains.work",
  })

  export {api}
