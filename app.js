var express = require('express');
var saml = require('express-saml2');

var app = express();

var idp = saml.IdentityProvider('./metadata/accounts.sap.com_metadata.xml');
var sp = saml.ServiceProvider('./metadata/sp_metadata.xml');


app.get('/', function(req, res) {
	res.send('Please login ...');
});

app.get('/login', function(req, res) {
	sp.sendLoginRequest(idp, 'redirect', function(url) {
	res.redirect(url);
	});
});


app.get('/sso/metadata', function(req, res, next) {
	res.header('Content-Type', 'text/xml').send(sp.getMetadata());
});

app.get('/sso/acs', function(req, res, next) {
	console.log("Recieved an ACS ...");
	sp.parseLoginResponse(idp, 'post', req, function(parseResult) {
		res.send('Validate the SAML Response successfully !');
	});
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Starting Webapp ...');
});
