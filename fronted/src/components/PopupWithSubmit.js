import React from 'react';


function PopupWithSubmit(props) {

  React.useEffect(() => {
    props.closePopupEsp(props.isOpen);
    return (
      document.removeEventListener('keydown', props.closePopupEsp(props.isOpen))
    )
  }, [props.isOpen]);

  function handleSubmit (e) {
    e.preventDefault();
    props.handleDeleteClick(props.dataCard._id)
  }

  return(
    <div className={`popup popup_delete-card ${ props.isOpen ? "popup_opened" : "" }`}>
      <form className="popup__form popup__form-card" name="form" onSubmit={handleSubmit}>
        <h2 className="popup__title">Вы уверены?</h2>
        <button type="button" className="popup__buttom-close" onClick={props.onClose}></button>
        <button type="submit" className="popup__buttom">Да</button>
      </form>
    </div>
  )
}

export default PopupWithSubmit;
