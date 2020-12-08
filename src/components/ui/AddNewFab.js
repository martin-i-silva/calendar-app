import React from 'react'
import { useDispatch } from 'react-redux'
import { startOpenModal } from '../../actions/ui';

export const AddNewFab = () => {
    const dispatch = useDispatch();
    return (
        <button className="btn btn-primary fab" onClick={()=>dispatch(startOpenModal())}>
            <i className="fas fa-plus"></i>
        </button>
    )
}
