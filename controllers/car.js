import fs from 'fs';
import Joi from 'joi';

import { validateCar } from '../middleware/validation';
import cloudinary from 'cloudinary';


cloudinary.config({
  cloud_name: "dnuqiengg",
  api_key: "929645198658237",
  api_secret: "5nQhn1XWTRuwfrfwxUZ1rj-Q_uw"
});


//including josn file that serves as database
const carsDb = fs.readFileSync('models/cars.json', 'utf-8');
const parseDb = JSON.parse(carsDb);

class Car {
  
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async fetch(req, res) {
	const queryParameter = req.query;
	const carStatus = queryParameter.status;
	const minPrice = queryParameter.min_price;
	const maxPrice = queryParameter.max_price;

	// to detect the size of the query object
	const keys = Object.keys(queryParameter);

	if (keys.length === 1) {
		const query = parseDb.filter(c => c.status === carStatus);
		if (query.length > 0) res.status(200).json({ status: 200, data: query });
		else res.status(404).json({ status: 404, error: 'No search Data found for that query' });
	} else if (keys.length === 3) {
		const range = parseDb.filter(a => a.status === carStatus && a.price >= minPrice && a.price <= maxPrice);
		if (range.length > 0) res.status(200).json({ status: 200, data: range });
		else res.status(404).json({ status: 404, error: 'No search Data found for that query' });
	} else {
		res.status(200).json({
			status: 200,
			data: parseDb,
		});
	}

}

async fetchId(req, res) {
	const foundCar = parseDb.find(c => c.id === parseInt(req.params.id, 36));
	if (!foundCar) {
		res.status(404).json({
			status: 404,
			error: 'Could not find Car with a given ID',
		});
	}
	res.status(200).json({
		status: 200,
		data: foundCar,
	});

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async create(req, res) {
	//Getting Actual time
	var today =new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
	var DateTime = date+' '+time;

	validateCar(req.body)
    .then(() => {
      const newCar = {
        id: parseDb.length + 1,
        owner: req.body.owner,
        created_on: DateTime,
        state: req.body.state,
        status: 'available',
        price: req.body.price,
        manufacture: req.body.manufacture,
        model: req.body.model,
        body_type: req.body.body_type,
        description: req.body.description,
      };

      parseDb.push(newCar);
      const newInput = JSON.stringify(parseDb, null, 2);
      fs.writeFile('models/cars.json', newInput, (error) => {
        if (error) { throw new Error(); }
      });
      res.status(201).json({
        status: 201,
        data: newCar,
      });
    })
    .catch((error) => {
      res.status(400).json({

	const { error } = Joi.validate(req.body, validateCar);
	if (error) {
		res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
	}
	else{
		//image upload
		let filename = req.files.files.path;
		console.log(filename); 
		cloudinary.v2.uploader.upload(filename,{tags:'basic_sample'},function(err,image){
			if (err){ console.warn(err);}
			else{
				const imageUrl = image.secure_url;
				const newCar = {
					id: parseDb.length + 1,
					owner: req.body.owner,
					created_on: DateTime,
					state: req.body.state,
					status: 'available',
					price: req.body.price,
					manufacture: req.body.manufacture,
					model: req.body.model,
					body_type: req.body.body_type,
					description: req.body.description,
					image: imageUrl
				};

				parseDb.push(newCar);
				const newInput = JSON.stringify(parseDb, null, 2);
				fs.writeFile('models/cars.json', newInput, (error) => {
					if (error) { throw new Error(); }
				});
				res.status(201).json({
					status: 201,
					data: newCar,
				});
			}
		});
	}
    
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async updatePrice(req, res) {
	const updateCar = parseDb.find(c => c.id === parseInt(req.params.id, 36));
	if (!req.body.price || req.body.price <= 99) {
		res.status(400).json({
			status: 400,
			error: 'Invalid price, please specify Price',
		});
	} else {
		const newPrice = req.body.price;
		updateCar.price = newPrice;
		const updatePrice = JSON.stringify(parseDb, null, 2);
		fs.writeFile('models/cars.json', updatePrice, (error) => {
			if (error) { throw new Error(); }
		});
		res.status(200).json({
			status: 200,
			data: updateCar,
		});
	} 
}

async updateStatus(req, res) {
	const updateCar = parseDb.find(c => c.id === parseInt(req.params.id, 36));
	if (!updateCar) return res.status(404).json({status: 404,error: 'Could not find Car with a given ID',});
	if (!req.body.status) {
		res.status(400).json({
			status: 400,
			error: 'Please specify the status',
		});
	} else {
		const newStatus = req.body.status;
		updateCar.status = newStatus;
		const updateStatus = JSON.stringify(parseDb, null, 2);
		fs.writeFile('models/cars.json', updateStatus, (error) => {
			if (error) { throw new Error(); }
		});
		res.status(200).json({
			status: 200,
			data: updateCar,
		});
	}
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async delete(req, res) {
	const foundCar = parseDb.find(c => c.id === parseInt(req.params.id, 36));
	if (!foundCar) return res.status(404).json({status: 404,error: 'Could not find Car with a given ID',});

	const index = parseDb.indexOf(foundCar);
	parseDb.splice(index, 1);
	const updateDb = JSON.stringify(parseDb, null, 2);
	fs.writeFile('models/cars.json', updateDb, (error) => {
		if (error) { throw new Error(); }
	});
	res.status(200).json({
		status: 200,
		data: "Car Ad successfully Deleted"
	}); 
}

}

export default Car;

