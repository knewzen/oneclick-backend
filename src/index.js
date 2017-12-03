import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import { getToken } from './util'
import axios from 'axios'
import inicio from './inicio'
import { filter, merge } from 'lodash'
import shortid from 'shortid32'

if (typeof global.localStorage === "undefined" || global.localStorage === null) {
	var lstore = require('node-localstorage').LocalStorage;
	global.localStorage = new lstore('./mydb');
  }

const store = require('store')

function saveItem(target, data, id = shortid.generate()) {
	try {
		JSON.stringify(data);
	} catch (e) {
		console.log(e)
		return {
			error: 'invalid json'
		}
	}
	const arr = store.get(target) || []
	const existing = filter(arr, { id: id})
	if(existing.length) {
		console.log('Collection already has an item with this id. merging')
		data = merge(existing[0], data)
	}else{
		data.id = id
	}
	arr.push(data)
	store.set(target, arr)
	console.log('saved or updated 1 item in: ', target)
	return arr
}



const appCred = {
	id:  '972834566187922',
	secret: '',
	token: 'EAAEmiCM0n1UBAN6SrhoF5hEnDPJVOqSlMabSc3HV9SwKVrGum2bza661Y6I54oufsQm2ofZBmwj9DZCGYs1NXRR9PKSK90sVSk4IgGip06brtft949KuUHLoW2hrBqgZBvv1Hjl9cABMQ5oVFZCPBb9X9qxY7WUsMwBwXAg4LQZDZD'
}

/* const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: 'FB_ACCESS_TOKEN',
  verifyToken: 'FB_VERIFY_TOKEN',
  appSecret: 'FB_APP_SECRET'
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say(`Echo: ${text}`);
});

bot.start(); */

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}))

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.get('/login_callback', (req, res) => {
	saveItem('users', {
		auth_code: req.query.auth_code,
		id: req.query.uid,
		facebookId: req.query.callback_id
	}, req.query.uid )
	res.status(200).end((err, response) => {

            res.send('<script>window.close();</script>')
    });
}) 

app.get('/challenge', (req, res) => {
	console.log('challenge', req.params, req.query)
	res.status(200).send();
}) 

app.get('/events', (req, res) => {
	const arr = store.get('events')
    
    
    
    
	res.send(arr)
})

app.get('/users', (req, res) => {
	const arr = store.get('users')
	res.send(arr)
})

app.get('/purchases', (req, res) => {
	console.log(req.query)
	const arr = store.get('purchases')
	// console.log(arr)
	if(req.query.userid) {
		const filtered = filter(arr, { "buyer" : req.query.userid })
		res.send(filtered)
	}else{
		res.send(arr)
	}
})

app.get('/verify_login', (req, res) => {
	const arr = store.get('users')
	// console.log(arr)
	if(req.query.facebookId) {
		const filtered = filter(arr, { facebookId : req.query.facebookId })
		if(filtered.length) {
			res.send({
				"redirect_to_blocks": ["Login Realizado com sucesso"]
				})
		}else{
			res.send({
				"redirect_to_blocks": ["Verificar Login"]
				})
		}
	}else{
		res.send(arr)
	}
})

app.post('/post_event', (req, res) => {
	res.send(saveItem('events', req.body))
})

app.post('/post_purchase', (req, res) => {
	res.send(saveItem('purchases', req.body))
})

app.get('/clear_collection', (req, res) => {
	store.set(req.query.name, [])
	res.status(200).send(`Cleared all ${req.query.name}`);
})


app.get('/inicio', (req, res) => {
	res.status(200).send(JSON.stringify(inicio));
})

app.use(middleware({ config }));

	// api router
app.use('/api', api({ config }));

app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
});


export default app;
