import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartUpdate, eventStartAddNew } from '../../../actions/event';
import { act } from '@testing-library/react';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

jest.mock('../../../actions/event', () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPuls1 = now.clone().add(1, 'hours');

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola Mundo',
            notes: 'Algunas notas',
            start: now.toDate(),
            end: nowPuls1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Dira'
    },
    ui: {
        modalOpen: true
    }
};
const store = mockStore(initState);
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={store}>
        <CalendarModal />
    </Provider>
)

describe('Peuebas en <CalendarModal />', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('debe de mostrar el modal', () => {
        expect(wrapper.find('Modal').prop('isOpen')).toBe(true);
    });

    test('debe de llamar la acción de actualizar y cerrar', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(eventStartUpdate).toHaveBeenCalledWith(initState.calendar.activeEvent);
        expect(eventClearActiveEvent).toHaveBeenCalled();
    });

    test('debe de mostrar error si falta el título', () => {
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe(true);
    });
    
    test('debe de crear un nuevo evento', () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '123',
                name: 'Dira'
            },
            ui: {
                modalOpen: true
            }
        };
        const store = mockStore(initState);
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={store}>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(eventStartAddNew).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: 'Hola pruebas',
            notes: ''
        });

        expect(eventClearActiveEvent).toHaveBeenCalled();
    });
    
    test('debe de validar las fechas', () => {
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            }
        });

        const today = new Date();

        act(() => {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(today);
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect(Swal.fire).toHaveBeenCalledWith('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
    });
    
});
