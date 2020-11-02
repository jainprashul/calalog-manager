const APPLINKS = {
    login: '/login',
    catalog: '/catalog',
    item: `/:shop/item/:id`, 
    addItem: '/addItem',

    shop: '/shop/:shop',
    profile: '/profile',
    settings: '/settings',
}

const APPSTRING = {
    catalogItems: 'catalogItems',
    shops: 'shops',

    UPLOAD_CHANGED: 'state_changed',
    DOC_ADDED: 'added',
    DOC_MODIFIED: 'modified',
    DOC_REMOVED: 'removed',
    PREFIX_IMAGE: 'image/',
    APP_NAME : "Alpha Catalogs",
    USERS: 'users',
    ID: 'id',
}


export default APPLINKS
export {APPSTRING};
