import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import $ from "jquery";

export class Save extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var navBar = document.getElementsByClassName('pBarWrapper')[0];
        // console.log(navBar);
        navBar.style.display = "none";
    }

    componentWillUnmount() {
        var navBar = document.getElementsByClassName('pBarWrapper')[0];
        // console.log(navBar);
        navBar.style.display = "block";
    }

    copyLink = e => {
      e.preventDefault();
      const elem = document.createElement('textarea');
      elem.value = document.getElementById('formLink').textContent;
      document.body.appendChild(elem);
      elem.select();
      document.execCommand('copy');
      document.body.removeChild(elem);
      alert('Link copied to clipboard');
    }

    back = (e) => {
        $("html,body").scrollTop(0);
        e.preventDefault();
        this.props.history.goBack();
    }


    render() {
        const { values } = this.props;
        return (
            <div style={{ textAlign: 'center', fontSize: '16px', margin: '60px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>IMPORTANT INSTRUCTIONS</div>
                <br></br>
                <div style={{ textAlign: 'justify', fontSize: '12px', margin: '20px' }}>

                    <p>1.   If you completing this form as a Member please copy the link and send this link via your email to your Fund's Financial Adviser Or Employer. Whosever is responsible for the next steps.</p>
                    <br></br>
                    <p>2.	If you completing this form as a Financial Adviser please copy the link and send this link via your email to your Member or Employer. Whosever is responsible for the next steps.</p>
                    <br></br>
                    <p>3.	If you completing this form as an Employer please copy the link and send this link via your email to your Member or Financial Adviser. Whosever is responsible for the next steps.</p>

                </div>
                <div id="formLink" style={{ border: '#00164e 3px dashed', padding: '15px', margin: '20px', backgroundColor: '#eeeeee' }}>
                    {window.location.protocol}//{window.location.hostname}:{window.location.port}/?uuid={ values.uuid }

                </div>
                <button className="fmSmtButton saveColor saveBtn" style={{width: 'auto'}} onClick={this.back}>Back</button>
                <button className="fmSmtButton saveColor saveBtn" style={{width: 'auto'}} onClick={this.copyLink}>Copy Link</button>
                {/* <div>Claim form has been submitted. Form number { values.uuid }</div> */}
            </div>
        );
    }
}

export default withRouter(Save);