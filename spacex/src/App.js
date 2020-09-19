import React from 'react';
import './App.css';
import {Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import History from './components/History';
import Address from './components/Address';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { searchTerm } from './redux/actions/index'

class App extends React.Component{
  render() {
    return (
      <div className="App">
      <Navbar expand="lg">
        <Navbar.Brand href="/"><img src={require('./assets/logo.png')} alt="no logo"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">History</Nav.Link>
            <Nav.Link href="/address">Address</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={term => this.props.search(term.target.value)}/>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Router>
            <Switch> 
              <Route exact path='/' component={History}></Route> 
              <Route exact path='/address' component={Address}></Route>
            </Switch> 
      </Router>
    </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    search: (data) => dispatch(searchTerm(data))
  }
};

const mapStateToProps = state => {
  return {
     term: state.term
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
