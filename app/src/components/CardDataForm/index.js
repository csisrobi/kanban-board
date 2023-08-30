import React from "react";
import Form from "react-bootstrap/Form";
const CardDataForm = ({
  name,
  description,
  assigned,
  importance,
  setName,
  setDescription,
  setAssigned,
  setImportance,
  users,
}) => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="importance">
        <Form.Label>Importance</Form.Label>
        <div>
          <Form.Check
            inline
            label="0"
            name="group1"
            type="radio"
            value={0}
            onChange={(e) => setImportance(parseInt(e.target.value))}
            checked={importance === 0}
          />
          <Form.Check
            inline
            label="1"
            name="group1"
            type="radio"
            value={1}
            onChange={(e) => setImportance(parseInt(e.target.value))}
            checked={importance === 1}
          />
          <Form.Check
            inline
            label="2"
            name="group1"
            type="radio"
            value={2}
            onChange={(e) => setImportance(parseInt(e.target.value))}
            checked={importance === 2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-3" controlId="assigned">
        <Form.Label>My multiselect</Form.Label>
        <Form.Control
          as="select"
          multiple
          value={assigned}
          onChange={(e) =>
            setAssigned(
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
