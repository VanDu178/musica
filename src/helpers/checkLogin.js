import Cookies from 'js-cookie';

export function isLoggedIn() {
    const accessToken = Cookies.get('access_token');
    return !!accessToken; // Trả về true nếu access_token tồn tại, ngược lại trả về false
}