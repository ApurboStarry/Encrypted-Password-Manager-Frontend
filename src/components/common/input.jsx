import React from 'react'

const Input = ({ name, value, label, error, onChange, type="text" }) => {
  return (
    <div className="mb-3">
      <label style={{ paddingLeft: 5 }} htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        onChange={onChange}
        value={value}
        name={name}
        type={type}
        className="form-control"
        id={name}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}
 
export default Input;