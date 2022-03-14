import React from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const inputAvatar = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: inputAvatar.current.value
    });
  }

  return (
    <PopupWithForm closePopupEsp={props.closePopupEsp} name='avatar' title='Обновить аватар' nameForm='form-avatar' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} buttonText="Сохранить">
      <input name="avatar" id="url-avatar" className="popup__item popup__item_url_avatar" type="url" placeholder="Ссылка на аватар" required  ref={inputAvatar}/>
      <span id="url-avatar-error" className="popup__text-error" />
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
