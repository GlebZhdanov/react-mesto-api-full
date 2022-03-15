import { Routes, Route, useNavigate } from 'react-router-dom'
import React from "react";
import {api}  from '../utils/Api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithSubmit from "./PopupWithSubmit";
import Register from "./Register";
import Login from "./Login";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import {auth} from "../utils/Auth";

function App() {
  const[isEditProfilePopupOpen, switchIsEditProfilePopupOpen] = React.useState(false);
  const[isAddPlacePopupOpen, switchIsAddPlacePopupOpen] = React.useState(false);
  const[isEditAvatarPopupOpen, switchIsEditAvatarPopupOpen] = React.useState(false);
  const[isPopupWithSubmit, switchIsPopupWithSubmit] = React.useState(false);
  const[isInfoTooltipPopupOpen, switchIsInfoTooltipPopupOpen] = React.useState(false);

  const[selectedCard, switchSelectCard] = React.useState({open: false, dataCard: {}});
  const[currentUser, setCurrentUser] = React.useState({});
  const[cards, setCards] = React.useState([]);
  const[dataCardDelete, setDataCardDelete] = React.useState({});
  const[userEmail, setUserEmail] = React.useState('');
  const[verification, setVerification] = React.useState(false);
  const[loginVerification, setLoginVerification] = React.useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    if(loginVerification === true) {
      navigate('/');
      Promise.all([api.getUserInfo(), api.getAllCards()])
      .then(([dataInfoUser, dataInfoCard]) => {
        setCurrentUser(dataInfoUser);
        setCards(dataInfoCard);
      })
      .catch((err) => console.log("ошибка получения данных: " + err))
    }

  }, [loginVerification]);

  React.useEffect(() => {
    handleChekToken()  //
  },[]);

  function handleCardLike(data) {
    const isLiked = data.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(data._id, isLiked)
    .then((newCard) => {
      setCards((state) =>
        state.map((card) => (card._id === data._id ? newCard : card)));
    })
    .catch((err) => console.log("ошибка лайка: " + err))
  }

  function handlePatchUserInfo(data) {
    api.patchUserInfo(data)
      .then((data) => {
        setCurrentUser(data)
        closePopup()
      })
      .catch((err) => console.log("ошибка данных пользователя: " + err))
  }

  function handleCardDelete(id) {
    api.deleteCard(id)
      .then(setCards((cards) => cards.filter((card) => id !== card._id),
      closePopup()))
      .catch((err) => console.log("ошибка удаленения карточки: " + err))
  }

  function handleUpdateAvatar(data) {
    api.uploadAvatar(data)
      .then((newData) => {
        setCurrentUser(newData)
        closePopup()
      })
      .catch((err) => console.log("ошибка аватара: " + err))
  }

  function handleAddCard(data) {
    api.postNewCard(data)
      .then((newData) => {
        setCards([newData, ...cards]);
        closePopup()
      })
      .catch((err) => console.log("ошибка карточки: " + err))
  }

  function handleRegister(password, email) {
    auth.registration({
      password: password,
      email: email
    })
      .then(() => {
          navigate('/sign-in');
          setVerification(true);
      })
      .catch((err) => {
        setVerification(false);
        console.log("ошибка регистрации пользователя: " + err)})
      .finally(() => {
        switchInfoTooltipPopup();
      })
  }

  function handleLogin(password, email) {
    auth.authorization({
      password: password,
      email: email
    })
      .then((data) => {
        if (data.message) {
          localStorage.setItem('jwt', data.message);
          setLoginVerification(true);
        } else {
          setVerification(false);
          switchInfoTooltipPopup();
        }
      })
      .catch((err) => {
        setVerification(false);
        switchInfoTooltipPopup();
        console.log("ошибка авторизации пользователя: " + err)})
  }

  function handleChekToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.chekToken()
        .then((res) => {
          if (res) {
            setLoginVerification(true)
            setUserEmail(res.email);
          } else {
            localStorage.removeItem('jwt');
          }
        })
        .catch((err) => console.log("ошибка проверки токена: " + err))
    }
  }

  function switchProfilePopup () {
    switchIsEditProfilePopupOpen(true);
  }

  function switchPlacePopup () {
    switchIsAddPlacePopupOpen(true);
  }

  function switchAvatarPopup () {
    switchIsEditAvatarPopupOpen(true);
  }

  function switchPopupWithSubmit (data) {
    switchIsPopupWithSubmit(true);
    setDataCardDelete(data)
  }

  function switchImagePopup(data){
    switchSelectCard({open: true, dataCard: data});
  }

  function switchInfoTooltipPopup() {
    switchIsInfoTooltipPopupOpen(true);
  }

  const closePopup = () => {
    switchIsEditProfilePopupOpen(false)
    switchIsAddPlacePopupOpen(false)
    switchIsEditAvatarPopupOpen(false)
    switchIsPopupWithSubmit(false)
    switchIsInfoTooltipPopupOpen(false)
    switchSelectCard({open: false, dataCard: {}});
  }

  function clickPopupEsp(e) {
    if(e.keyCode === 27) {
      closePopup();
    }
  }

  function closePopupEsp(popup) {
    if(popup === true) {
      document.addEventListener('keydown', clickPopupEsp)
    }
  }

  function logoutLogin() {
    setLoginVerification(false);
    navigate('/sign-in');
    localStorage.removeItem('jwt');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <InfoTooltip
        verification={verification}
        isOpen={isInfoTooltipPopupOpen}
        onClose={closePopup}
      />
      <Routes>
        <Route path="/sign-up" element={
          <>
            <Header title="Войти" link="/sign-in"/>
            <Register handleRegister={handleRegister} />
          </>}
        />
        <Route path="/sign-in" element={
          <>
            <Header title="Регистрация" link="/sign-up"/>
            <Login handleLogin={handleLogin} setUserEmail={setUserEmail}/>
          </>}
        />
        <Route path="/" element={
            <div className="page">
              <ProtectedRoute loginVerification={loginVerification}>
                <Header link="/sign-in" title="Выйти" userEmail={userEmail} logoutLogin={logoutLogin}/>
                <Main
                  handleEditProfileClick={switchProfilePopup}
                  handleEditAvatarClick={switchAvatarPopup}
                  handleAddPlaceClick={switchPlacePopup}
                  handlePopupImage={switchImagePopup}
                  handlePopupWithSubmit={switchPopupWithSubmit}
                  cards={cards}
                  onCardClick={handleCardLike}>
                </Main>
                <Footer/>
              </ProtectedRoute>
              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closePopup}
                onUpdateUser={handlePatchUserInfo}
                closePopupEsp={closePopupEsp}>
              </EditProfilePopup>
              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closePopup}
                onUpdateAvatar={handleUpdateAvatar}
                closePopupEsp={closePopupEsp}>
              </EditAvatarPopup>
              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closePopup}
                handleAddCard={handleAddCard}
                closePopupEsp={closePopupEsp}>
              </AddPlacePopup>
              <ImagePopup
                data={selectedCard}
                onClose={closePopup}
                closePopupEsp={closePopupEsp}/>
              <PopupWithSubmit
                isOpen={isPopupWithSubmit}
                onClose={closePopup}
                handleDeleteClick={handleCardDelete}
                dataCard={dataCardDelete}
                closePopupEsp={closePopupEsp}>
              </PopupWithSubmit>
            </div>
        }/>
      </Routes>
    </CurrentUserContext.Provider>
  );
}

export default App;
