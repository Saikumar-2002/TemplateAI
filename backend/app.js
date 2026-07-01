const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(cors())
app.use(express.json({limit: '10mb'}))

// Health
app.get('/api/health', (req,res)=> res.json({ok:true,ts:Date.now()}))

// Templates - serve mock templates
app.get('/api/templates', (req,res)=>{
	try{
		const dataPath = path.join(__dirname, '..', 'src', 'data', 'templates.json')
		const raw = fs.readFileSync(dataPath, 'utf8')
		const templates = JSON.parse(raw)
		res.json({count: templates.length, templates})
	}catch(err){
		res.status(500).json({error: 'Could not load templates', details: err.message})
	}
})

// Generate endpoint will be implemented in routes/generate.js
const generateRoute = require('./routes/generate')
app.use('/api/generate', generateRoute)

// Payment endpoint for Razorpay
const paymentRoute = require('./routes/payment')
app.use('/api/payment', paymentRoute)

module.exports = app
