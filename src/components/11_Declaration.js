import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import CanvasDraw from "react-canvas-draw";
import $ from "jquery";
import {fileUpload, getImageUrl, saveDocument} from "../helpers/fetchhelper";

import "react-datepicker/dist/react-datepicker.css";
import {MEMBER_DECLARATION} from "../constants/constants";

var signatureData = null;

export class Declaration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageBase64: null,
      errFundAuthAck: null,
      errFundAuthName: null,
      errSignature: null,
      selectedFile: null,
      signImageSource: "",
      isSigned: false
    };
  }

  signed = () => {
    this.setState({ isSigned: true });
  }

  saveDocument = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid)
    })
  }

  validateData = (callback) => {
    if (
        this.props.values.fundAuthAck === true &&
        this.props.values.fundAuthName &&
        this.props.values.signature
    ) {
      // this.props.handleSignature('signature', this.state.imageBase64);

      var _nextPath = null;
      var _nav = null;

      if(this.props.values.userRole === "Member") {
        if(this.props.values.reasonForClaim !== "Retirement") {
            _nextPath = "/preview";
            _nav = 14;
        } else {
          _nextPath = "/documents";
          _nav = 13;
        }
      }

      if(this.props.values.userRole === "FA") {
        _nextPath = "/declarationEmp";
        _nav = 12;
      }

      callback(_nextPath, _nav);

      this.setState({
        errFundAuthAck: null,
        errFundAuthName: null,
        errSignature: null
      });
    } else {
      if (this.props.values.fundAuthAck === false) {
        this.setState({
          errFundAuthAck: "Please accept acknowledgement",
        });
      } else {
        this.setState({ errFundAuthAck: null });
      }
      if (!this.props.values.fundAuthName) {
        this.setState({
          errFundAuthName: "Please provide full name",
        });
      } else {
        this.setState({ errFundAuthName: null });
      }
      if(!this.props.values.signature) {
        this.setState({
          errSignature: 'Please Click Sign'
        })
      }
    }
  }


  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(MEMBER_DECLARATION, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body, () => {
        callback();
      });
    })
  };

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData((_nextPath, _nav) => {
      this.nextPath(_nextPath);
      this.props.clearValidPage(MEMBER_DECLARATION);
      this.props.handleNav(_nav);
    })
  };

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();

    var _nextPath = "";

    switch (this.props.values.claimOption) {
      case "In-Fund Preservation":
        _nextPath = "/beneficiary";
        this.props.handleNav(9);
        break;
      case "Transfer":
        _nextPath = "/transfer";
        this.props.handleNav(6);
        break;
      case "Cash":
        _nextPath = "/cash";
        this.props.handleNav(7);
        break;
      case "Cash & Transfer":
        _nextPath = "/cash";
        this.props.handleNav(7);
        break;
      case "Retirement":
        _nextPath = "/retirement";
        this.props.handleNav(8);
        break;
    }

    this.nextPath(_nextPath);

    // this.props.handleNav(10);
    // this.nextPath("/employerDetails");
  };

  nextPath = (path) => {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  };

  signCanvas = React.createRef();

  createSignImg = () => {
    const signImg = this.signCanvas.current.canvas.drawing.toDataURL('image/png');
    this.props.handleSignature(
      "signature",
      signImg
    );
    this.setState({
      // imageBase64: signImg,
      errSignature: 'Signature has been saved. Please click Next to proceed.'
    })
  };

  clearSign = () => {
    this.signCanvas.current.clear();
    this.props.handleSignature(
      "signature",
      null
    );
    this.setState({ isSigned: false });
  };

  onChangeHandler = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
  };

  uploadHandler = () => {
    const data = new FormData();
    const uninqueId = this.props.values.uuid;
    data.append("file", this.state.selectedFile, "sign_" + this.state.selectedFile.name);

    fileUpload(uninqueId, data, (res) => {
      this.setState({
        selectedFile: null
      });
      getImageUrl(uninqueId, res.data.name, (res) => {
        this.setState({ signImageSource: res.data.url })
      })
    });
  };


  render() {
    const { values, handleChange } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={10}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section12-li"
            className="section"
            elname="livefield-elem"
            compname="Section12"
            comptype={0}
            page_no={10}
            page_link_name="Page7"
          >
            <h2>Declaration (Acknowledgement by member)</h2>
            <p />
          </li>
          {/* <li elname="livefield-elem" linkname="TermsConditions2" comptype={34} id="TermsConditions2-li" needdata="true" compname="TermsConditions2" className="tempFrmWrapper termsWrapper" mandatory="true" page_no={10} page_link_name="Page7" tabIndex={1}>
                        <label className="labelName"><span>Terms and Conditions</span>
                        <em className="important">*</em>
                        </label>
                        <div className="tempContDiv"><div className="termsContainer">
                            <div className="termsMsg descFld"><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>1. I understand that I may at any time instruct Liberty to stop deducting or facilitating the payment of any future ongoing advice fee, or I may at any time instruct Liberty to change the amount of any ongoing fee or pay any future ongoing fee to Liberty or to another financial adviser.</span></span></span><br /></p><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>2. I understand that any ongoing advice fees agreed to in this mandate may continue to be paid where the financial adviser moves between distribution channels or authorised financial services providers, provided that the financial adviser or financial services provider is contracted with Liberty and appropriately accredited in terms of prevailing legislation.</span></span></span><br /></p><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>3. I understand that this mandate will be automatically renewed on an annual basis unless I instruct Liberty to cancel it.</span></span></span><br /></p><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>4. I understand that these fees will be deducted from the investment value of my policy and will therefore reduce the value of my investment accordingly.</span></span></span><br /></p><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>5. I understand that my financial adviser may work in a Liberty approved team and any advice fee deducted may be shared with the team.</span></span></span><br /></p><p className="Pa80" style={{marginBottom: '5pt'}}><span className="colour" style={{color: 'black'}}><span className="font" style={{fontFamily: '"Open Sans"'}}><span className="size" style={{fontSize: '8pt'}}>6. I understand that, if the financial adviser is part of a Liberty approved team and the financial adviser is for any reason unable to receive the advisory fee, then the advice fee will become payable to another adviser within the approved team.</span></span></span><br /></p><p className="MsoNormal" style={{}}><span lang="en-US" style={{}}>&nbsp;</span><br /></p><div><br /></div></div>
                            <div className="termsAccept">
                            <input onmousedown="event.preventDefault();" elname="statusCB" className="checkBoxType flLeft" name="TermsConditions2" type="checkbox" />
                            <label className="descFld">I accept the Terms and Conditions.</label>
                            </div></div><p className="errorMessage" elname="error" id="error-TermsConditions2" style={{display: 'none'}} /></div><div className="clearBoth" /></li> */}
          {/* <li className="tempFrmWrapper date" tabIndex={1} elname="livefield-elem" comptype={5} id="Date1-li" compname="Date1" linkname="Date1" needdata="true" isvisible="true" disableddays="{}" startoftheweek={0} mandatory="false" page_no={10} page_link_name="Page7">
                        <label className="labelName"><span>Date</span>
                        <em className="important">*</em>
                        </label>
                        <div className="tempContDiv" datelocale="en-GB" elname="dd-M-yy" id="Date1dateDiv" isdisable="false">
                        <span> <div className="calendarCont">
                            <input name="Date1" elname="date" id="Date1-date" onChange="ZFLive.validateFieldConstraint(this);" onfocusout="checkDatePicker(this);" autoComplete="off" onClick="ZFUtil.showLiveDatePicker(this)" onfocus="ZFUtil.showLiveDatePicker(this)" type="text" defaultValue className="hasDatepicker" /><div className="calIconWrapper" elname="imgWrapDiv"><img className="calendarIcon" src="https://static.zohocdn.com/forms/images/spacer.325472601571f31e1bf00674c368d335.gif" title="..." /></div>
                            <div className="clearBoth" /></div><label className="formSubInfoText">dd-mmm-yyyy</label> </span><p className="errorMessage" elname="error" id="error-Date1" style={{display: 'none'}} />
                        <span style={{display: 'none'}}> </span>
                        </div></li> */}
          <li
            elname="livefield-elem"
            linkname="TermsConditions5"
            comptype={34}
            id="TermsConditions5-li"
            needdata="true"
            compname="TermsConditions5"
            className="tempFrmWrapper termsWrapper"
            mandatory="true"
            page_no={10}
            page_link_name="Page7"
            tabIndex={1}
          >
            <label className="labelName">
              <span>Member acknowledgement</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="termsContainer">
                <div className="termsMsg descFld">
                  <p style={{}} className="MsoNormal">
                    <span
                      style={{
                        fontSize: "8pt",
                        lineHeight: "119%",
                        fontFamily: "Arial",
                      }}
                      lang="en-US"
                    >
                      I acknowledge:
                    </span>
                    <br />
                  </p>
                  <p
                    style={{
                      marginLeft: "28.3464pt",
                      textIndent: "-28.3464pt",
                    }}
                    className="MsoNormal"
                  >
                    <span
                      style={{
                        direction: "ltr",
                        unicodeBidi: "embed",
                        fontFamily: "Arial",
                        fontSize: "8pt",
                        color: "black",
                      }}
                    >
                      1.
                    </span>
                    <span style={{ width: "22pt" }}>&nbsp;</span>
                    <span
                      style={{
                        fontSize: "8pt",
                        lineHeight: "119%",
                        fontFamily: "Arial",
                      }}
                      lang="en-US"
                    >
                      The personal information that I have provided to Liberty
                      in this form is correct.
                    </span>
                    <br />
                  </p>
                  <p
                    style={{
                      marginLeft: "28.3464pt",
                      textIndent: "-28.3464pt",
                    }}
                    className="MsoNormal"
                  >
                    <span
                      style={{
                        direction: "ltr",
                        unicodeBidi: "embed",
                        fontFamily: "Arial",
                        fontSize: "8pt",
                        color: "black",
                      }}
                    >
                      2.
                    </span>
                    <span style={{ width: "22pt" }}>&nbsp;</span>
                    <span
                      style={{
                        fontSize: "8pt",
                        lineHeight: "119%",
                        fontFamily: "Arial",
                      }}
                      lang="en-US"
                    >
                      The information provided by me shall be subject to the
                      rules of the Fund and the terms and conditions of the
                      policy and any relevant regulatory authority.
                    </span>
                    <br />
                  </p>
                  <p
                    style={{
                      marginLeft: "28.3464pt",
                      textIndent: "-28.3464pt",
                    }}
                    className="MsoNormal"
                  >
                    <span
                      style={{
                        direction: "ltr",
                        unicodeBidi: "embed",
                        fontFamily: "Arial",
                        fontSize: "8pt",
                        color: "black",
                      }}
                    >
                      3.
                    </span>
                    <span style={{ width: "22pt" }}>&nbsp;</span>
                    <span
                      style={{
                        fontSize: "8pt",
                        lineHeight: "119%",
                        fontFamily: "Arial",
                      }}
                      lang="en-US"
                    >
                      I shall be responsible for sending this form back to
                      Liberty or to my employer or to the financial adviser's office with my
                      signature and contact details.
                    </span>
                    <br />
                  </p>
                  <p style={{}} className="MsoNormal">
                    <span style={{}} lang="en-US">
                      &nbsp;
                    </span>
                    <br />
                  </p>
                  <div>
                    <br />
                  </div>
                </div>
                <div className="termsAccept">
                  <input
                    elname="statusCB"
                    className="checkBoxType flLeft"
                    name="TermsConditions5"
                    type="checkbox"
                    onChange={handleChange("fundAuthAck")}
                    checked={values.fundAuthAck}
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="descFld">
                    I accept the declaration
                  </label>
                </div>
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-TermsConditions5"
              >
                {this.state.errFundAuthAck}
              </p>
            </div>
            <div className="clearBoth" />
          </li>

          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine36-li"
            needdata="true"
            compname="SingleLine36"
            linkname="SingleLine36"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Member full name</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="4"
                  value={values.fundAuthName}
                  onChange={handleChange("fundAuthName")}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine36"
              >
                {this.state.errFundAuthName}
              </p>
            </div>
            <div className="clearBoth" />
          </li>


          <li
            className="tempFrmWrapper  file_upload"
            uploadlimit={1}
            elname="livefield-elem"
            comptype={19}
            id="FileUpload-li"
            needdata="true"
            compname="FileUpload"
            linkname="FileUpload"
            allowedtype
            isvisible="true"
            mandatory="false"
            page_no={11}
            page_link_name="Page8"
          >
            {
              values.signature ? (
                <>
                  <label className="labelName">
                    <span>Member signature</span>
                    <em className="important">*</em>
                  </label>
                  <div className="tempContDiv">
                    <img style={{ width: "50%" }} src={values.signature}></img>
                  </div>
                  <div className="clearBoth" />
                </>
              ) : null
            }

          </li>

          <li
            className="sign tempFrmWrapper"
            tabIndex={1}
            elname="livefield-elem"
            comptype={25}
            id="Signature-li"
            needdata="true"
            compname="Signature"
            linkname="Signature"
            isvisible="true"
            mandatory="true"
            page_no={10}
            page_link_name="Page7"
          >
            <label className="labelName">
              <span>Member signature</span>
              <em className="important">*</em>
            </label>
            <p>Scribble your signature on touchscreen devices and click Sign</p>
            <br></br>
            <CanvasDraw
              canvasWidth="100%"
              name="canvasSignature"
              ref={this.signCanvas}
              hideGrid={true}
              brushRadius={2}
              canvasHeight={200}
              style={{ border: "1px solid #ccc" }}
              onChange={this.signed}
              disabled={this.props.is_form_submitted}
            />

            <button type="button"
                    className="fmSmtButton saveColor saveBtn"
                    style={{ margin: "10px 10px 10px 0" }}
                    onClick={this.createSignImg}
                    disabled={this.props.is_form_submitted || !this.state.isSigned}>Sign</button>

            <button type="button"
                    className="fmSmtButton saveColor saveBtn"
                    onClick={this.clearSign}
                    disabled={this.props.is_form_submitted}>Clear</button>
            <p className="errorMessage" elname="error" id="error-Date2">
              {this.state.errSignature}
            </p>
            <div className="clearBoth" />


          </li>

          <li
            className="tempFrmWrapper date"
            tabIndex={1}
            elname="livefield-elem"
            comptype={5}
            id="Date2-li"
            compname="Date2"
            linkname="Date2"
            needdata="true"
            isvisible="true"
            disableddays="{}"
            startoftheweek={0}
            mandatory="true"
            page_no={10}
            page_link_name="Page7"
          >
            <label className="labelName">
              <span>Date</span>
              <em className="important">*</em>
            </label>
            <div
              className="tempContDiv"
              datelocale="en-GB"
              elname="dd-M-yy"
              id="Date2dateDiv"
              isdisable="false"
            >
              <span>
                {values.dtDeclaration}
                {/* <DatePicker selected={values.dtDeclaration}
                                onChange={(date) => handleDate(date, 'dtDeclaration')}
                                dateFormat="dd-MMM-yyyy"
                                popperPlacement="right" />
                            <label className="formSubInfoText">dd-mmm-yyyy</label> */}
              </span>
              <p className="errorMessage" elname="error" id="error-Date2">
                {/* {this.state.errDtDeclaration} */}
              </p>
              <span style={{ display: "none" }}></span>
            </div>
          </li>
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
                    value="save"
                    onClick={this.saveDocument} title="Generate URL for this page"
                  >
                    <em>Share</em>
                  </button>
                </div>
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
            <div className="footerPgNum">11/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Declaration);
