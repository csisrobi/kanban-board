import React from 'react';


export const ExampleComponent = ({name, ...rest}) => {
  return (
    <p> ExampleComponent with name: {name}<br/>
    I'm a presentational component, remove me before starting the exercise
    </p>
  )
}
