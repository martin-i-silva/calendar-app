import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import moment from "moment";
import DateTimePicker from "react-datetime-picker";
import Swal from "sweetalert2";
import { startCloseModal } from "../../actions/ui";
import { clearActiveEvent, eventStartAddNew, eventStartUpdated } from "../../actions/events";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const now = moment().minutes(0).seconds(0).add(1, "hours");
const nowEnd = now.clone().add(1, "hours");
const initialEvent = {    
title: "",
notes: "",
start: now.toDate(),
end: nowEnd.toDate(),
}

export const CalendarModal = () => {
  const [dateStart, setDateStart] = useState(now.toDate());
  const [dateEnd, setDateEnd] = useState(nowEnd.toDate());
  const [titleValid, setTitleValid] = useState(true);
  const {modalOpen} = useSelector( state => state.ui );
  const {activeEvent} = useSelector( state => state.calendar );
  const dispatch = useDispatch();
  
  const [formValues, setFormValues] = useState(initialEvent);

  const { title, notes, start, end } = formValues;

useEffect(() => {
  if(activeEvent){
    setFormValues(activeEvent)
  } else {
    setFormValues(initialEvent)
  }
}, [activeEvent, setFormValues])

  const handleInputChange = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };
  const closeModal = () => {
    dispatch(startCloseModal())
    dispatch(clearActiveEvent())
    setFormValues(initialEvent)
  };
  const handleStartDateChange = (e) => {
    setDateStart(e);
    setFormValues({
      ...formValues,
      start: e,
    });
  };

  const handleEndtDateChange = (e) => {
    setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const momentStart = moment(start);
    const momentEnd = moment(end);

    if (momentStart.isSameOrAfter(momentEnd)) {
      //console.log('Fecha 2 debe de ser mayor');
      Swal.fire(
        "Error",
        "La fecha de finalización debe ser mayor a la de inicio",
        "error"
      );
      return;
    }
    if(title.trim().length <= 2){
        setTitleValid(false)
        Swal.fire(
            "Error",
            "El titulo debe contener mas de dos digitos",
            "error"
          );
          return;
    } 
    
    //TO-DO: grabar en base de datos
    if (activeEvent){
      dispatch(eventStartUpdated(formValues))
    } else {
      dispatch(eventStartAddNew(formValues))
    }

    setTitleValid(true)
    closeModal()
  };
  return (
    <Modal
      isOpen={modalOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h1> {(activeEvent)? 'Editar evento' : 'Nuevo evento' } </h1>
      <hr />
      <form onSubmit={handleSubmitForm} className="container">
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={dateStart}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndtDateChange}
            value={dateEnd}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid' }`} 
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
