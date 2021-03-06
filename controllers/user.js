import fs from 'fs';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// including josn file that serves as database
const usersDb = fs.readFileSync('models/users.json', 'utf-8');
const parseDb = JSON.parse(usersDb);

class User {
/**
 *
 * @param {login user} req
 * @param {*token on success} res
 */


  async signup(req, res) {
    const validateUser = (user) => {
      const schema = {
        first_name: Joi.string().alphanum().min(3).max(30)
          .required(),
        last_name: Joi.string().alphanum().min(3).max(30)
          .required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).min(3).required(),
        address: Joi.string().alphanum().min(3).required(),
        password: Joi.string().min(3).required(),
      };
      return Joi.validate(user, schema);
    };

    validateUser(req.body)
      .then(() => {
        const emailFound = parseDb.find(c => c.email === req.body.email);
        if (emailFound) return res.status(409).json({ status: 409, error: 'Email Exists' });
        const user = {
          id: parseDb.length + 1,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          address: req.body.address,
          password: bcrypt.hashSync(req.body.password, 10),
          is_admin: false,
        };
        parseDb.push(user);
        const newInput = JSON.stringify(parseDb, null, 2);
        fs.writeFile('models/users.json', newInput, (error) => {
          if (error) { throw new Error(); }
        });
        delete user.password;
        jwt.sign({ id: user.id, email: user.email }, "secretKey", {expiresIn: '3m'}, (err, token) => {
          user.token = token;
          return res.status(201).json(
          {
            status: 201,
            data: user
          });
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: 400,
          error: error.details[0].message,
        });
      });
  }

  /**
 *
 * @param {create a meetup} req
 * @param {*returns success if created} res
 */
  async login(req, res) {
    if (!req.body.email || !req.body.password) 
      return res.status(400).json({ status: 400, error: 'Email and Password are required' });
    
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const foundUser = parseDb.find(c => c.email === userEmail);
    
    if (!foundUser) {
      return res.status(401).json({ status: 401, error: 'email does not exist' });
    }
    else{
      const pass = bcrypt.compareSync(userPassword, foundUser.password);
      if (pass) {
        delete foundUser.password;

        jwt.sign({ id: foundUser.id, email: foundUser.email }, "secretKey", {expiresIn: '3m'}, (err, token) => {
          foundUser.token = token;
          return res.status(200).json(
          {
            status: 200,
            data: foundUser
          });
        });
      }
      else{
        res.status(404).json({
          status: 404,
          message: "invalid credential"
        })
      }
    }

  }

  /**
 *
 * @param {*} req
 * @param {*} res
 */
  async logout(req, res) {

  }
}

export default User;
