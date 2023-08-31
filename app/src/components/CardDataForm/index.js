import React, { useContext } from "react";
import Form from "react-bootstrap/Form";
import { BoardContext } from "../../containers/Board";
const CardDataForm = ({ formState, setFormState }) => {
  const { users } = useContext(BoardContext);
  const { name, description, assigned, importance } = formState;
  const onChange = (name, value) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [name]: value,
    }));
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="input"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="input"
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => onChange(e.target.name, e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="importance">
        <Form.Label>Importance</Form.Label>
        <div>
          <Form.Check
            inline
            label="0"
            name="importance"
            type="radio"
            value={0}
            onChange={(e) => onChange(e.target.name, parseInt(e.target.value))}
            checked={importance === 0}
          />
          <Form.Check
            inline
            label="1"
            name="importance"
            type="radio"
            value={1}
            onChange={(e) => onChange(e.target.name, parseInt(e.target.value))}
            checked={importance === 1}
          />
          <Form.Check
            inline
            label="2"
            name="importance"
            type="radio"
            value={2}
            onChange={(e) => onChange(e.target.name, parseInt(e.target.value))}
            checked={importance === 2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3" controlId="assigned">
        <Form.Label>Assigned</Form.Label>
        <Form.Control
          as="select"
          name="assigned"
          multiple
          value={assigned}
          onChange={(e) =>
            onChange(
              e.target.name,
              [].slice.call(e.target.selectedOptions).map((item) => item.value)
            )
          }
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Form.Control>
        <Form.Text>Multiselection possible using control/command key</Form.Text>
      </Form.Group>
    </Form>
  );
};

export default CardDataForm;
