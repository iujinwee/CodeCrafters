## Server

The `./server` directory serves to abstract the backend server logic
which consists of the following components: 
- MongoDB database
- Express API routes 
- `config.env` 

To run the application, you can simply run in your CLI terminal. 
```
node server.js
```

### Development Process

To standardise our development work for backend APIs, we will utilise 
the following conventions. 

> Process Flow
> 1. Helper function to make API calls (RESTful APIs)
> 2. `Controllers` to handle the backend logic
> 3. `Routes` to handle HTTP routes 
> 4. `Models` to store data schemas

<br>

### Example of helper function
```javascript
import { localhost } from "@src/components/root";

const postLoginAccount = async (req) => {
  return fetch(`${localhost}/api/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      throw error;
    });
};
```

### Example of Controller logic
```javascript
const loginAccount = async (req, res) => {
  try {
    console.log("Attempting to login..");

    const { username, password, type } = req.body;

    const authenticatedAccount = await AccountModel.findOne({
      username,
      type,
    });

    if (authenticatedAccount === null) {
      return res
        .status(400)
        .json({ success: false, body: "Invalid username and/or type." });
    }

    if (authenticatedAccount.password !== password) {
      return res
        .status(400)
        .json({ success: false, body: "Invalid password." });
    }

    console.log("Successfully login.");
    return res.status(200).json({ success: true, body: authenticatedAccount });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};
```