import React from 'react';
import { connect } from 'react-redux';
import { getAddress } from './../redux/actions'
import { Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import SearchResults from 'react-filter-search';

class Address extends React.Component {
   constructor() {
      super();
      this.state = {
         offset: 0,
         data: [],
         perPage: 1,
         currentPage: 0,
         currentData: []
      };
   }

   handlePageClick = (e) => {
      const selectedPage = e.selected;
      const offset = selectedPage * this.state.perPage;

      this.setState({
         currentPage: selectedPage,
         offset: offset
      }, () => {
         this.receivedData()
      });

   };

   convertDate = (date) => {
      const d = new Date(date);
      return (`${d.getDate()} - ${d.getMonth()} - ${d.getFullYear()}`);
   }

   receivedData() {
      const slice = this.props.addressData.slice(this.state.offset, this.state.offset + this.state.perPage);
      const postData = slice.map((item, index) =>
         <Card key={index}>
            <Card.Header>{item.payload_id}</Card.Header>
            <Card.Body>
               <div className="address">
                  <div>
                     <img src={require('../assets/rocket.png')} alt="No src"/>
                  </div>
                  <div className="addressitems">
                     <div><span><label>Customers: </label>{item.customers}</span></div>
                     <div><span><label>Manufacturer: </label>{item.manufacturer}</span></div>
                     <div><span><label>Nationality: </label>{item.nationality}</span></div>
                     <div><span><label>Reused: </label>{(item.reused)?<span>Yes</span>:<span>No</span>}</span></div>
                  </div>
                  <div className="orbititems">
                     <h6>Orbit Details</h6>
                     <div>{!(!item.orbit)? <span><label>Orbit: </label>{item.orbit}</span>:null}</div>
                     <div>{!(!item.orbit_params.apoapsis_km)? <span><label>Apoapsis km: </label>{item.orbit_params.apoapsis_km}</span>:null}</div>
                     <div>{!(!item.orbit_params.arg_of_pericenter)? <span><label>Arg of pericenter: </label>{item.orbit_params.arg_of_pericenter}</span>:null}</div>
                     <div>{!(!item.orbit_params.eccentricity)? <span><label>Eccentricity: </label>{item.orbit_params.eccentricity}</span>:null}</div>
                     <div>{!(!item.orbit_params.epoch)? <span><label>Epoch: </label>{item.orbit_params.epoch}</span>:null}</div>
                     <div>{!(!item.orbit_params.inclination_deg)? <span><label>Inclination deg: </label>{item.orbit_params.inclination_deg}</span>:null}</div>
                     <div>{!(!item.orbit_params.lifespan_years)? <span><label>Lifespan years: </label>{item.orbit_params.lifespan_years}</span>:null}</div>
                     <div>{!(!item.orbit_params.longitude)? <span><label>Longitude: </label>{item.orbit_params.longitude}</span>:null}</div>
                     <div>{!(!item.orbit_params.mean_anomaly)? <span><label>Mean anomaly: </label>{item.orbit_params.mean_anomaly}</span>:null}</div>
                     <div>{!(!item.orbit_params.mean_motion)? <span><label>Mean motion: </label>{item.orbit_params.mean_motion}</span>:null}</div>
                     <div>{!(!item.orbit_params.periapsis_km)? <span><label>Periapsis km: </label>{item.orbit_params.periapsis_km}</span>:null}</div>
                     <div>{!(!item.orbit_params.period_min)? <span><label>Period min: </label>{item.orbit_params.period_min}</span>:null}</div>
                     <div>{!(!item.orbit_params.raan)? <span><label>Raan: </label>{item.orbit_params.raan}</span>:null}</div>
                     <div>{!(!item.orbit_params.reference_system)? <span><label>Reference system: </label>{item.orbit_params.reference_system}</span>:null}</div>
                     <div>{!(!item.orbit_params.regime)? <span><label>Regime: </label>{item.orbit_params.regime}</span>:null}</div>
                     <div>{!(!item.orbit_params.semi_major_axis_km)? <span><label>Semi major axis km: </label>{item.orbit_params.semi_major_axis_km}</span>:null}</div>
                  </div>

                  <div className="orbititems">
                     <h6>Payload Details</h6>
                     <div>{!(!item.payload_mass_kg)? <span><label>Payload mass kg: </label>{item.payload_mass_kg}</span>:null}</div>
                     <div>{!(!item.payload_mass_lbs)? <span><label>Payload mass lbs: </label>{item.payload_mass_lbs}</span>:null}</div>
                     <div>{!(!item.payload_type)? <span><label>Payload type: </label>{item.payload_type}</span>:null}</div>
                  </div>
               </div>
            </Card.Body>
         </Card>
      );

      this.setState({
         pageCount: Math.ceil(this.props.addressData.length / this.state.perPage),
         postData
      })

      this.setState({
         currentData: postData
      })
   }

   render() {
      return (
         <div>
            <SearchResults
               value={this.props.term}
               data={this.state.currentData}
               renderResults={results => (
                  <div>
                     {results}
                     <ReactPaginate
                        previousLabel={"<<Prev"}
                        nextLabel={"Next>>"}
                        breakLabel={''}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={0}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                  </div>
               )}
            />
         </div>

      )
   }

   componentDidMount() {
      this.fetchHistory().then(result => {
         if (!(!result)) {
            console.log(result);
            this.props.saveData(result);
            this.receivedData();
         }
      });
   }

   async fetchHistory() {
      return await fetch('https://api.spacexdata.com/v3/payloads')
         .then(res => res.json())
         .then(res => {
            if (res.error) {
               throw (res.error);
            }
            return res;
         })
         .catch(error => {
            console.log(error);
         })
   }
}

const mapDispatchToProps = dispatch => {
   return {
      saveData: (data) => dispatch(getAddress(data))
   }
};

const mapStateToProps = state => {
   return {
      addressData: state.addressData,
      term: state.term
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);