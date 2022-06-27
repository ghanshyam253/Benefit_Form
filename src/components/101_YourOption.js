import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import $ from "jquery";
import { saveDocument } from "../helpers/fetchhelper";

export class YourOption extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      errUserRole: null,
      errReasonForClaim: null,
      errClaimOption: null,
    };
  }

  saveDocumentPartially = () => {
    let body = {
      uuid: this.props.values.uuid,
      info: this.props.values,
    };
    saveDocument(body);
  };

  saveDocument = (e) => {
    e.preventDefault();
    $("html,body").scrollTop(0);
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid);
    });
  };

  validateClaimOption = () => {
    if (
      this.props.values.userRole === "Member" &&
      this.props.values.claimOption === ""
    ) {
      return false;
    }
    return true;
  };

  validateData = (callback) => {
    if (
      this.props.values.userRole &&
      this.props.values.reasonForClaim 
    ) {
      callback();
    } else {
      if (!this.props.values.userRole) {
        this.setState({
          errUserRole:
            "Please select who is completing the claim form. Member, Financal Adviser or Employer?",
        });
      } else {
        this.setState({ errUserRole: null });
      }
      if (!this.props.values.reasonForClaim) {
        this.setState({
          errReasonForClaim: "Please select your reason for claim",
        });
      } else {
        this.setState({ errReasonForClaim: null });
      }
      // if (!this.props.values.claimOption) {
      //   this.setState({ errClaimOption: "Please select your option" });
      // } else {
      //   this.setState({ errClaimOption: null });
      // }
    }
  };

  // continue = (e) => {
  //     this.nextPath("/claims");
  //     this.props.handleNav(4);
  //       this.props.clearValidPage(MEMBER_INFO);
  //   })
  // };


  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
//    this.validateData(() => {
      var _nextPath = "/requiredDocuments";
      var _nav = 2;

     this.nextPath(_nextPath);

      this.props.handleNav(_nav);

      this.setState({
        errUserRole: null,
        errReasonForClaim: null,
        errClaimOption: null,
      });
  //  });
  };

  back = (e) => {
    e.preventDefault();
    $("html,body").scrollTop(0);
    this.props.handleNav(1);
    this.nextPath("/");
  };

  nextPath(path) {
    this.saveDocumentPartially();
    this.props.history.push(path);
  }

  render() {
    const { values, handleChange, handleYourOptions, handleReasonForClaim } =
      this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={2}
          needpagedata="true"
          style={{}}
        >
          <li
            className="zfradio tempFrmWrapper oneColumns section"
          >
            <h2>YOUR OPTION</h2>
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
          >
            <label className="labelName">
              <span>Please select who is completing the form</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio_1"
                    name="Radio"
                    elname="Radio"
                    className="radioBtnType"
                    defaultValue="Tracing Agent*"
                    checked={values.userRole === "Tracing Agent*"}
                    disabled={this.props.is_form_submitted}
                    onChange={handleChange("userRole")}
                  />
                  <label htmlFor="Radio_1" className="radioChoice">
                    Tracing Agent*
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio_2"
                    name="Radio"
                    elname="Radio"
                    className="radioBtnType"
                    defaultValue="Member"
                    checked={values.userRole === "Member"}
                    onChange={handleChange("userRole")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio_2" className="radioChoice">
                    Member
                  </label>{" "}
                </span>

                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio_3"
                    name="Radio"
                    elname="Radio"
                    className="radioBtnType"
                    defaultValue="Benificiary/Executor"
                    checked={values.userRole === "Benificiary/Executor"}
                    disabled={this.props.is_form_submitted}
                    onChange={handleChange("userRole")}
                  />
                  <label htmlFor="Radio_3" className="radioChoice">
                    Benificiary/Executor
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio">
                {this.state.errUserRole}
              </p>
              <p className="italicText">*Note: If the tracing agent is completing the form on behalf of the member, the member needs to give consent and must declare that the information provided is correct.</p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
          >
            <label className="labelName">
              <span>Please select an appropriate option</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio5_1"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    defaultValue="I would like to withdraw the full amount"
                    disabled={this.props.is_form_submitted}
                    checked={values.reasonForClaim === "I would like to withdraw the full amount"}
                    onChange={handleReasonForClaim}
                  />
                  <label htmlFor="Radio5_1" className="radioChoice">
                  I would like to withdraw the full amount
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio5_2"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    defaultValue="I am Retiring**"
                    disabled={this.props.is_form_submitted}
                    checked={values.reasonForClaim === "I am Retiring**"}
                    onChange={handleReasonForClaim}
                  />
                  <label htmlFor="Radio5_2" className="radioChoice">

                  I am Retiring**

                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio5_3"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    defaultValue="I would like to Transfer the full amount"
                    disabled={this.props.is_form_submitted}
                    checked={values.reasonForClaim === "I would like to Transfer the full amount"}
                    onChange={handleReasonForClaim}
                  />
                  <label htmlFor="Radio5_3" className="radioChoice">

                    I would like to Transfer the full amount

                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio5_4"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    defaultValue="I would like to take a combination of Cash and Transfer"
                    disabled={this.props.is_form_submitted}
                    checked={values.reasonForClaim === "I would like to take a combination of Cash and Transfer"}
                    onChange={handleReasonForClaim}
                  />
                  <label htmlFor="Radio5_4" className="radioChoice">
                    I would like to take a combination of Cash and Transfer
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio5">
                {this.state.errReasonForClaim}
              </p>

              <p className="italicText">** If the member has reached normal retirement age or beyond, he/she must retire from the fund.</p>

              


            </div>
            <div className="clearBoth" />
          </li>
        </ul>
        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={2}
          page_count={11}
          page_link_name="Page10"
          style={{}}
        >
          <li
            style={{ overflow: "visible", position: "relative" }}
            className="btnAllign fmFooter page"
            id="formAccess"
            elname={0}
          >
            <div className="pageFotDef">
              <div
                className="inlineBlock prevAlign"
                elname="back"
                skip_pageno={1}
              >
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
                {/* <div className="formRelative inlineBlock saveBtnCont">
                  <button
                    className="fmSmtButton saveColor saveBtn"
                    elname="save"
                    type="button"
                    onClick={this.saveDocument}
                    title="Generate URL for this page"
                  >
                    <em>Share</em>
                  </button>
                </div> */}

                {/* <div className="formRelative inlineBlock saveBtnCont"><button className="fmSmtButton saveColor saveBtn" elname="save" value="save">
                            <em>Share</em>
                        </button></div> */}
                <div className="inlineBlock nextAlign" elname="next">
                  <button
                    className="fmSmtButton next_previous navWrapper"
                    type="button"
                    elname="next"
                    onClick={this.continue}
                  >
                    <em> Next </em>
                  </button>
                </div>
              </div>
            </div>
            <div className="clearBoth" />
            <div className="footerPgNum">1/9</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(YourOption);
