var express= require('express');
var bodyParser= require('body-parser');
var {ObjectID}= require('mongodb');

var app= express();

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc)=>{
		return res.send(doc);
	},(e)=>{
		return res.status(400).send(e);
	});
});

app.get('/todos',(req,res)=>{
	Todo.find().then((todos)=>{
		return res.send({todos});
	},(e)=>{
		return res.status(400).send(e);
	});
});

app.get('/todos/:id',(req,res)=>{
	var id=req.params.id;
	if(!ObjectID.isValid(id))
		return res.status(404).send('Id not valid');
	Todo.findById(id).then((todo)=>{
		if(!todo)
			return res.status(404).send('Empty todo');
		return res.send({todo});
	}).catch((e)=>{
		return res.status(400).send('Not exist');
	});
});

app.delete('/todos/:id',(req,res)=>{
	var id=req.params.id;
	if(!ObjectID.isValid(id))
		return res.status(404).send('Id not valid');
	Todo.findByIdAndRemove(id).then((todo)=>{
		if(!todo)
			return res.status(404).send('Empty todo');
		return res.send({todo});
	}).catch((e)=>{
		return res.status(400).send('Not exist');
	});
});


app.listen(port,()=>{
	console.log(`Server start at ${port}`);
});