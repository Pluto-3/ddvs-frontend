export const saveToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');
export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getUser = () => JSON.parse(localStorage.getItem('user'));
export const removeUser = () => localStorage.removeItem('user');

export const logout = () => {
    removeToken();
    removeUser();
    window.location.href = '/login';
};