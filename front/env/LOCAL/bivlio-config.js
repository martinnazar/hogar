var Config = {};

// Configuracion para el angular
Config.app = {
    URL : window.location.origin || window.location.protocol + '//' + window.location.host
};

Config.app.URL += "/" + Config.app.location;

// Configuracion para la API de Customer
Config.customer = {
    URL : 'http://api.oidcapi.vm/'
};

Config.catalog = {
    URL : 'http://api.catalog.vm'
};
