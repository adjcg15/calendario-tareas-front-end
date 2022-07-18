import { fetchWithoutToken, fetchWithToken } from '../../helpers/fetch';

describe('Pruebas en el helper fetch', () => {
    let token = '';
    
    test('fetch sin token debe funcionar', async() => {
        const resp = await fetchWithoutToken('auth', {email: 'angel@gmail.com',password: '123456'}, 'POST');

        expect(resp instanceof Response).toBe(true);

        const body = await resp.json();
        expect(body.ok).toBe(true);

        token = body.token;
    });

    test('fetch con token debe funcionar', async() => {
        localStorage.setItem('token', token);

        const resp = await fetchWithToken('events/61c6151b1f6ab32ad56aa8d4', {}, 'DELETE');
        const body = await resp.json();

        expect(body.msg).toBe('No existe un evento con ese id');
    });
});
