import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendarMsgsEs';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/event';
import { AddNewFab } from '../ui/AddNewFab';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment);
// const events = [
//     {
//         title: 'Cumpleaños del jefe',
//         start: moment().toDate(),
//         end: moment().add(2, 'hours').toDate(),
//         bgcolor: '#fafafa',
//         notes: 'Comprar leche',
//         user: {
//             _id: '123',
//             name: 'Ángel'
//         }
//     }
// ]

export const CalendarScreen = () => {
    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector(state => state.auth);

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');
    
    useEffect(() => {
        dispatch(eventStartLoading());
    }, [dispatch]);

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
    }

    const onSelect = (e) => {
        dispatch(eventSetActive(e));
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    }

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style =  {
            backgroundColor: (uid=== event.user._id) ? '#367cf7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: '#ffffff'
        }

        return {
            style
        }
    }
    
    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={ localizer }
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages={ messages }
                eventPropGetter={ eventStyleGetter }
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                onView={ onViewChange }
                view={ lastView }
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />

            {
                activeEvent && <DeleteEventFab />
            }
            <CalendarModal />
        </div>
    )
}
