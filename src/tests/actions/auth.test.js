import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const initState = {};
let store = mockStore(initState);

describe('Pruebas en las acciones del Auth', () => {
    beforeEach(() => {
        store = mockStore(initState);
        jest.clearAllMocks();
    });
    
    test('startLogin funciona bien con user correcto', async() => {
        Storage.prototype.setItem = jest.fn();
        
        await store.dispatch(startLogin('angel@gmail.com', '123456'));

        const actions = store.getActions();
        
        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any(String),
                name: expect.any(String)
            }
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('startLogin funciona bien con user incorrecto', async() => {
        await store.dispatch(startLogin('angel@gmail.com', '123456234'));

        let actions = store.getActions();
        
        expect(actions).toEqual([]);
        expect(Swal.fire).toHaveBeenLastCalledWith( 'Error', 'Password incorrecto', 'error');

        await store.dispatch(startLogin('x@gmail.com', '123456234'));
        actions = store.getActions();
        
        expect(Swal.fire).toHaveBeenLastCalledWith( 'Error', 'El usuario no existe con ese email', 'error');
    });

    test('startRegister correcto', async() => {
        fetchModule.fetchWithoutToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlos',
                    token: 'ABC123ABC123'
                }
            }
        }));
        
        await store.dispatch(startRegister('test@test.com', '123456', 'test'));

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'carlos'
            }
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
        expect(localStorage.setItem).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    });

    test('startChecking correcto', async() => {
        fetchModule.fetchWithToken = jest.fn(() => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'carlos',
                    token: 'ABC123ABC123'
                }
            }
        }));

        await store.dispatch(startChecking());

        const actions = store.getActions();

        expect(actions[0]).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'carlos'
            }
        });

        expect(localStorage.setItem).toHaveBeenCalledWith('token', expect.any(String));
    });
});
