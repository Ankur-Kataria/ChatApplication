const http = require('http');

const hostname = 'localhost';
const port = 8080;

const registerUserRoute = 'http://localhost:8080/user/register';
const loginUserRoute = 'http://localhost:8080/user/login';
const createGroupRoute = 'http://localhost:8080/group/createGroup';
const createMessageRoute = 'http://localhost:8080/messages/createMessage';
const likeMessageRoute = 'http://localhost:8080/messages/likeMessage';
const getMessagesByGroupRoute = 'http://localhost:8080/messages/getMessagesByGroup';

const testUser = {
  username: 'testuser-Msg',
  password: 'testpassword-Msg',
  email: 'test-Msg@example.com',
  roles: ['user'],
};

let testGroup = {
  name: 'TestGroup',
  members: [],
};

const makeRequest = (method, route, data = null, authToken = null) => {
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `${authToken}`;
    }

    const options = {
      hostname,
      port,
      path: route,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({ status: res.statusCode, body: JSON.parse(data) });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
};

(async () => {
  try {
    // Register a user
    const registerResponse = await makeRequest('POST', registerUserRoute, testUser);
    console.log('Register User:', registerResponse);

    // Login with the registered user
    const loginResponse = await makeRequest('POST', loginUserRoute, {
      email: testUser.email,
      password: testUser.password,
    });
    console.log('Login User:', loginResponse);

    if (loginResponse.status === 200) {
      const authToken = loginResponse.body.token;

      testGroup = {...testGroup, members: [loginResponse.body.result._id]}

      // Create a group
      const createGroupResponse = await makeRequest('POST', createGroupRoute, testGroup, authToken);
      console.log('Create Group:', createGroupResponse);

      // Create a message in the group
      const createMessageResponse = await makeRequest(
        'POST',
        createMessageRoute,
        { content: 'Hello, Group!', groupId: createGroupResponse.body.result._id, senderId: loginResponse.body.result._id },
        authToken
      );
      console.log('Create Group Message:', createMessageResponse);

      // Like the created message
      const likeMessageResponse = await makeRequest(
        'POST',
        likeMessageRoute,
        { messageId: createMessageResponse.body.result._id, userId: loginResponse.body.result._id },
        authToken
      );
      console.log('Like Group Message:', likeMessageResponse);

      // Get messages for the group
      const getMessagesResponse = await makeRequest(
        'GET',
        `${getMessagesByGroupRoute}/${createGroupResponse.body.result._id}`,
        null,
        authToken
      );
      console.log('Get Group Messages:', getMessagesResponse);
    }
  } catch (error) {
    console.error('Error in messages e2e test:', error);
  }
})();