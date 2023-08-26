import {users} from './mockData';

class UserAPI {
  getUsers = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve({
          status: 200,
          data: JSON.parse(JSON.stringify(users))
      }), 250);
    });
}

export default new UserAPI();
