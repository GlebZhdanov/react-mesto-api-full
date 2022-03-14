import React from "react";

function ImagePopup(props) {

  React.useEffect(() => {
    props.closePopupEsp(props.data.open);
    return (
      document.removeEventListener('keydown', props.closePopupEsp(props.data.open))
    )
  }, [props.data.open]);

  return (
    <>
      <div className={`popup popup_image-card ${ props.data.open ? "popup_opened" : "" }`} onClick={props.onClose}>
        <div className="popup__content" onClick={(e) => {e.stopPropagation()}}>
        <img src={props.data.dataCard.link} className="popup__image" alt={props.data.dataCard.name} />
          <h3 className="popup__place">{props.data.dataCard.name}</h3>
          <button onClick={props.onClose} type="button" className="popup__buttom-close"></button>
        </div>
      </div>
    </>
     )
}
export default ImagePopup
