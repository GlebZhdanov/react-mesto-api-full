import React from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const [nameCard, setNameCard] = React.useState('');
  const [cardLink, setCardLink] = React.useState('');

  function handleChangeNameCard(e) {
    setNameCard(e.target.value)
  }

  function handleChangeCardLink(e) {
    setCardLink(e.target.value)
  }

  function handleAddPlaceSubmit(e) {
    e.preventDefault();
    props.handleAddCard({
      name: nameCard,
      link: cardLink})
  }

  React.useEffect(() => {
      setNameCard('');
      setCardLink('');
    }, [props.isOpen]);

  return(
    <PopupWithForm closePopupEsp={props.closePopupEsp} name='card' title='Новое место' nameForm='form-card' isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleAddPlaceSubmit} buttonText="Создать">
      <input id="name-card" name="name" className="popup__item popup__item_title_card" value={nameCard} type="text" placeholder="Название" minLength={2} maxLength={30} onChange={handleChangeNameCard} required />
      <span id="name-card-error" className="popup__text-error" />
      <input name="link" id="url-card" className="popup__item popup__item_url_card" value={cardLink} type="url" placeholder="Ссылка на картинку" onChange={handleChangeCardLink} required />
      <span id="url-card-error" className="popup__text-error" />
    </PopupWithForm>
  )
}

export default AddPlacePopup;
