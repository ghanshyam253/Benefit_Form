import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import previewLogo from "../images/logo_v.jpg";
import jsPDF from "jspdf";
import $ from "jquery";
import spinner from '../images/Spinner-1s-100px.gif';

import Modal from "react-modal";

import Moment from 'moment';
import {fileUpload, saveDocument, sendMail} from "../helpers/fetchhelper";
import { MEMBER_INFO, PRESERVATION, TRANSFER,
   RETIREMENT, BENEFICIARY, EMPLOYER_DETAILS,
  MEMBER_DECLARATION, EMPLOYER_DECLARATION } from "../constants/constants";

Modal.setAppElement("#root");

const mandatoryPages = [MEMBER_INFO, EMPLOYER_DETAILS, MEMBER_DECLARATION, EMPLOYER_DECLARATION];

export class Preview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpenSubmit: false,
      isOpenPrint: false,
      loading: false
    };
  }

  componentDidMount() {
    const { previewPage } = this.props;
    previewPage && previewPage(this);
    if(this.props.values.claimOption === 'In-Fund Preservation') {
      mandatoryPages.push(PRESERVATION, BENEFICIARY);
    } else if (this.props.values.claimOption === 'Transfer' || this.props.values.claimOption === 'Cash & Transfer' ) {
      mandatoryPages.push(TRANSFER);
    } else if (this.props.values.claimOption === 'Retirement' ) {
      mandatoryPages.push(RETIREMENT);
    }
    let missingPages = [];
    const { values: { savedPages }} = this.props;
    for(let i = 0; i < mandatoryPages.length; i++) {
      if(!savedPages[mandatoryPages[i]]) {
        missingPages.push(mandatoryPages[i])
      }
    }
    if(missingPages.length > 0) {
      this.props.handleMissingPages(missingPages)
    }
  }


  showModalSubmit() {
    this.setState({ isOpenSubmit: true });

  }

  validateToDisable() {
    if(this.props.is_form_submitted || this.props.values.userRole === "FA"){
      return true;
    } else if (this.props.missedPages.length > 0) {
      return true
    }
    return false;
  }

  setDynamicHeightToSection(section) {
    const dom = document.getElementById(section)
    if(dom.offsetHeight > 850) {
      dom.style.height = '1650px';
    } else {
      dom.style.height = '850px';
    }
  }

  showModalPrint() {
    this.setDynamicHeightToSection('section-2');
    this.setDynamicHeightToSection('section-6');
    this.setState({ isOpenPrint: true });
  }

  closeModal() {
    this.setState({ isOpenSubmit: false });
  }

  printDocument() {
    this.setState({ isOpenPrint: false, loading: true });
    $("html,body").scrollTop(0);
    const input = document.getElementById("preview");

    var doc = new jsPDF('p', 'pt', 'a4', true);

    const uninqueId = this.props.values.uuid;

    doc.html(input, {
      callback: function (doc) {
        var fileName = 'Notification_of_claim_Liberty_Corporate_Retirement_Fund_' + uninqueId + '.pdf';
        doc.save(fileName);
      }
    }).then(res => {
      this.setState({
        loading: false
      })
    });
  }

  submitDocument() {
    this.setDynamicHeightToSection('section-2');
    this.setDynamicHeightToSection('section-6');

    this.setState({ isOpenSubmit: false, loading: true });
    // scrollTop is required or rendered canvas for PDF is cutoff
    $("html,body").scrollTop(0);

    const input = document.getElementById("preview");

    var doc = new jsPDF('p', 'pt', 'a4');
    const uninqueId = this.props.values.uuid;
    let history = this.props.history;

    const _claimType = this.props.values.claimOption;
    const _fundName = this.props.values.fundName_e === null ? "[fundName]" : this.props.values.fundName_e;
    const _schemeNumber = this.props.values.fundNo_e === null ? "[fundNo]" : this.props.values.fundNo_e;
    const _memberName = this.props.values.firstName + " " + this.props.values.lastName;
    const _memberNumber = this.props.values.membershipNo === "" ? "[membershipNo]" : this.props.values.membershipNo;
    const allFields = this.props.values;
    const that  = this;
    doc.html(input, {
      callback: function(doc) {

        var fileName = 'Notification_of_claim_Liberty_Corporate_Retirement_Fund_' + uninqueId + '.pdf';

        var blob = doc.output('blob');
        var form = new FormData();
        form.append("blob", blob, fileName);


        fileUpload(uninqueId, form, (res) => {
          const mailApiBody = {
            claimType: _claimType,
            fundName: _fundName,
            schemeNumber: _schemeNumber,
            memberNumber: _memberNumber,
            memberName: _memberName
          }
          sendMail(uninqueId, mailApiBody, (res) => {
            console.log(res)
            that.setState({
              loading: false
            });
            history.push("/submit");
          })
          let body = {
            uuid: allFields.uuid,
            info: {...allFields, is_form_submitted: true}
          };
          saveDocument(body, () => {
          })
        })
      }
    }).then(res => {

    });
  }

  saveDocument = (e) => {
    e.preventDefault();
      this.nextPath("/save?uuid=" + this.props.values.uuid)
  }

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();

    var _nextPath = null;
    var _nav = null;

    if(this.props.values.userRole === "Member") {
      if(this.props.values.reasonForClaim === "Retirement") {
        _nextPath = "/documents";
        _nav = 13;
      }
      else {
        _nextPath = "/declaration";
        _nav = 11;
      }
    }

    if(this.props.values.userRole === "FA") {
      _nextPath = "/declarationEmp";
      _nav = 12;
    }

    if(this.props.values.userRole === "Employer") {
      _nextPath = "/documents";
      _nav = 13;
    }

    this.props.handleNav(_nav);
    this.nextPath(_nextPath);
  };

  nextPath(path) {
    this.props.history.push(path);
  }

  header = () => {
    return (
      <table className="allTable" style={{ marginBottom: "20px" }}>
        <tr>
          <td className="allCell noBorder">
            <p>
              <img src={previewLogo} style={{ width: "80px" }} />
            </p>
          </td>
          <td className="allCell noBorder">
            <p>
              Liberty Corporate – A division of Liberty Group Limited Reg. No.
              1957/002788/06
            </p>
            <p>An Authorised Financial Services Provider (Licence No. 2409)</p>
            <p>
              Libridge Building, 25 Ameshoff Street, Braamfontein, 2001 P O Box
              2094, Johannesburg 2000
            </p>
            <p>t: +27 (0)11 558 2999</p>
            <p>
              For claim forms: e{" "}
              <a href="mailto:lcb.customerservices@liberty.co.za">
                <u>lcb.customerservices@liberty.co.za</u>
              </a>
            </p>
            <p>
              For queries: e{" "}
              <a href="mailto:lc.contact@liberty.co.za">
                <u>lc.contact@liberty.co.za</u>
              </a>
              &nbsp;t +27 (0)11 694 5309
            </p>
          </td>
        </tr>
      </table>
    );
  };

  render() {
    const { values } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={10}
          needpagedata="true"
          style={{}}
        >
          <div id="preview" style={{ width: "600px", margin: '0 auto', border: 'none', fontSize: '9px' }}>
            {/* <div id="preview" style={{ width: "778px", margin: '0 auto', border: 'none' }}> */}
            {/* <div id="preview" style={{ width: "210mm", margin: '0 auto', border: 'none' }}> */}
           <div style={{ height: "850px" }}>
             <div style={{ height: '10px'}} />
            {this.header()}
            <table className="allTable" >
              <tr>
                <td className="allCell noBorder">
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    PAPERLESS CLAIM FORM
                  </p>
                </td>
              </tr>
            </table>
            <table className="allTable">
              <tr>
                <td className="allCell noBorder">
                  <p style={{ fontWeight: "bold" }}>
                    Please ensure that all the required information and benefit
                    payment instruction details are completed as accurately as
                    possible. Once Liberty commences with processing the claim
                    payment, the transaction may not be reversed.
                  </p>
                </td>
              </tr>
            </table>
            <table className="allTable">
              <tr>
                <td className="allCell">
                  <p style={{ fontStyle: "italic" }}>
                    We are required to share, collect and process your Personal
                    Information (PI). Your PI is collected and processed by our
                    staff, representatives or sub-contractors and we make every
                    effort to protect and secure your PI. You are entitled at
                    any time to request access to the information Liberty has
                    collected, processed and shared.
                  </p>
                </td>
              </tr>
            </table>
            <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>SECTION 1 - CLAIM INFORMATION</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel" style={{width: '50%'}}>
                  <p>
                    Are you completing this claim form as an Employer, FA, or
                    Member?
                  </p>
                </td>
                <td className="allCell">
                  <p>{values.userRole}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Reason for claim</p>
                </td>
                <td className="allCell">
                  <p>{values.reasonForClaim}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Option selected</p>
                </td>
                <td className="allCell">
                  <p>{values.claimOption}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>
                    If you have been a member of the fund for more than 12
                    months, you may be able to continue your life and/or
                    disability cover under an individual policy. Please select
                    appropriate option, kindly have a discussion with your
                    Financial Adviser.
                  </p>
                </td>
                <td className="allCell">
                  <p>{values.continueCover}</p>
                </td>
              </tr>
            </table>
            <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>SECTION 2 - MEMBER INFORMATION</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Name</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.firstName}&nbsp;
                    {values.lastName}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Membership number</p>
                </td>
                <td className="allCell">
                  <p>{values.membershipNo}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>SA ID number or Passport number</p>
                </td>
                <td className="allCell">
                  <p>{values.saidNumber}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Income tax number</p>
                </td>
                <td className="allCell">
                  <p>{values.incomeTaxNo}</p>
                </td>
              </tr>
              {/* <tr>
                <td className="allCell allLabel">
                  <p>Annual taxable income (R)</p>
                </td>
                <td className="allCell">
                  <p>{values.annualTaxableIncome}</p>
                </td>
              </tr> */}
              <tr>
                <td className="allCell allLabel">
                  <p>Phone</p>
                </td>
                <td className="allCell">
                  <p>({values.dialCode}) {values.phone}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Email</p>
                </td>
                <td className="allCell">
                  <p>{values.email}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Address</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.streetAddress}
                    <br />
                    {values.addressLine2}
                    <br />
                    {values.city}
                    <br />
                    {values.region}
                    <br />
                    {values.zip}
                    <br />
                    {values.country}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Name of the bank</p>
                </td>
                <td className="allCell">
                  <p>{values.selectedBank}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Universal code</p>
                </td>
                <td className="allCell">
                  <p>{values.bankCode}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Account number</p>
                </td>
                <td className="allCell">
                  <p>{values.accNo}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Account holder</p>
                </td>
                <td className="allCell">
                  <p>{values.accHolder}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Account type</p>
                </td>
                <td className="allCell">
                  <p>{values.accType}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell" colSpan="2">
                  <p style={{ fontWeight: 'bold' }}>
                    Important
                  </p>
                  <p>
                    &#10003; Payment will not be made into a 3rd party’s account.
                  </p>
                  <p>
                    &#10003; Liberty will not make payment by cheque.
                  </p>
                  <p>
                    &#10003; Benefits are payable in South African Rands only.
                  </p>
                  <p>
                    &#10003; It is
                    the member’s responsibility to arrange the transfer of their
                    funds outside South Africa.
                  </p>
                </td>
              </tr>
            </table>
           </div>

           <div id='section-2'>
            {this.header()}
             <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>SECTION 3 - CLAIMS AGAINST THE MEMBER’S BENEFIT</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Claim against your benefit</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.claims}
                  </p>
                </td>
              </tr>

              <tr>
                <td className="allCell allLabel">
                  <p>Amount of the divorce order (R)</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.amtDivorce}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>%age claimed for divorce order</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.amtDivorcePercentage}%
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Amount of the maintenance order (R)</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.amtMaintenance}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>%age claimed for maintenance order</p>
                </td>
                <td className="allCell">
                  <p>
                    {values.amtMaintenancePercentage}%
                  </p>
                </td>
              </tr>
              {/* <tr>
                <td className="allCell allLabel">
                  <p>Supporting documents</p>
                </td>
                <td className="allCell">
                  <p>

                  </p>
                </td>
              </tr> */}
            </table>
             <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="4">
                  <p>SECTION 4 - IN–FUND PRESERVATION FOR BENEFIT</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>
                    Does the member wish to retain (i.e., preserve) the benefit
                    within the Fund?
                  </p>
                </td>
                <td className="allCell" colSpan="3">
                  <p>
                    {values.preserveBenefit}
                  </p>
                </td>
              </tr>

              <tr>
                <td className="allCell allLabel" colSpan="4">
                  <p>
                    <strong style={{ fontWeight: "bold", color: "black" }}>
                      Terms and conditions
                    </strong>
                  </p>
                  <br />
                  <p>
                    Under this option, the member's benefit will be retained in
                    the Fund and remain invested in the current investment
                    portfolio selections.
                  </p><br />
                  <p>
                    However, for members of the Liberty
                    Corporate Selection Umbrella Funds, please indicate in
                    Investment portfolio selection below, the member's
                    selection of investment portfolio(s) into which the benefits
                    are to be invested. Please select the column next to the
                    portfolio name and indicate the desired % of the benefit to
                    be invested in that particular portfolio.The total % across
                    all portfolios selected must sum up to 100%. If no selection
                    is made in Investment portfolio selection then the member's
                    benefit will be fully invested into one of the Default
                    Investment Portfolios selected by the Board of Trustees of
                    the Fund.
                  </p><br />
                  <p>
                    For members of the Liberty Corporate Selection
                    Umbrella Funds only - if a Financial Adviser has been
                    appointed by the member as their personal adviser, please
                    complete financial adviser section below.
                  </p>
                </td>

              </tr>
              <tr>
                <td className="allCell" colSpan="4">
                  <p>I accept the terms and conditions.</p>
                </td>
              </tr>
              {/* <tr>
                <td className="allCell signature" colSpan="4">
                  <p>Signature</p>
                  <img style={{width: "50%"}} src={values.preserveMemberSignature}></img>
                </td>
              </tr> */}
              <tr>
                <td className="allCell sectionHeader" colSpan="4">
                  <p>Investment portfolio selection</p>
                </td>
              </tr>
              <tr>
                {/* <th className="allCell tableHeader">
                  <p>Fund Type</p>
                </th> */}
                <th className="allCell tableHeader" style={{width: '50%'}}>
                  <p>Fund Name</p>
                </th>
                <th className="allCell tableHeader" style={{textAlign: 'center'}}>
                  <p>Investment Manage Fee</p>
                </th>
                <th className="allCell tableHeader" style={{textAlign: 'center'}}>
                  <p>% Invested</p>
                </th>
              </tr>
              {values.portfolio.map((item, index) => (
                <tr key={index}>
                  {/* <td className="allCell"><p>{item.fundType}</p></td> */}
                  <td className="allCell" style={{width: '50%'}}><p>{item.fundName}</p></td>
                  <td className="allCell" style={{textAlign: 'center'}}><p>{item.fee}</p></td>
                  <td className="allCell" style={{textAlign: 'center'}}><p>{item.allocation}%</p></td>
                </tr>
              ))}
              <tr>
                <td className="allCell" colSpan="4">
                  <p style={{ color: "red" }}>
                    <strong style={{ fontWeight: "bold", color: "black" }}>
                      Declaration
                    </strong>
                  </p>
                  <p>
                    <strong style={{ fontWeight: "bold", color: "black" }}>
                      (This declaration is only required if no financial adviser
                      has been appointed by the member. Else, please refer to
                      below section.)
                    </strong>
                  </p>
                  <br />
                  <p>
                    I acknowledge that by selecting "Yes" for In fund
                    preservation and by not completing below (Financial Adviser)
                    section, I am declaring that I shall be an in-fund Deferred
                    Retiree or Preserver Member of the Fund without a financial
                    adviser and without investment advice.
                  </p>
                </td>
              </tr>
              <tr>
                <td className="allCell" colSpan="4">
                  <p>I accept the Terms and Conditions.</p>
                </td>
              </tr>
            </table>
            </div>

            <div style={{ height: "850px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="4">
                    <p>Principal financial adviser</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Would you like to opt for a financial adviser</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.optForFA}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell allLabel">
                    <p>Name of principal financial adviser</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faFirstName}&nbsp;{values.faLastName}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell allLabel">
                    <p>Principal financial adviser’s Liberty 13-digit code</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faLibertyCode}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Telephone number of principal adviser</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faPhone}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Email address of principal adviser</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faEmail}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>FSP practice name</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faFspPracticeName}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>FSP practice number</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faFspPracticeNo}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Initial investment advice fee of principal adviser</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faInitAdviceFee}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>
                      Annual ongoing investment advice fee of principal adviser (%
                      of benefit as per the member agreement)
                    </p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.faOngoingAdviceFee}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell sectionHeader" colSpan="4">
                    <p>Other related financial adviser</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Name</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.otherFaFirstName}&nbsp;{values.otherFaLastName}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell allLabel">
                    <p>Liberty 13-digit code</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.otherFaLibertyCode}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell allLabel">
                    <p>Initial investment advice fee</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.otherFaInitAdviceFee}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Annual ongoing investment advice fee</p>
                  </td>
                  <td className="allCell" colSpan="3">
                    <p>
                      {values.otherFaOngoingAdviceFee}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell sectionHeader" colSpan="4">
                    <p>FA Declaration</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="4">
                    <p>
                      <p>
                        I declare that I am registered to market Retail Pension
                        benefits under the Financial Advisory and Intermediary
                        Services Act, No. 37 of 2002 and accept the consequences
                        of the Act.
                      </p>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel" colSpan="4">
                    <p>I accept the Terms and Conditions.</p>
                  </td>

                </tr>

                <tr>
                  <td className="allCell signature" colSpan="4">
                    <p>
                      <p>Signature</p>
                      <img style={{ width: "50%" }} src={values.preserveFaSignature}></img>
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="4">
                    <p>Member's Declaration</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="4">
                    <p>
                      1. I understand that I may at any time instruct Liberty to
                      stop deducting or facilitating the payment of any future
                      ongoing advice fee, or I may at any time instruct Liberty to
                      change the amount of any ongoing fee or pay any future
                      ongoing fee to Liberty or to another financial adviser..
                    </p>
                    <p>
                      2. I understand that any ongoing advice fees agreed to in
                      this mandate may continue to be paid where the financial
                      adviser moves between distribution channels or authorised
                      financial services providers, provided that the financial
                      adviser or financial services provider is contracted with
                      Liberty and appropriately accredited in terms of prevailing
                      legislation.
                    </p>
                    <p>
                      3. I understand that this mandate will be automatically
                      renewed on an annual basis unless I instruct Liberty to
                      cancel it.
                    </p>
                    <p>
                      4. I understand that these fees will be deducted from the
                      investment value of my policy and will therefore reduce the
                      value of my investment accordingly.
                    </p>
                    <p>
                      5. I understand that my financial adviser may work in a
                      Liberty approved team and any advice fee deducted may be
                      shared with the team.
                    </p>
                    <p>
                      6. I understand that, if the financial adviser is part of a
                      Liberty approved team and the financial adviser is for any
                      reason unable to receive the advisory fee, then the advice
                      fee will become payable to another adviser within the
                      approved team.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel " colSpan="4">
                    <p>I accept the Terms and Conditions.</p>
                  </td>

                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>SECTION 5 - TRANSFER TO ANOTHER FUND</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Would you like to transfer your asset?</p>
                  </td>
                  <td className="allCell">
                    <p>{values.transferTo === "provident_preservation_fund" ? "Liberty Agile Provident Preservation Fund" : ""}</p>
                    <p>{values.transferTo === "pension_preservation_fund" ? "Liberty Agile Pension Preservation Fund" : ""}</p>
                    <p>{values.transferTo === "other_fund" ? "Any other fund" : ""}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Enter %age of the amount you would like to withdraw via transfer</p>
                  </td>
                  <td className="allCell">
                    <p>{values.transferPercent}%</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Provider name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.providerName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Fund name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.fundName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Administrator/Insurer name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.adminName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>SARS approval number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.sarsApprovalNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>FSCA registration number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.fscaRegnNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Contact person’s name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.contactPersonName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Contact person's email</p>
                  </td>
                  <td className="allCell">
                    <p>{values.contactPersonEmail}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Contact person’s telephone/cell phone</p>
                  </td>
                  <td className="allCell">
                    <p>{values.contactPersonPhone}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>Bank account details for receiving the fund</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account holder</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accHolder_t}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Name of the bank</p>
                  </td>
                  <td className="allCell">
                    <p>{values.selectedBank_t}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Universal code</p>
                  </td>
                  <td className="allCell">
                    <p>{values.bankCode_t}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accNo_t}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Branch name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.branchName_t}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account type</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accType_t}</p>
                  </td>
                </tr>
              </table>
            </div>

            <div id={'section-6'}>
              {this.header()}
              <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="4">
                  <p>SECTION 6 - BENEFICIARY DETAILS</p>
                </td>
              </tr>
              <tr>
                <td className="allCell" colSpan="4">
                  <p>
                    <strong style={{ fontWeight: "bold" }}>Please note:</strong>{" "}
                    S37C of the Pension Funds Act, No. 24 of 1956 ("the Act")
                    places a duty on the Board of Trustees of both the Agile
                    Preserver Pension Plan and the Agile Preserver Provident
                    Plan to distribute the benefits equitably among dependants
                    and nominees, taking into account a variety of factors
                    including their financial dependency on the deceased member
                    before death. Your nomination of beneficiaries below will
                    assist the Board in the distribution decision. It is
                    recommended that you review/amend your beneficiary
                    nominations regularly as your circumstances change. This can
                    be done by completing a Beneficiary Nomination Form at any
                    time.
                  </p>
                </td>
              </tr>
              <tr>
                <th className="allCell tableHeader">
                  <p>Full name</p>
                </th>
                <th className="allCell tableHeader">
                  <p>ID number</p>
                </th>
                <th className="allCell tableHeader">
                  <p>Relationship to deceased member</p>
                </th>
                <th className="allCell tableHeader">
                  <p>Split %</p>
                </th>
              </tr>

              {values.beneficiary.map((item, index) => (
                <tr key={index}>
                  <td className="allCell"><p>{item.name}</p></td>
                  <td className="allCell"><p>{item.id}</p></td>
                  <td className="allCell"><p>{item.relation}</p></td>
                  <td className="allCell"><p>{item.percentage}%</p></td>
                </tr>
              ))}


              <tr>
                <td className="allCell" colSpan="4">
                  <p>
                    Total = {values.beneficiary.length > 0 ? "100%" : "Not Applicable"}
                  </p>
                </td>
              </tr>
            </table>
              <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>SECTION 7 - TAKE A CASH LUMP SUM</p>
                </td>
              </tr>
              {/* <tr>
                <td className="allCell allLabel">
                  <p>Would like to receive the amount in cash?</p>
                </td>
                <td className="allCell">
                  <p></p>
                </td>
              </tr> */}
              <tr>
                <td className="allCell allLabel">
                  <p>Enter the percentage</p>
                </td>
                <td className="allCell">
                  <p>{values.cashPercent}%</p>
                </td>
              </tr>
            </table>
              <table className="allTable">
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>SECTION 8 - RETIREMENT</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>
                    The member is to retire in terms of the following provisions
                    of the rules
                  </p>
                </td>
                <td className="allCell">
                  <p>{values.reasonForRetirement === 'attain_of_normal_retirement_age' ? 'Attain of normal retirement age' : ''}</p>
                  <p>{values.reasonForRetirement === 'early_retirement_with_consent_of_the_employer' ? 'Early retirement with consent of the employer' : ''}</p>
                  <p>{values.reasonForRetirement === 'early_retirement_due_to_ill_health' ? 'Early retirement due to ill health (Medical evidence will be required)' : ''}</p>
                  <p>{values.reasonForRetirement === 'late_retirement' ? 'Late retirement' : ''}</p>
                </td>
              </tr>
              {/* <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>Employer details</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Company payee reference number</p>
                </td>
                <td className="allCell">
                  <p></p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Company payee contact person’s name</p>
                </td>
                <td className="allCell">
                  <p></p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>Company payee contact person’s phone number</p>
                </td>
                <td className="allCell">
                  <p></p>
                </td>
              </tr> */}
              <tr>
                <td className="allCell sectionHeader" colSpan="2">
                  <p>Retirement Benefit Commutation</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>
                    Do you wish to be paid a portion of the retirement benefit
                    for cash?
                  </p>
                </td>
                <td className="allCell">
                  <p>{values.benefitForCash}</p>
                </td>
              </tr>
              <tr>
                <td className="allCell allLabel">
                  <p>If “Yes”, what portion? (Enter percentage)</p>
                </td>
                <td className="allCell">
                  <p>{values.benefitForCashPercent}%</p>
                </td>
              </tr>

            </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>Pension/Annuity Details</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="2">
                    <p style={{ color: "#111" }}>
                      When selecting full or partial purchase of annuities, you
                      have the option of buying one or more of the annuities
                      offered by Liberty. Please contact your benefit counsellor
                      on 011558299 or email{" "}
                      <a href="mailto:lbenefitcounselling@liberty.co.za">
                        benefitcounselling@liberty.co.za
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Liberty default annuity offering</p>
                  </td>
                  <td className="allCell">
                    <p>{values.annuityOffering}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Percentage</p>
                  </td>
                  <td className="allCell">
                    <p>{values.annuityOfferingPercent}%</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Proposal number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.proposalNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Other annuity offerings / providers</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuity}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Percentage</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityPercent}%</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Proposal number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityProposalNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>For "Other annuity offerings / providers", please complete below</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Name of the policy</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityPolicyName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Annuity policy number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityPolicyNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Contact name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityContactName}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Contact number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityContactNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Email</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityEmail}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Insurance company</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityInsuranceCo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>FSCA registration number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityFscaRegNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>FSP number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityFspNo}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Commencement of policy</p>
                  </td>
                  <td className="allCell">
                    <p>{values.otherAnnuityCommencementDate === null ? '' : Moment(values.otherAnnuityCommencementDate).format('DD/MM/yyyy')}</p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>SECTION 9 - EMPLOYER DETAILS & DEDUCTIONS</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Fund type</p>
                  </td>
                  <td className="allCell">
                    <p>{values.fundType_umbrellaProvident_e ? 'UMBRELLA PROVIDENT' : ''}</p>
                    <p>{values.fundType_umbrellaPension_e ? 'UMBRELLA PENSION' : ''}</p>
                    <p>{values.fundType_standAlone_e ? 'STAND ALONE' : ''}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Fund name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.fundName_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Employee /Payroll ref Number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.employeeRefNo_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Fund number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.fundNo_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Date of exit</p>
                  </td>
                  <td className="allCell">
                    <p>{values.dtWithdrawal_e === null ? '' : Moment(values.dtWithdrawal_e).format('DD/MM/yyyy')}</p>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>Claims against benefit</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Selected option(s)</p>
                  </td>
                  <td className="allCell">
                    <p>{values.claims_none_e ? "None" : ""}</p>
                    <p>{values.claims_hl_e ? "Housing Loan" : ""}</p>
                    <p>{values.claims_damages_e ? "Damages" : ""}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Document(s) included</p>
                  </td>
                  <td className="allCell">
                    <p>{values.docs_writtenAdmission_e ? "Written Admission" : ""}</p>
                    <p>{values.docs_courtOrder_e ? "Court order" : ""}</p>
                    <p>{values.docs_caseNo_e ? "Case number" : ""}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Amount being claimed (R)</p>
                  </td>
                  <td className="allCell">
                    <p>{values.amountClaimed_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>Employer Bank Details</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account holder</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accountHolder_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Bank name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.bankName_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Universal code</p>
                  </td>
                  <td className="allCell">
                    <p>{values.universalCode_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Branch name</p>
                  </td>
                  <td className="allCell">
                    <p>{values.branchName_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account number</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accountNo_e}</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel">
                    <p>Account type</p>
                  </td>
                  <td className="allCell">
                    <p>{values.accountType_e}</p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>SECTION 10 - DECLARATION BY MEMBER</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="2">
                    <p>
                      <strong style={{ fontWeight: "bold", color: "black" }}>
                        Member acknowledgement{" "}
                      </strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="2">
                    <p>
                      <p>I acknowledge:</p>
                      <p>
                        1. The personal information that I have provided to
                        Liberty in this form is correct.
                      </p>
                      <p>
                        2. The information provided by me shall be subject to the
                        rules of the Fund and the terms and conditions of the
                        policy and any relevant regulatory authority
                      </p>
                      <p>
                        3. I shall be responsible for sending this form back to
                        Liberty or to the financial adviser's office with my
                        signature and contact details.
                      </p>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel ">
                    <p>I accept the Terms and Conditions.</p>
                  </td>
                  <td className="allCell">
                    <p>
                      {values.fundAuthName}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell">
                    <p>Date</p>
                  </td>
                  <td className="allCell">
                    <p>{values.dtDeclaration}</p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell signature" colSpan="2">
                    <p>
                      <p>Signature</p>
                      <img style={{ width: "50%" }} src={values.signature}></img>
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>SECTION 11 - DECLARATION BY EMPLOYER</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="2">
                    <p>
                      <strong style={{ fontWeight: "bold", color: "black" }}>
                        Employer acknowledgement{" "}
                      </strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell" colSpan="2">
                    <p>
                      <p>I acknowledge:</p>
                      <p>
                        1. The personal information that I have provided to
                        Liberty in this form is correct.
                      </p>
                      <p>
                        2. The information provided by me shall be subject to the
                        rules of the Fund and the terms and conditions of the
                        policy and any relevant regulatory authority
                      </p>
                      <p>
                        3. I shall be responsible for sending this form back to
                        Liberty or to the financial adviser's office with my
                        signature and contact details.
                      </p>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell allLabel ">
                    <p>I accept the Terms and Conditions.</p>
                  </td>
                  <td className="allCell">
                    <p>
                      {values.fundAuthName_emp}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell">

                    <p>Date </p>

                  </td>
                  <td className="allCell">
                    <p>
                      {values.dtDeclaration_emp}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell signature" colSpan="2">
                    <p>
                      <p>Signature</p>
                      <img style={{ width: "50%" }} src={values.signature_emp}></img>
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td
                    className="allCell noBorder"
                    style={{ borderBottom: "1px solid #111" }}
                  >
                    <p style={{ fontWeight: "500px", fontSize: "20px" }}>
                      PLEASE READ AND UNDERSTAND YOUR OPTIONS
                    </p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "20px",
                        color: "#00164e",
                        borderBottom: "2px solid #111",
                        width: "110px",
                      }}
                    >
                      Withdrawals
                    </p>
                    <p>
                      Most members leave funds through resignation, dismissal or
                      retrenchment. The rules of the pension or provident fund set
                      out in detail the various options available to a member on
                      termination of membership. The summary below is intended
                      only to give a member an overview of the various benefits
                      and options to which the member may be entitled so that the
                      member can make an informed choice with regard to the
                      benefits. We strongly recommend that money accumulated for
                      retirement should be preserved whenever possible. Experience
                      shows that once money allocated for retirement is taken in
                      the form of cash, it is very rarely replaced at a later
                      stage. The following options are generally available
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Cash Benefit :{" "}
                      </strong>{" "}
                      Taking the benefit in cash The implications of taking a cash
                      benefit on withdrawal are that the tax-free amount
                      (currently, R25 000, per life time, plus the member’s own
                      contributions not previously allowed as a deduction) has
                      been exceeded, the remaining benefit will be subject to tax.
                      Clearly, a cash payment means that money set aside for
                      retirement may be used for other purposes, resulting in the
                      member having insufficient funds to live on after
                      retirement. Lump sum withdrawals due to the member being
                      retrenched or made redundant (voluntary or involuntary) are
                      taxed in the same manner as a retirement claim (currently,
                      R500 000, per life time, plus the member’s own contributions
                      not previously allowed as a deduction). However, this tax
                      relief is not available to a taxpayer who was, at any time,
                      a director of the employer company and at the time held more
                      than 5% of the issued share capital or member’s interest in
                      that company.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Transfer your Benefit:{" "}
                      </strong>{" "}
                      Transferring the benefit to a fund operated by the member’s
                      new employer It is usually possible to transfer the benefit
                      to a fund operated by the member’s new employer. Not only
                      will such a transfer be free of tax (unless it is a pension
                      to provident fund transfer) but the benefit will be held to
                      the member’s credit under the member’s new employer’s fund.
                      Here it will earn investment income until such time the
                      member retires or leaves the new fund. Please note, if
                      transferring to another fund/participating employer
                      administered by Liberty Corporate and individual member
                      choice is allowed, the member must complete a new investment
                      portfolio selection form.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Transfer Benefit to Retirement Annuity:{" "}
                      </strong>{" "}
                      Transferring the benefit to a retirement annuity or
                      preservation plan This option is similar to transferring the
                      benefit to a fund operated by the member’s new employer
                      described above, with the difference being that the money is
                      held in the member’s own individual investment plan. In the
                      case of a retirement annuity, up to one-third of the final
                      amount accumulated can be taken at retirement in the form of
                      cash, subject to tax at that time. The balance of the
                      proceeds must be taken in the form of a pension that will be
                      subject to tax. Note that the earliest age at which the
                      member may retire from a retirement annuity is 55. The
                      difference between a preservation plan and a retirement
                      annuity is that one withdrawal may be made from a
                      preservation plan prior to retirement (depending on
                      accessibility) to meet any unexpected financial needs.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Continuation Option:{" "}
                      </strong>
                      Death and disability benefit continuation option Where this
                      is offered, a member who has been on the fund for more than
                      12 months may, within 60 days of leaving service, exercise
                      an option to take out an individual policy without evidence
                      of health. However, a Cotinine test may be required to
                      confirm smoker status. In this way the member can continue
                      valuable life cover (and disability cover where applicable),
                      at his/her own expense.{" "}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Preservation :{" "}
                      </strong>{" "}
                      Preserving the benefit within the fund When members leave
                      their employer from 1 March 2019, they have the option to
                      preserve their benefits within the fund. On this option, no
                      cash payment will be made to a member on withdrawal.
                      Instead, their accumulated withdrawal and retirement savings
                      will continue to be invested inside the fund. Members of the
                      Liberty Corporate Selection Umbrella Funds will be required
                      to choose their investment portfolio(s) into which their
                      preservation benefits will be invested. This is done by
                      completing preservation section of this form. If no
                      selection is made, then the member's preservation benefit
                      will be placed in one of the Default Investment Portfolios
                      selected by the Trustees of the Liberty Corporate Selection
                      Umbrella Funds. The member can choose to change this
                      investment portfolio selection at a future date by
                      completing an investment switch form. For members of other
                      retirement funds, the underlying investment portfolio will
                      be the same investment portfolio that the member was
                      invested in before becoming a preserved member, or as guided
                      by the Rules of the Fund. Whilst being a Deferred Retiree or
                      Preserver Member in the Fund, the member will continue to
                      have access to investment portfolios at institutional rates.
                      Depending on the investment portfolio selection, these rates
                      are typically lower than that of a preservation offering
                      outside the Fund. When the member reaches retirement, the
                      member can ask for the Preserver Benefit to be paid out
                      according to prevailing legislation and relevant pay-out
                      options at that time.
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "20px",
                        color: "#00164e",
                        borderBottom: "2px solid #111",
                        width: "110px",
                      }}
                    >
                      Retirement
                    </p>
                    <p>
                      Liberty strongly recommends that members seek professional
                      advice before retiring. It is important that the member
                      discuss the following options with their financial adviser
                      before making a decision on which option is suitable for
                      his/her needs. These options are generally available on
                      retirement, irrespective of whether retirement takes place
                      at normal retirement date, or at an earlier or later date.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p style={{ color: "#00164e", fontWeight: "bold" }}>
                      Please note that any request for reversal and reprocessing
                      of a claim will result in an ad-hoc administration fee being
                      charged.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Taking a portion of the retirement benefit in cash :{" "}
                      </strong>{" "}
                      In the case of retirement from a provident fund, the member
                      may decide to take the full benefit in cash. If the member
                      is retiring from a pension fund, up to one-third of the full
                      benefit may be taken as a cash lump sum, and the balance
                      will have to be taken in the form of a monthly pension
                      (annuity). The member will receive a portion of the lump sum
                      commutation free of tax provided that the member has not
                      previously taken a lump sum – refer to latest tax tables
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Taking a portion of the retirement benefit as a monthly
                        pension (annuity) :{" "}
                      </strong>{" "}
                      On retiring from a provident or pension fund, the member may
                      choose to take all or part of their retirement benefit as a
                      monthly pension (annuity).
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p> There are two ways of doing this:</p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      {" "}
                      Purchasing a voluntary purchase annuity from a registered
                      Insurer. The advantage here is that only a portion of the
                      monthly pension is subject to tax.
                    </p>
                    <p>
                      • Selecting a compulsory purchase annuity with the full
                      pre-tax proceeds available at retirement. The resulting
                      monthly income is taxable in full. Various forms of
                      annuities can be selected according to the member’s needs,
                      for example:
                    </p>
                    <p>
                      • Is there a requirement to make provision for a spouse or
                      other dependants if the member dies after retirement?
                    </p>
                    <p>
                      • Will there be a requirement to verify the minimum period
                      for which the annuity will be paid irrespective of whether
                      the member survives to the end of that period?
                    </p>
                    <p>
                      • Will the member want the annuity to increase each year to
                      offset inflation?
                    </p>
                    <p>
                      • Will the member want to take advantage of a Living Annuity
                      where income may be varied and the residual capital on death
                      may be made available to dependants?
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      {" "}
                      Annuities to meet all these requirements are freely
                      available and we suggest that the member seeks advice from
                      his/her financial adviser
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Mix of cash and annuity :{" "}
                      </strong>{" "}
                      The member may take benefits as a mixture of cash and a
                      compulsory purchase annuity. The proportions selected can be
                      chosen at the member’s discretion (a maximum of 1/3 in cash
                      from a pension fund). Through careful selection, the member
                      can structure their retirement benefits to suit their needs
                      in the most tax-effective manner.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Deferred retirement:{" "}
                      </strong>{" "}
                      From 1 March 2015, a member may elect when to receive their
                      retirement benefit from the fund if the rules of the fund
                      allow this. This election is only available once the member
                      has reached normal retirement age. This means that the
                      retirement will no longer be deemed to accrue when the
                      member retires from his/ her employer. The date of accrual
                      of the retirement benefit (used for tax purposes) will be
                      the date that the member to receive his/her retirement
                      benefit. We will update the fund records accordingly. Should
                      the member wish to defer receipt of their retirement benefit
                      they need to complete the Retirement Deferral Form. Members
                      who would like to defer their retirement should notify
                      Liberty Corporate timeously of any changes to their contact
                      information. This will enable us to send on-going fund and
                      benefit related information directly to the deferred
                      retiree.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Actual retirement benefits
                    </p>
                    <p>
                      The actual retirement benefit that will become payable to
                      each member, will be a result of the combination of actual
                      investment returns earned, membership duration and the
                      actual contribution made in the period of membership. Please
                      refer to illustrative benefits reflected on any member
                      benefit statement.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Financial Advisory and Intermediary Services Act 37, 2002
                    </p>
                    <p>
                      The FAIS legislation was introduced for your protection
                      against the possibility of receiving inappropriate advice
                      regarding your financial needs. Please ensure that your
                      financial adviser is duly licensed under the FAIS Act and
                      provides you with a written record of the advice given to
                      you. Your financial adviser is obliged to fully disclose any
                      material information pertaining to the product, the product
                      supplier and his/her relationship with the product supplier.
                      In terms of this legislation, your financial adviser must
                      ensure that all the necessary steps have been taken to place
                      you in position to make an informed decision in respect of
                      your retirement fund benefit.
                    </p>
                  </td>
                </tr>

              </table>
            </div>

            <div style={{ height: "840px" }}>
              {this.header()}
              <table className="allTable">

                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Protection of Personal Information Act 4, 2013
                    </p>
                    <p>
                      We are required to share, collect and process your Personal
                      Information (PI). Your PI is collected and processed by our
                      staff, representatives or sub-contractors and we make every
                      effort to protect and secure your PI. You are entitled at
                      any time to request access to the information Liberty has
                      collected, processed and shared. Errors and omissions are
                      excluded. The information contained in this document does
                      not constitute financial, tax, legal or accounting advice by
                      Liberty. Any legal, technical or product information
                      contained in this document is subject to change from time to
                      time. If there are any discrepancies between this document
                      and the contractual terms or, where applicable, any fund
                      rules, the latter will prevail. Any recommendations made
                      must take into consideration your special needs and unique
                      circumstances. Liberty Group Ltd is an Authorised Financial
                      Services Provider in terms of the FAIS Act (no. 2409). ©
                      Liberty Group Ltd. All rights reserved.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Important note
                    </p>
                    <p>
                      A natural person will be regarded as a ‘foreign person’ if:
                    </p>
                    <p>
                      • He or she is not ‘ordinarily resident in South Africa; or
                    </p>
                    <p>
                      • He or she has not been physically present in South Africa
                      for a period of 91 days in aggregate in a tax year as well
                      as for a period of 91 days in aggregate of the preceding
                      five tax years and for a period exceeding 916 days in
                      aggregate during those five preceding tax years; or
                    </p>
                    <p>
                      • He or she has been physically outside South Africa for a
                      continuous period of at least 330 full days Our business
                      success revolves around our ability to pay members their
                      benefits at a time when they need it most. Our service level
                      agreement for the payment of defined contribution retirement
                      claims is ten working days from the receipt of all
                      requirements.
                    </p>
                    <p>
                      However, we are often unable to meet our service obligations
                      when we do not receive all the requirements we need, to
                      successfully finalise payment. We will not be held liable
                      for any loss or damages that a member may suffer as a result
                      of our failure to process and pay a claim within the agreed
                      timelines if the delay was (is) caused by a member
                      failing/neglecting to satisfy all the requirements necessary
                      to finalise payment. This includes, but is not limited to a
                      member's failure to provide us with all relevant information
                      or documentation, or complete the forms accurately and
                      completely.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Financial Advisory and Intermediary Services Act, No. 37 of
                      2002 ("FAIS")
                    </p>
                    <p>
                      The FAIS legislation was introduced for members' protection
                      against the possibility of receiving inappropriate advice
                      regarding their financial needs. A member must ensure that
                      their financial adviser is duly licensed under the FAIS Act
                      and provides them with a written record of the advice given
                      to them. A Member's financial adviser is obliged to fully
                      disclose any material information pertaining to the product,
                      the product supplier and their relationship with the product
                      supplier. In terms of this legislation, a member's financial
                      adviser must ensure that all the necessary steps have been
                      taken to place the member in a position to make an informed
                      decision in respect of their withdrawal or retirement
                      benefit.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p
                      style={{
                        fontWeight: "500px",
                        fontSize: "17px",
                        color: "#00164e",
                      }}
                    >
                      Protection of Personal Information Act, No. 4 of 2013
                    </p>
                    <p>
                      We are required to share, collect and process your Personal
                      Information (PI). Your PI is collected and processed by our
                      staff, representatives or sub-contractors and we make every
                      effort to protect and secure your PI. You are entitled at
                      any time to request access to the information Liberty has
                      collected, processed and shared. Errors and omissions are
                      excluded. The information contained in this document does
                      not constitute financial, tax, legal or accounting advice by
                      Liberty. Any legal, technical or product information
                      contained in this document is subject to change from time to
                      time. If there are any discrepancies between this document
                      and the contractual terms or, where applicable, any fund
                      rules, the latter will prevail. Any recommendations made
                      must take into consideration your special needs and unique
                      circumstances. Liberty Group Ltd is an Authorised Financial
                      Services Provider in terms of the FAIS Act (No. 2409). ©
                      Liberty Group Ltd. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </div>

            <div >
              {this.header()}
              <table className="allTable">
                <tr>
                  <td className="allCell sectionHeader" colSpan="2">
                    <p>Contact us</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      Please <strong style={{ fontWeight: "bold" }}>ONLY</strong>{" "}
                      contact us if you have not received payment within this
                      timeframe.{" "}
                    </p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td
                    className="allCell sectionHeader"
                    colSpan="2"
                    style={{ background: "#958e8e" }}
                  >
                    <p>Queries</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      For more information, please contact your accredited Liberty
                      Financial Adviser, or the Liberty Corporate support centre:
                    </p>
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Liberty Corporate Contact Centre
                      </strong>
                    </p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:lc.contact@liberty.co.za">
                        lc.contact@liberty.co.za
                      </a>
                    </p>
                    <p>Tel number: +27 (0)11 558 2999</p>
                    <p>Fax number: +27 (0)11 408 2264</p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td
                    className="allCell sectionHeader"
                    colSpan="2"
                    style={{ background: "#958e8e" }}
                  >
                    <p>Benefit counselling</p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>For benefit counselling, please contact us:</p>
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Liberty Corporate Benefit Counselling
                      </strong>
                    </p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:benefitcounselling@liberty.co.za">
                        benefitcounselling@liberty.co.za
                      </a>
                    </p>
                    <p>Tel number: +27 (0)11 558 2999</p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td
                    className="allCell sectionHeader"
                    colSpan="2"
                    style={{ background: "#958e8e" }}
                  >
                    <p>Complaints</p>
                  </td>
                </tr>
                <tr></tr>
                <tr>
                  <td class="allCell" colspan="2">
                    <p>
                      Our complaints handling procedure is available on our
                      website <a href="www.liberty.co.za">(www.liberty.co.za)</a>,
                      or we can send it to you on request. Complaints should be
                      directed in writing to:
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        The Complaints Resolution Manager
                      </strong>
                    </p>
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        Liberty Corporate
                      </strong>
                    </p>
                    <p>PO Box 2094, Johannesburg, 2000</p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:lc.contact@liberty.co.za">
                        lc.contact@liberty.co.za
                      </a>
                    </p>
                    <p>Tel number: +27 (0)11 408 2771</p>
                    <p>Tel number: +27 (0)11 694 5304</p>
                  </td>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        For Liber8 and Liberty Corporate Selection Suite of
                        Umbrella Funds
                      </strong>
                    </p>
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        The Principal Executive Officer
                      </strong>
                    </p>
                    <p>PO Box 2094, Johannesburg, 2000</p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:roger.spence@liberty.co.za">
                        roger.spence@liberty.co.za
                      </a>
                    </p>
                    <p>Tel number: +27 (0)11 408 5685</p>
                  </td>
                </tr>

                <tr>
                  <td class="allCell" colspan="2">
                    <p>
                      If the complaint is not resolved to your satisfaction by
                      Liberty, you may contact one of the legislative bodies that
                      have been tasked to look after your interests a customer.
                      Please note that if a complaint is formally logged with
                      Liberty Corporate using our complaints process, a reference
                      number will be provided.
                    </p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td
                    className="allCell sectionHeader"
                    colSpan="2"
                    style={{ background: "#958e8e" }}
                  >
                    <p>For fund complaints</p>
                  </td>
                </tr>
                <tr></tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        The Pension Funds Adjudicator
                      </strong>
                    </p>

                    <p>PO Box 580, Menlyn, 0063</p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:enquiries@pfa.co.za">enquiries@pfa.co.za</a>
                    </p>
                    <p>Tel number: +27 (0)12 748 4000</p>
                    <p>Tel number: +27 (0)86 693 7472</p>
                  </td>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        The Ombudsman for Long-term insurance
                      </strong>
                    </p>

                    <p>Private Bag X45, Claremont, 7735</p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:info@ombud.co.za">info@ombud.co.za</a>
                    </p>
                    <p>Tel number: +27 (0)21 657 5000</p>
                    <p>Tel number: +27 (0)86 010 3236</p>
                    <p style={{ marginLeft: "66px" }}> +27 (0)21 657 5000</p>
                  </td>
                </tr>
              </table>
              <table className="allTable">
                <tr>
                  <td
                    className="allCell sectionHeader"
                    colSpan="2"
                    style={{ background: "#958e8e" }}
                  >
                    <p>For complaints regarding a Financial Advisers</p>
                  </td>
                </tr>
                <tr></tr>

                <tr>
                  <td className="allCell noBorder">
                    <p>
                      <strong style={{ fontWeight: "bold" }}>
                        FAIS Ombudsman
                      </strong>
                    </p>

                    <p>PO Box 74571, Lynnwood Ridge, 0010</p>
                    <p>
                      Email address:{" "}
                      <a href="mailto:info@faisombud.co.za">
                        info@faisombud.co.za
                      </a>
                    </p>
                    <p>Tel number: +27 (0)12 470 9080</p>
                    <p>Tel number: +27 (0)12 348 3447</p>
                  </td>
                </tr>

                <tr>
                  <td class="allCell" colspan="2">
                    <p>
                      The above process is our formal complaints process and a
                      reference number will always be provided. If you do not
                      receive a reference number for a complaint, please contact
                      the Complaints Resolution Manager using the contact details
                      above.
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={10}
          page_count={11}
          page_link_name="Page7"
          style={{}}
        >
          <li
            style={{ overflow: "visible", position: "relative" }}
            className="btnAllign fmFooter page"
            id="formAccess"
            elname={0}
          >
            <div className="pageFotDef">
              <div className="inlineBlock prevAlign" elname="back">
                <button
                  className="fmSmtButton next_previous navWrapper"
                  type="button"
                  elname="back"
                  onClick={this.back}
                >
                  <em> Back </em>
                </button>
              </div>

              <div className="alignNext">
                <div className="formRelative inlineBlock saveBtnCont">
                  <button
                    className="fmSmtButton saveColor saveBtn"
                    elname="save"
                    type="button"
                    onClick={this.saveDocument} title="Generate URL for this page"
                  >
                    <em>Share</em>
                  </button>
                </div>
                <div className="formRelative inlineBlock saveBtnCont">
                  <button
                    className="fmSmtButton saveColor saveBtn"
                    elname="submit"
                    type="button"
                    disabled={this.validateToDisable()}
                    onClick={() => this.showModalSubmit()} title="Submit this form"
                  >
                    <em>Submit</em>
                  </button>
                </div>
                <div className="inlineBlock nextAlign" elname="next">
                  <button
                    className="fmSmtButton saveColor saveBtn" style={{ width: '100px' }}
                    type="button"
                    elname="next"
                    onClick={() => this.showModalPrint()} title="Download this form"
                  >
                    <em> Download </em>
                  </button>

                </div>

                {/* <div className="inlineBlock nextAlign" elname="next">
                  <button
                    className="fmSmtButton next_previous navWrapper"
                    type="button"
                    elname="next"
                    onClick={() => this.toggleModal("Your claim form will be downloaded now. Please close this message to start the download.")}
                  >
                    <em> Open modal </em>
                  </button>
                </div> */}

                <Modal
                  isOpen={this.state.isOpenPrint}
                  onRequestClose={() => this.printDocument()}
                  contentLabel="Print"
                  className="myModal"
                  overlayClassName="myOverlay"
                >
                  <div style={{ textAlign: 'center' }}>
                    <div>Your claim form will be downloaded now. Please close this message to start the download.</div>
                    <button className="fmSmtButton saveColor saveBtn" style={{ marginTop: '20px' }} onClick={() => this.printDocument()}>Close</button>
                  </div>
                </Modal>

                <Modal
                  isOpen={this.state.isOpenSubmit}
                  onRequestClose={() => this.closeModal()}
                  contentLabel="Submit"
                  className="myModal"
                  overlayClassName="myOverlay"
                >
                  <div style={{ textAlign: 'center' }}>
                    <div>Please make sure all information provided in the form is correct. Click Yes to submit the form. Click No to go back and make changes in the form.</div>
                    <button className="fmSmtButton saveColor saveBtn" style={{ marginTop: '20px' }} onClick={() => this.submitDocument()}>Yes</button>
                    <button className="fmSmtButton saveColor saveBtn" style={{ marginTop: '20px' }} onClick={() => this.closeModal()}>No</button>
                  </div>
                </Modal>

                <Modal
                  isOpen={this.state.loading}
                  // onRequestClose={() => this.closeModal()}
                  contentLabel="Processing"
                  className="myModal"
                  overlayClassName="myOverlay">
                    <div style={{paddingLeft: '40px', paddingRight: '40px', textAlign: 'center'}}>
                      <div style={{fontSize: '16px', marginBottom: '10px'}}>Please wait...</div>
                      <img src={spinner} alt='spinner' />
                    </div>
                </Modal>

              </div>
            </div>
            <div className="clearBoth" />
            <div className="footerPgNum">14/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Preview);
