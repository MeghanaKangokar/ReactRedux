import React from 'react';
import { connect } from 'react-redux';
import { getHistory } from './../redux/actions'
import { Card } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import SearchResults  from 'react-filter-search';
class History extends React.Component {
   constructor() {
      super();
      this.state = {
         offset: 0,
         data: [],
         perPage: 3,
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
      const slice = this.props.historyData.slice(this.state.offset, this.state.offset + this.state.perPage);
      const postData = slice.map((item, index) =>
         <Card key={index}>
            <Card.Header>{item.title}</Card.Header>
            <Card.Body>
               <Card.Text>
                  {item.details}
               </Card.Text>
               <div className="items">
                  <span>Date: {this.convertDate(item.event_date_utc)}</span>
                  <a href={item.links.reddit}><img src={require('./../assets/reddit.png')} alt="no content"/>Reddit</a>
                  <a href={item.links.wikipedia}><img src={require('./../assets/wikipedia.png')} alt="no content"/>Wikipedia</a>
                  <a href={item.links.article}><img src={require('./../assets/article.png')} alt="no content"/>Article</a>
               </div>
            </Card.Body>
         </Card>
      );

      this.setState({
         pageCount: Math.ceil(this.props.historyData.length / this.state.perPage),
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
            this.props.saveData(result);
            this.receivedData();
         }
      });
   }

   async fetchHistory() {
      return await fetch('https://api.spacexdata.com/v3/history')
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
      saveData: (data) => dispatch(getHistory(data))
   }
};

const mapStateToProps = state => {
   return {
      historyData: state.historyData,
      term: state.term
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);