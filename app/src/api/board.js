import {boardColumns} from './mockData';
import { v4 as uuidv4 } from 'uuid';

class BoardAPI {

  getBoardColumns = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => resolve({
          status: 200,
          data: JSON.parse(JSON.stringify(boardColumns))
      }), 250);
    });

  createTask = (columnId, data) =>
    new Promise((resolve, reject) => {
      if (!boardColumns.find(column => column.id === columnId)) {
        reject(new Error('Column not found'));
      }
      const id = uuidv4();
      const newTask = { id, ...data };

      boardColumns.find(column => column.id === columnId).tasks.push(newTask)

      setTimeout(() => resolve({
          status: 201,
          data: newTask
      }), 250);
    });

  deleteTask = (id) =>
    new Promise((resolve, reject) => {
      let idFound = false;
      for(const column of boardColumns) {
        column.tasks = column.tasks.filter((task) => {
          if(task.id === id) {
            idFound = true;
            return false;
          }
          else return true;
        })
      }
      if(idFound) return setTimeout(() => resolve({status: 204}), 250);
      else return setTimeout(() => reject(new Error('Task not found'), 250));
    });

  editTask = (id, data) =>
    new Promise((resolve, reject) => {
      let idFound = false;
      for(const column of boardColumns) {
        column.tasks = column.tasks.map((task) => {
          if(task.id === id) {
            idFound = true;
            return {...data, id};
          }
          else return task;
        })
      }
      if(idFound) return setTimeout(() => resolve({status: 200}), 250);
      else return setTimeout(() => reject(new Error('Task not found'), 250));
    });



}

export default new BoardAPI();
