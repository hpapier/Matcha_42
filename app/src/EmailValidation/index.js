import React from 'react';
import { Link, Redirect } from 'react-router-dom';

const EmailValidation = props => {
  console.log('-- EMAIL VALIDATION PROPS --');
  console.log(props);
  if (props.match.params.token === ':lol') {
    console.log('MDR');
    return <Redirect exact to="/"/>;
  } else {
    return (
      <div>
        Hello Email Component
        <Link to="/">Looool</Link>
      </div>
    );
  }
}

// class EmailValidation extends React.Component {
//   render() {
//     console.log(this.props);
//     if (this.props.match.params.token === ':lol') {
//       console.log('MDR');
//       return <Redirect exact to="/"/>;
//     } else {
//       return (
//         <div>
//           Hello Email loll Component
//           <Link to="/">Looool</Link>
//         </div>
//       );
//     }
//   }
// }

export default EmailValidation;