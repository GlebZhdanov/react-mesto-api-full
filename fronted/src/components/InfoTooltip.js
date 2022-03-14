import React from "react";
import imageFalse from "../images/falseImage.svg"
import imageTrue from "../images/trueImage.svg";

function InfoTooltip(props) {
  return (
    <div className={`popup ${ props.isOpen ? "popup_opened" : "" }`}>
      <div className="popup__form">
        <img src={props.verification ? imageTrue : imageFalse} className="popup__image-true"/>
        <p className="popup__title popup__title_true">{props.verification ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так!Попробуйте ещё раз.'}</p>
        <button onClick={props.onClose} type="button" className="popup__buttom-close" />
      </div>
    </div>
  )}

export default InfoTooltip;