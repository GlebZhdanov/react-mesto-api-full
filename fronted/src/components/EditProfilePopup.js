import React from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  function handleChangeName(e) {
    setName(e.target.value)
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name: name,
      about: description})
  }

  React.useEffect(() => {
    if(props.isOpen) {
    setName(currentUser.name);
    setDescription(currentUser.about);
    }}, [currentUser, props.isOpen]);

  return (
    <PopupWithForm closePopupEsp={props.closePopupEsp} name='profile' title='Редактировать профиль' nameForm='form-profile' onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} buttonText={"Сохранить"} >
      <input id="name" className="popup__item popup__item_title_active" type="text" name="name" minLength={2} maxLength={40} required onChange={handleChangeName} value={name || ''}/>
      <span id="name-error" className="popup__text-error" />
      <input id="about" className="popup__item popup__item_subtitle_active" type="text" name="about" minLength={2} maxLength={200} required onChange={handleChangeDescription} value={description || ''}/>
      <span id="about-error" className="popup__text-error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
