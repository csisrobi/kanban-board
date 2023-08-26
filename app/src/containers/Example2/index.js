import React, {useEffect} from 'react';
import {ExampleComponent} from '../../components/ExampleComponent';

//Both container Ecample1 and Example2 are just example containers to
//show the structure of the project. Remove both, before starting the exercise
const Example2 = () => {
  return (
    <>
      <div className="row mt-2 mb-2">
        <div className="col-12 example-grid-col">
          <p>Hello 2,<br/>
          This is just an example container, you can remove me!
          </p>
          <ExampleComponent name={"example2"} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4 example-grid-col">This</div>
        <div className="col-4 example-grid-col">exercise</div>
        <div className="col-4 example-grid-col">uses bootstrap.</div>
      </div>
    </>
  )
}

export default Example2;
