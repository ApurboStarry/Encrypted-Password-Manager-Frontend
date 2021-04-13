import React, { Component } from 'react';

class Files extends Component {
  state = { files: [] }

  async componentDidMount() {
    
  }
  

  render() { 
    return ( <div>
      <button className="btn btn-success">Add File</button>

    </div> );
  }
}
 
export default Files;