interface config {
    baseUrl: string
    apiPath: string
}
const settings: config = {
    baseUrl: 'https://api.masvivos.com',
    apiPath: '/wp-json/api/v1/'
}
export {
    settings
}