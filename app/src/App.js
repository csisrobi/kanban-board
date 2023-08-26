import React, {useEffect} from "react";
import BoardAPI from './api/board';
import UserAPI from './api/user';
import Example1 from './containers/Example1';
import Example2 from './containers/Example2';
import {
  Routes,
  Route
} from 'react-router-dom';


const App = () => {

  //this function is for showing the available mocked Rest API,
  //remove this function when starting the exercise
  const exampleOfMockAPI = async () => {
    let res = await BoardAPI.getBoardColumns();
    console.log("get board columns", res);


    res = await UserAPI.getUsers();
    console.log("get users", res);

    await BoardAPI.editTask('dc0aa9a6-a4d3-45e2-86e1-37e793a4df52', {
              name: 'Infrastructure acc',
              assigned: [
                '76fbd508-3cb6-4b1a-a574-9046367fc3ac'
              ],
              importance: 1,
              description: 'Example description changed'
            })

    res = await BoardAPI.getBoardColumns();
    console.log("board columns after edit", res);

    await BoardAPI.deleteTask('dc0aa9a6-a4d3-45e2-86e1-37e793a4df52');

    res = await BoardAPI.getBoardColumns();
    console.log("board columns after delete", res);

    await BoardAPI.createTask('e38bba16-6c80-4ac3-9102-5dbb6aeb7c19', {
      name: 'Example',
      assigned: [],
      importance: 2,
      description: 'Example description'
    })

    res = await BoardAPI.getBoardColumns();
    console.log("board columns after create", res);


  }


  useEffect(() => {
    exampleOfMockAPI();
  }, [])

  return (
    <div className="container">
      {/*create your own containers and components*/}
      <Routes>
        <Route path="/" element={<Example1 />}/>
        <Route path="/example2" element={<Example2 />} />
      </Routes>
    </div>
  );
}

export default App;
