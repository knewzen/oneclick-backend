

function getConnection(key, token) {
	// console.log(key, token)
	return  axios.create({
		baseURL: 'https://sandbox.original.com.br/accounts/v1',
		timeout: 3000,
		headers: {
			'Authorization': token,
			'developer-key': key
		}
	  });
}

// Set the configuration settings
const credentials = {
	client: {
		id: '28f965c90f3a29b0134ef1a9100508569a57fac2',
		secret: '0345c170b419013560380050569a7fac'
	},
	auth: {
		authorizeHost: 'https://sb-autenticacao-api.original.com.br',
		authorizePath: 'OriginalConnect',
		tokenHost: 'https://sb-autenticacao-api.original.com.br',
		tokenPath: 'OriginalConnect/AccessTokenController'
	}
  };
const oauth2 = require('simple-oauth2').create(credentials);

const authorizationUri = oauth2.authorizationCode.authorizeURL({
	callback_url: 'http://localhost:8080/callback2', //'http://localhost:3000/callback',
	developer_key: '28f965c90f3a29b0134ef1a9100508569a57fac2',
	scopes: 'account'
  });


///const authorizationUri = 'https://sb-autenticacao-api.original.com.br/OriginalConnect?scopes=account&callback_url=http://localhost:8080/callback2callback2&callback_id=1&developer_key=28f965c90f3a29b0134ef1a9100508569a57fac2'

const receivedToken = 'Bearer ZWU0MjQxODAtZDcyOS0xMWU3LWJjNTEtMDA1MDU2OWE3MzA1OmV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUowZVhCbElqb2lUMEYxZEdnaUxDSnBZWFFpT2pFMU1USXhPVFl6TURjc0ltVjRjQ0k2TVRVeE1qWXlPRE13Tnl3aVlYVmtJam9pTm1aaVpURTROVElpTENKcGMzTWlPaUphZFhBdWJXVWdSMkYwWlhkaGVTSXNJbk4xWWlJNkltVmxOREkwTVRnd0xXUTNNamt0TVRGbE55MWlZelV4TFRBd05UQTFOamxoTnpNd05TSXNJbXAwYVNJNklqYzRaREprTWpFd0xXUTNNbUV0TVRGbE55MWlZelV4TFRjeE5HUXdZMlkwTWpBeFl5SjkuLW9iMzdhMi1fWnllOU1xWWVfdHpJVG13cWNPRWxrZXJPcV9yR256b3BPcw=='
const arr = authorizationUri.split('&')
arr.forEach(el => console.log(el))



app.get('/authorize', (req, res) => {
	res.redirect(authorizationUri)
})

app.get('/token', (req, res) => {
	getToken(`${credentials.auth.tokenHost}/${credentials.auth.tokenPath}`)
	res.status(200).end()
})

app.get('/callback2', (req, res) => {
	console.log('callback', req.params)
	res.status(200).end();
}) 


app.get('/balance', (req, res) => {
	console.log('this is a test')
	const conn = getConnection( credentials.client.id, receivedToken )
	conn.get('balance')
		.then(function(response) {
		console.log(response.data);
			res.status(200).send(response.data);
	})
	.catch(err => {
		console.log(err)
		res.send(err).end()
	})
})
  
