interface config {
    baseUrl: string
    apiPath: string
}
const settings: config = {
    baseUrl: 'https://api.masvivos.com',
    // baseUrl: 'http://localhost:8081',
    apiPath: '/wp-json/api/v1/'
}
export {
    settings
}