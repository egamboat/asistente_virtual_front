// api.js

export async function customFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Obtén el token de acceso del almacenamiento local
    let accessToken = localStorage.getItem('backend_access_token');

    // Asegúrate de que los encabezados existan
    const headers: HeadersInit = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    // Agrega el token de acceso al encabezado Authorization
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    } else{
        console.log("No se encontró token.")
    }
    options.headers = headers;


    let response = await fetch(url, options);

    if (response.status === 401) {
        const refreshToken = localStorage.getItem('backend_refresh_token');

        if (refreshToken) {
            const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}usuario/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                // Actualiza el token de acceso en el almacenamiento local
                localStorage.setItem('backend_access_token', tokenData.access);

                // Actualiza el encabezado Authorization y reintenta la solicitud original
                headers.set('Authorization', `Bearer ${tokenData.access}`);
                options.headers = headers;
                response = await fetch(url, options);
            } else {
                // Si el refresh token también ha expirado, redirige al usuario al login
                localStorage.removeItem('backend_access_token');
                localStorage.removeItem('backend_refresh_token');
                // window.location.href = '/';
                return Promise.reject('El refresh token ha expirado.');
            }
        } else {
            // No hay refresh token, redirige al login
            // window.location.href = '/';
            return Promise.reject('No hay refresh token. Redirigiendo al login.');
        }
    }

    return response;
}