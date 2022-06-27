import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

export class Submit extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var navBar = document.getElementsByClassName('pBarWrapper')[0];
        // console.log(navBar);
        navBar.style.display = "none";
    }

    copyLink = e => {
        e.preventDefault();
        navigator.clipboard.writeText(document.getElementById("formLink").innerHTML);
        alert('Link copied to clipboard');
    }

    render() {
        const { values } = this.props;
        return (
            <div style={{ textAlign: 'center', fontSize: '16px', margin: '60px' }}>
                {/* <div id="formLink" style={{ border: '#00164e 3px dashed', padding: '15px', margin: '20px', backgroundColor: '#eeeeee' }}>
                    {window.location.protocol}//{window.location.hostname}:{window.location.port}/#/?uuid={ values.uuid }
                </div>
                <button className="fmSmtButton saveColor saveBtn" onClick={this.copyLink}>Copy Link</button> */}
                <div>Claim form has been submitted. <br/> In case of any query please contact +27(0)11 558 2999</div>
            </div>
        );
    }
}

export default withRouter(Submit);