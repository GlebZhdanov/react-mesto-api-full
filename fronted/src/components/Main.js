import React from 'react';
import Card from './Card';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__image" style={{backgroundImage: `url(${currentUser.avatar})`}}>
          <button onClick={props.handleEditAvatarClick} type="button" className="profile__edit-avatar"></button>
        </div>
        <div className="profile__info" >
          <div className="profile__info-blocks">
            <h1 className="profile__title">
            {currentUser.name}
            </h1>
            <button onClick={props.handleEditProfileClick} type="button" className="profile__edit-button" />
          </div>
          <p className="profile__subtitle">
            {currentUser.about}
          </p>
        </div>
        <button onClick={props.handleAddPlaceClick} type="button" className="profile__button" />
      </section>
      <section className="elements">
      {props.cards.map((data,_id) =>(
        <Card
          key={_id}
          data={data}
          handlePopupImage={props.handlePopupImage}
          onCardClick={props.onCardClick}
          handlePopupWithSubmit={props.handlePopupWithSubmit}
        ></Card>
      ))}
      </section>
    </main>
  )
}

export default Main;
