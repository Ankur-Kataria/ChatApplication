const http = require("http");

// Replace with your server details
const hostname = "localhost";
const port = 8080;

// Replace with your API routes
const registerUserRoute = "http://localhost:8080/user/register";
const loginUserRoute = "http://localhost:8080/user/login";
const logoutUserRoute = "http://localhost:8080/user/logout";

// Replace with actual user data for testing
const testUser = {
  username: "testuser",
  password: "testpassword",
  email: "test@example.com",
  roles: ["user"],
};

// Function to make HTTP requests
const makeRequest = (method, route, data = null, authToken = null) => {
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `${authToken}`;
    }
    const options = {
      hostname,
      port,
      path: route,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

// E2E Test
(async () => {
  try {
    // Register a user
    const registerResponse = await makeRequest(
      "POST",
      registerUserRoute,
      testUser
    );
    console.log("Register User:", registerResponse);

    // Login with the registered user
    const loginResponse = await makeRequest("POST", loginUserRoute, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log("Login User:", loginResponse);

    if (loginResponse.status === 200) {
      let authToken = loginResponse.body.token; // Save the authentication token
      // Logout the user with the authorization header
      const logoutResponse = await makeRequest("POST", logoutUserRoute, null, authToken);
      console.log("Logout User:", logoutResponse);
    }
  } catch (error) {
    console.error("Error in e2e test:", error);
  }
})();
