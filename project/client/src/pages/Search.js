import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-light bg-body-tertiary">
      <div className="container-fluid">
        <form className="d-flex input-group w-auto">
          <input
            type="search"
            className="form-control rounded"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <span className="input-group-text border-0" id="search-addon">
            <i className="fas fa-search"></i>
          </span>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
