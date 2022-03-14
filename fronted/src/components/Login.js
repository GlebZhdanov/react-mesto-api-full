import React from "react";

function Login (props) {
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');


  function handleEmail(e) {
    setEmail(e.target.value)
  }

  function handlePassword(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleLogin(password, email);
    props.setUserEmail(email)
  }

  return (
    <div className="container">
      <h2 className="container__header">
        Вход
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <input className="form__input"  type="email" placeholder="Email" required onChange={handleEmail}/>
        <input className="form__input"  type="password" placeholder="Пароль" required onChange={handlePassword}/>
        <button className="form__submit-button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};
export default Login;