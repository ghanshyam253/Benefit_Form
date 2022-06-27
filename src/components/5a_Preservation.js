import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import $ from "jquery";

import CanvasDraw from "react-canvas-draw";
import funds from "../data/funds.json";
import {saveDocument} from "../helpers/fetchhelper";
import {PRESERVATION} from "../constants/constants";


export class Preservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // fundNames: [],
      fee: "",
      list: [],
      fundName: "",
      allocation: "",
      // fundType: "",
      errInitAdviceFee: null,
      errOngoingAdviceFee: null,
      errTotal: null,
      imageBase64_mem: null,
      // errSignature_mem: null,
      imageBase64_fa: null,
      errSignature_fa: null,
      // infoSignature_mem: null,
      infoSignature_fa: null,
      errPreserveBenefit: null,
      errPreserveTnC: null,
      errNoFaAck: null,
      errMemberDecl: null,
      errFaDecl: null,
      errPfaLibertyCode: null,
      errPfaName: null,
      isSigned: false
    };
  }

  componentDidMount() {
    this.setState({
      list: this.props.values.portfolio,
    });
  }

  signed = () => {
    this.setState({ isSigned: true });
  }

  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(PRESERVATION, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body, () => {
        callback();
      });
    })
  };

  // fundTypes = portfolioData.map((fundType, key) => {
  //   return (
  //     <option key={key} value={fundType.portfolioName}>
  //       {fundType.portfolioName}
  //     </option>
  //   );
  // });

  getFunds = funds.map((fund) => {
    return (
      <option key={fund.name} data-key={fund.name} value={fund.name}>
        {fund.name}
      </option>
    );
  });

  // handleFundType = (e) => {
  //   var value = e.target.value;
  //   console.log("Selected fund type:", value);
  //   var allFunds = portfolioData.filter((f) => f.portfolioName === value)[0];
  //   console.log("allFunds: ", allFunds.funds.length);

  //   this.setState({
  //     fundNames: allFunds.funds,
  //     fee: "",
  //     fundType: value,
  //   });
  // };

  handleFundName = (e) => {
    var value = e.target.value;
    if (value) {
      var f = funds.filter((n) => n.name === value)[0];
      this.setState({
        fee: f.fee,
        fundName: value,
      });
    }
  };

  addItem = (e) => {
    e.preventDefault();
    document.getElementById("fundNames").selectedIndex = 0;
    if (
      // this.state.fundType &&
      this.state.fundName &&
      this.state.fee &&
      this.state.allocation
    ) {
      this.setState({
        list: this.state.list.concat({
          fundName: this.state.fundName,
          // fundType: this.state.fundType,
          fee: this.state.fee,
          allocation: this.state.allocation,
        }),
        // fundNames: [],
        // fundType: "",
        fundName: "",
        fee: "",
        allocation: "",
      }, () => {
        this.props.handlePortfolio(this.state.list);
      });
    }
  };

  delItem = (i) => {
    this.setState((state) => {
      const list = state.list.filter((item, j) => i !== j);
      return {
        list,
      };
    }, () => {
      this.props.handlePortfolio(this.state.list);
    });
  };

  _total = () => {
    var a = 0;
    var data = this.state.list;
    data.forEach((i) => {
      a += Number(i.allocation);
    });

    return a;
  };

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.props.handleNav(4);
    this.nextPath("/claims");
  };

  nextPath(path) {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  }

  validateData = (callback) => {
    var total = Number(this._total());

    var _faInitAdviceFee = this.props.values.faInitAdviceFee;
    var _faOngoingAdviceFee = this.props.values.faOngoingAdviceFee;

    var _otherFaInitAdviceFee = this.props.values.otherFaInitAdviceFee;
    var _otherFaOngoingAdviceFee = this.props.values.otherFaOngoingAdviceFee;

    var totalInitAdviceFee =
      Number(_faInitAdviceFee) + Number(_otherFaInitAdviceFee);
    var totalOngoingAdviceFee =
      Number(_faOngoingAdviceFee) + Number(_otherFaOngoingAdviceFee);

    var noFaAckFlag = false;
    if (this.props.values.declarationByMemNoFA && this.props.values.optForFA == "No") {
      noFaAckFlag = true;
    } else if (this.props.values.optForFA == "Yes") {
      noFaAckFlag = true;
    }

    var noPfaDetails = false;
    if (this.props.values.faFirstName && this.props.values.faLastName && this.props.values.declarationByFA &&
      this.props.values.faLibertyCode && this.props.values.optForFA == "Yes") {
      noPfaDetails = true;
    } else if (this.props.values.optForFA == "No") {
      noPfaDetails = true;
    }

    const memberDeclaration = this.props.values.optForFA == "Yes" && !this.props.values.declarationByMember_2 ? false : true;

    if (
      totalInitAdviceFee <= 1.5 &&
      totalOngoingAdviceFee <= 1 &&
      (total == 100 || total ==0) &&
      this.props.values.preserveBenefit &&
      this.props.values.preserveTnC &&
      noFaAckFlag &&
      noPfaDetails &&
      memberDeclaration
    ) {
      this.props.handleSignature(
        "preserveMemberSignature",
        this.state.imageBase64_mem
      );
      this.props.handleSignature(
        "preserveFaSignature",
        this.state.imageBase64_fa
      );
      callback();
      this.setState({
        errInitAdviceFee: null,
        errOngoingAdviceFee: null,
        errTotal: null,
        // errSignature_mem: null,
        errSignature_fa: null,
      });
    } else {
      if (totalInitAdviceFee > 1.5) {
        this.setState({
          errInitAdviceFee:
            "The sum of all initial advice fees cannot exceed 1.5% (excluding VAT)",
        });
      } else {
        this.setState({ errInitAdviceFee: null });
      }

      if (totalOngoingAdviceFee > 1) {
        this.setState({
          errOngoingAdviceFee:
            "The sum of all ongoing advice fees cannot exceed 1% p.a. (excluding VAT)",
        });
      } else {
        this.setState({ errOngoingAdviceFee: null });
      }

      if (total !== 100 && this.state.list.length > 0) {
        this.setState({
          errTotal: "Total of invested percentage should add up to 100%",
        });
      } else {
        this.setState({ errTotal: null });
      }

      if(this.state.isSigned && !this.props.values.preserveFaSignature) {
        this.setState({
          errSignature_fa: "Please Click Sign",
        });
      }
      else if (!this.state.imageBase64_fa) {
        this.setState({
          errSignature_fa: "Please review and provide your signature",
        });
      } else {
        this.setState({ errSignature_fa: null });
      }

      if (!this.props.values.preserveBenefit) {
        this.setState({
          errPreserveBenefit: "Please select an option"
        });
      } else {
        this.setState({ errPreserveBenefit: null });
      }

      if (!this.props.values.preserveTnC) {
        this.setState({
          errPreserveTnC: "Please accept the terms and conditions"
        });
      } else {
        this.setState({ errPreserveTnC: null });
      }

      if (!this.props.values.declarationByMemNoFA && this.props.values.optForFA == "No") {
        this.setState({
          errNoFaAck: "Please acknowledge"
        });
      } else {
        this.setState({ errNoFaAck: null });
      }

      if (!this.props.values.declarationByMember_2) {
        this.setState({
          errMemberDecl: "Please accept the declaration"
        });
      } else {
        this.setState({ errMemberDecl: null });
      }

      if (!this.props.values.declarationByFA) {
        this.setState({
          errFaDecl: "Please accept the declaration"
        });
      } else {
        this.setState({ errFaDecl: null });
      }

      if (!this.props.values.faFirstName && !this.props.values.faLastName) {
        this.setState({
          errPfaName: "Please provide name of the principal financial adviser"
        });
      } else {
        this.setState({ errPfaName: null });
      }

      if (!this.props.values.faLibertyCode) {
        this.setState({
          errPfaLibertyCode: "Please provide principal financial adviser’s Liberty 13-digit code"
        });
      } else {
        this.setState({ errPfaLibertyCode: null });
      }
    }
  }

  saveDocument = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.nextPath("/save?uuid=" + this.props.values.uuid)
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.nextPath("/beneficiary");
    this.props.clearValidPage(PRESERVATION);
    this.props.handleNav(9);

  };

  signCanvasMem = React.createRef();
  signCanvasFa = React.createRef();

  createSignImgMem = () => {
    const signImgMem = this.signCanvasMem.current.canvas.drawing.toDataURL(
      "image/png"
    );
    this.setState({
      imageBase64_mem: signImgMem,
      infoSignature_mem: "Signature has been saved.",
    });
  };

  clearSignMem = () => {
    this.signCanvasMem.current.clear();
  };

  createSignImgFa = () => {
    const signImgFa = this.signCanvasFa.current.canvas.drawing.toDataURL(
      "image/png"
    );
    this.props.handleSignature(
      "preserveFaSignature",
      signImgFa
    );
    this.setState({
      imageBase64_fa: signImgFa,
      errSignature_fa: null,
      infoSignature_fa: "Signature has been saved.",
    });
  };

  clearSignFa = () => {
    this.signCanvasFa.current.clear();
    this.props.handleSignature(
      "preserveFaSignature",
      null
    );
    this.setState({ isSigned: false });
  };

  // _portfolioList = portfolios.map((portfolio) => {
  //     return (
  //         <option key={portfolio.portfolioName} data-key={portfolio.portfolioName} value={portfolio.portfolioName}>{portfolio.portfolioName}</option>
  //     )
  // });

  // portfolioFunds = funds => funds.map((fund) => {
  //     return (
  //         <tr>
  //             <td style={{width:"400px"}} key={fund.name}>{fund.name}</td>
  //             <td style={{width:"100px"}} key={fund.fee}>{fund.fee}</td>
  //             <td style={{width:"50px"}}><input type="checkbox" checked={false} /></td>
  //             <td><input type="text" style={{width:"50px"}} value={"0"} />&nbsp;%</td>
  //         </tr>
  //     )
  // });

  // portfolioList = portfolios.map((portfolio) => {
  //     return (

  //         <div style={{border:"1px solid lightgrey"}}>
  //             <div style={{backgroundColor: "lightgray", padding: "5px"}} key={portfolio.portfolioName}>{portfolio.portfolioName}</div>
  //             <table style={{marginLeft:"5px"}}>
  //                 {this.portfolioFunds(portfolio.funds)}
  //             </table>
  //         </div>
  //     )
  // });

  render() {
    const { values, handleChange, handleCheck, handlePortfolio, handleOptForFA, handleOptForOtherFA, handleSignature } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={5}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section-li"
            className="section"
            elname="livefield-elem"
            compname="Section"
            comptype={0}
            page_no={5}
            page_link_name="Page2"
          >
            <h2>IN–FUND PRESERVATION FOR BENEFIT</h2>
            <p />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio3-li"
            needdata="true"
            compname="Radio3"
            linkname="Radio3"
            isvisible="true"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
          >
            <label className="labelName">
              <span>
                Does the member wish to retain (i.e. preserve) the benefit
                within the Fund?
              </span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Yes"
                    checked={values.preserveBenefit === "Yes"}
                    onChange={handleChange("preserveBenefit")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"
                    checked={values.preserveBenefit === "No"}
                    onChange={handleChange("preserveBenefit")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_2" className="radioChoice">
                    No
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio3">
                {this.state.errPreserveBenefit}
              </p>
            </div>
            <div className="clearBoth" />
            <p>
              For standalone fund members, the benefit will be preserved in the
              portfolio(s) which the member is currently invested in, or in that
              chosen by the Trustees of the Fund as permitted.
            </p>
          </li>
          <li
            elname="livefield-elem"
            linkname="TermsConditions4"
            comptype={34}
            id="TermsConditions4-li"
            needdata="true"
            compname="TermsConditions4"
            className="tempFrmWrapper termsWrapper"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
            tabIndex={1}
          >
            <label className="labelName">
              <span>Terms and conditions</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="termsContainer">
                <div className="termsMsg descFld">
                  <div>
                    For all Funds, other than Liberty Corporate Selection
                    Umbrella Funds, the member's benefit will be retained in the
                    Fund and will remain invested in the current investment
                    portfolio selections. <br />
                  </div>
                  <div>
                    For members of the Liberty Corporate Selection Umbrella
                    Funds, please indicate investment portfolio selection below,
                    the member's selection of investment portfolio(s) into which
                    the benefits are to be invested. Place a cross in the column
                    next to the portfolio name and indicate the desired % of the
                    benefit to be invested in that particular portfolio. The
                    total % across all portfolios selected must sum up to 100%.
                    If no selection is made in Table 1, then the member's
                    benefit will be fully invested into one of the Default
                    Investment Portfolios selected by the Board of Trustees of
                    the Fund.
                    <br />
                  </div>
                  <div>
                    For members of the Liberty Corporate Selection Umbrella
                    Funds only - if a financial adviser has been appointed by
                    the member as their personal adviser,
                    <br />
                  </div>
                </div>
                <div className="termsAccept">
                  <input
                    elname="statusCB"
                    className="checkBoxType flLeft"
                    name="TermsConditions4"
                    type="checkbox"
                    checked={values.preserveTnC}
                    onChange={handleCheck("preserveTnC")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="descFld">
                    I accept the terms and conditions
                  </label>
                </div>
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-TermsConditions4"
              >
                {this.state.errPreserveTnC}
              </p>
            </div>
            <div className="clearBoth" />
          </li>

          <li
            tabIndex={1}
            id="Section16-li"
            className="section"
            elname="livefield-elem"
            compname="Section16"
            comptype={0}
            page_no={5}
            page_link_name="Page2"
          >
            <h2>Corporate Selection Umbrella Fund's members only: Select your investment portfolio(s)</h2>
            <p>
              For members of the Liberty Corporate Selection Umbrella Funds,
              please indicate in below section, the member's selection of
              investment portfolio(s) into which the benefits are to be
              invested. Please select appropriate fund from the below drop down
              and indicate the desired % of the benefit to be invested in that
              particular portfolio. The total % across all portfolios selected
              must sum up to 100%. If no selection is made in below section,
              then the member's benefit will be fully invested into one of the
              Default Investment Portfolios selected by the Board of Trustees of
              the Fund.
            </p>
          </li>
          <li
            className="zfradio tempFrmWrapper matrix_choice"
            comptype={30}
            elname="livefield-elem"
            linkname="MatrixChoice"
            id="MatrixChoice-li"
            needdata="true"
            choicetype={3}
            compname="MatrixChoice"
            isvisible="true"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
          >
            <label className="labelName">
              <span>Investment portfolio selection</span>
            </label>
            <div className="tempContDiv">
              <div>
                <div style={{ marginBottom: "5px" }}>
                  <span style={{ fontWeight: "bold" }}>Please note: </span>Click
                  on{" "}
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#5cb85c",
                      border: "none",
                      color: "white",
                    }}
                    className="add"
                  >
                    ✚
                  </button>{" "}
                  button after selecting fund to save your selection(s).
                </div>
                <table id="dynamicTable">
                  <thead><tr>
                    {/* <th style={{ width: "35%" }}>Investment Portfolio Name</th> */}
                    <th style={{ width: "35%" }}>Fund Name</th>
                    <th style={{ width: "10%" }}>Fee</th>
                    <th style={{ width: "10%" }}>% Invested</th>
                    <th style={{ width: "10%" }}></th>
                  </tr></thead>
                  <tbody>
                    {this.state.list.map((item, index) => (
                      <tr key={index}>
                        {/* <td>{item.fundType}</td> */}
                        <td>{item.fundName}</td>
                        <td>{item.fee}</td>
                        <td>{item.allocation}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            onClick={() => this.delItem(index)}
                          >
                            &#10006;
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      {/* <td>
                      <div className="form_sBox">
                        <div className="customArrow" />
                        <select
                          onChange={this.handleFundType}
                          value={this.state.fundType}
                        >
                          <option value="">-- Select --</option>
                          {this.fundTypes}
                        </select>
                      </div>
                    </td> */}
                    <td>
                      <div className="form_sBox">
                        <div className="customArrow" />
                        <select id="fundNames" onChange={this.handleFundName}
                                disabled={this.props.is_form_submitted}>
                          <option value="">-- Select --</option>
                          {/* {this.state.fundNames.map((fundName, key) => {
                            return (
                              <option key={key} value={fundName.name}>
                                {fundName.name}
                              </option>
                            );
                          })} */}
                          {this.getFunds}
                        </select>
                      </div>
                    </td>
                    <td>{this.state.fee}</td>
                    <td>
                      <input
                        type="text"
                        value={this.state.allocation}
                        onChange={(e) =>
                          this.setState({ allocation: e.target.value })
                        }
                        disabled={this.props.is_form_submitted}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="add"
                        onClick={this.addItem}
                        disabled={this.props.is_form_submitted}
                      >
                        &#10010;
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                {/* <table id="dynamicTable">
                            <tr>
                                <th>Fund Type </th>
                                <th>Fund Name</th>
                                <th>Investment Manage Fee</th>
                                <th>Allocation %</th>
                                <th></th>
                            </tr>
                            {this.state.portfolioList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.portfolioName}</td>
                                    <td>{item.fundName}</td>
                                    <td>{item.fundFee}</td>
                                    <td>{item.allocation}</td>
                                    <td><button type="button" onClick={() => this.delItem(index) }>&#10006;</button></td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <input type="text" value={this.state.portfolioName} onChange={this.handleChange('portfolioName')}></input>
                                    <div className="form_sBox">
                                        <div className="customArrow" />
                                        <select name="portfolioName" onChange={this.handleFundTypeSelection} tabIndex="16">
                                            <option>-- Select fund type --</option>
                                            {this._portfolioList}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" value={this.state.fundName} onChange={this.handleChange('fundName')}></input>
                                    <div className="form_sBox">
                                        <div className="customArrow" />
                                        <select name="Dropdown" tabIndex="16">
                                            {this._portfolioList}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" value={this.state.fundFee} onChange={this.handleChange('fundFee')}></input>
                                </td>
                                <td>
                                    <input type="text" value={this.state.allocation} onChange={this.handleChange('allocation')}></input>
                                </td>
                                <td>
                                    <button type="button" className="add" onClick={ this.addItem }>&#10010;</button>
                                </td>
                            </tr>
                        </table> */}

                {/* <table width="100%" border={0} cellSpacing={0} cellPadding={0}><thead> <tr>
                                <th>Investment Portfolio Name</th>
                                <th>Investment Manage Fee</th>
                                <th>Indicate Selection</th>
                                <th>% Invested</th>
                                </tr></thead>
                                <tbody> */}
                {/* {this.portfolioList} */}
                {/* </tbody>
                            </table> */}
                {/* <button className="fmSmtButton saveColor saveBtn" elname="save" value="save">
                            <em>Add+</em>
                            </button>
                            <button className="fmSmtButton saveColor saveBtn" elname="save" value="save" style={{float: 'right'}}>
                            <em>Delete</em>
                            </button> */}
                <div className="clearBoth" />
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-MatrixChoice"
              >
                {this.state.errTotal}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine37-li"
            needdata="true"
            compname="SingleLine37"
            linkname="SingleLine37"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>TOTAL: {this._total()}%</span>
            </label>
          </li>
          {/* <li
            elname="livefield-elem"
            linkname="TermsConditions3"
            comptype={34}
            id="TermsConditions3-li"
            needdata="true"
            compname="TermsConditions3"
            className="tempFrmWrapper termsWrapper"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
            tabIndex={1}
          >
            <label className="labelName">
              <span>Declaration by member</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="termsContainer">
                <div className="termsMsg descFld">
                  This declaration is only required if no financial adviser has
                  been appointed by the member. Else, please refer to below
                  Section. I acknowledge that by selecting "Yes" for In fund
                  preservation and by not completing below section , I am
                  declaring that I shall be an in-fund Deferred Retiree or
                  Preserver Member of the Fund without a financial adviser and
                  without investment advice.
                  <div>
                    <br />
                  </div>
                </div>
                <div className="termsAccept">
                  <input
                    elname="statusCB"
                    className="checkBoxType flLeft"
                    name="TermsConditions3"
                    type="checkbox"
                    checked={values.declarationByMember_1}
                    onChange={handleCheck("declarationByMember_1")}
                  />
                  <label className="descFld">
                    I accept the Terms and Conditions.
                  </label>
                </div>
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-TermsConditions3"
              />
            </div>
            <div className="clearBoth" />
          </li> */}
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio3-li"
            needdata="true"
            compname="Radio3"
            linkname="Radio3"
            isvisible="true"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
          >
            <label className="labelName">
              <span>Would you like to opt for a financial adviser?</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio4"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Yes"
                    checked={values.optForFA === "Yes"}
                    onChange={handleOptForFA}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  {" "}
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio4"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"
                    checked={values.optForFA === "No"}
                    onChange={handleOptForFA}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_2" className="radioChoice">
                    No
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio3" />
            </div>
            <div className="clearBoth" />
            <p>
              Applicable for Corporate Selection Umbrella Fund's members only
            </p>
          </li>


          {values.optForFA === "Yes" ?
            <div style={{ backgroundColor: '#d4efff' }}>
              <li
                tabIndex={1}
                id="Section16-li"
                className="section"
                elname="livefield-elem"
                compname="Section16"
                comptype={0}
                page_no={5}
                page_link_name="Page2"
              >
                <h2>Principal Financial Adviser's details</h2>
                <p>
                  For members of the Liberty Corporate Selection Umbrella Funds only
                  - if a Financial Adviser has been appointed by the member as their
                  personal adviser, this section mentioned below must also be
                  completed. A maximum of 1.5% plus VAT may be used as a total
                  initial adviser fee across all advisers appointed. A maximum of 1%
                  per annum plus VAT may be used as a total annual adviser fee
                  across all advisers appointed.
                </p>
              </li>
              <li
                className="tempFrmWrapper name namemedium"
                elname="livefield-elem"
                comptype={7}
                needdata="true"
                id="Name3-li"
                compname="Name3"
                linkname="Name3"
                isvisible="true"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>Name of principal financial adviser</span>
                  <em className="important">*</em>
                </label>

                <div className="tempContDiv twoType">
                  <div className="nameWrapper">
                    <span>
                      {" "}
                      <input
                        autoComplete="nofill"
                        type="text"
                        maxLength={255}
                        elname="First"
                        name="Name3"
                        complink="Name3_First"
                        value={values.faFirstName}
                        onChange={handleChange("faFirstName")}
                        mandatory="false"
                        disabled={this.props.is_form_submitted}
                      />
                      <label className="formSubInfoText">First</label>{" "}
                    </span>
                    <span>
                      {" "}
                      <input
                        autoComplete="nofill"
                        type="text"
                        maxLength={255}
                        elname="Last"
                        name="Name3"
                        complink="Name3_Last"
                        value={values.faLastName}
                        onChange={handleChange("faLastName")}
                        mandatory="false"
                        disabled={this.props.is_form_submitted}
                      />
                      <label className="formSubInfoText">Last</label>{" "}
                    </span>
                    <div className="clearBoth" />
                  </div>
                  <p className="errorMessage" elname="error" id="error-Name3">
                    {this.state.errPfaName}
                  </p>
                </div>
                <div className="clearBoth" />
              </li>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={3}
                id="Number1-li"
                needdata="true"
                compname="Number1"
                linkname="Number1"
                isvisible="true"
                mandatory="false"
                unit_position={2}

                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>Principal financial adviser’s Liberty 13-digit code</span>
                  <em className="important">*</em>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <span>
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={18}
                      name="Number1"
                      value={values.faLibertyCode}
                      onChange={handleChange("faLibertyCode")}
                      disabled={this.props.is_form_submitted}
                    />{" "}
                  </span>
                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Number1">
                    {this.state.errPfaLibertyCode}
                  </p>
                </div>
                <div className="clearBoth" />
              </li>
              <li
                className="tempFrmWrapper phone small"
                elname="livefield-elem"
                comptype={11}
                id="PhoneNumber1-li"
                needdata="true"
                compname="PhoneNumber1"
                linkname="PhoneNumber1"
                isvisible="true"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
                need_reconf="false"
              >
                <label className="labelName">
                  <span>Telephone number of principal adviser</span>
                </label>
                <div
                  className="tempContDiv"
                  elname="phoneFormatElem"
                  phoneformat="INTERNATIONAL"
                >
                  <div elname="phoneFld" name="phone-elements">
                    <input
                      name="PhoneNumber1"
                      autoComplete="nofill"
                      id="PhoneNumber1"
                      type="text"
                      elname="countrycode"
                      maxLength={20}
                      value={values.faPhone}
                      onChange={handleChange("faPhone")}
                      iscodeenabled="false"
                      phoneformattype={1}
                      disabled={this.props.is_form_submitted}
                    />
                  </div>
                  <p
                    className="errorMessage"
                    elname="error"
                    id="error-PhoneNumber1"
                  />
                </div>
                <div className="clearBoth" />
              </li>
              <li
                className="tempFrmWrapper email small"
                elname="livefield-elem"
                comptype={9}
                id="Email1-li"
                needdata="true"
                compname="Email1"
                linkname="Email1"
                isvisible="true"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
                domain_option={0}
                need_reconf="false"
              >
                <label className="labelName">
                  <span>Email address of principal adviser</span>
                </label>
                <div className="tempContDiv">
                  <span elname="livefield-email-elem">
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={255}
                      name="Email1"
                      value={values.faEmail}
                      onChange={handleChange("faEmail")}
                      disabled={this.props.is_form_submitted}
                    />
                    <p className="errorMessage" elname="error" id="error-Email1" />
                  </span>
                </div>
                <div className="clearBoth" />
              </li>
              <li
                elname="livefield-elem"
                comptype={1}
                id="SingleLine2-li"
                needdata="true"
                compname="SingleLine2"
                linkname="SingleLine2"
                isvisible="true"
                className="tempFrmWrapper small"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>FSP practice name</span>
                </label>
                <div className="tempContDiv">
                  <span>
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={255}
                      name="SingleLine2"
                      value={values.faFspPracticeName}
                      onChange={handleChange("faFspPracticeName")}
                      disabled={this.props.is_form_submitted}
                    />
                  </span>
                  <p
                    className="errorMessage"
                    elname="error"
                    id="error-SingleLine2"
                  />
                </div>
                <div className="clearBoth" />
              </li>
              <li
                elname="livefield-elem"
                comptype={1}
                id="SingleLine3-li"
                needdata="true"
                compname="SingleLine3"
                linkname="SingleLine3"
                isvisible="true"
                className="tempFrmWrapper small"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>FSP practice number</span>
                </label>
                <div className="tempContDiv">
                  <span>
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={255}
                      name="SingleLine3"
                      value={values.faFspPracticeNo}
                      onChange={handleChange("faFspPracticeNo")}
                      disabled={this.props.is_form_submitted}
                    />
                  </span>
                  <p
                    className="errorMessage"
                    elname="error"
                    id="error-SingleLine3"
                  />
                </div>
                <div className="clearBoth" />
              </li>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={20}
                id="Decimal-li"
                needdata="true"
                compname="Decimal"
                linkname="Decimal"
                isvisible="true"

                unit_position={2}
                decimallength={2}
                decimalformat={1}
                mandatory="true"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>Initial investment advice fee of principal adviser</span>
                  <em className="important">*</em>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <input
                    autoComplete="nofill"
                    type="text"
                    maxLength={50}
                    name="Decimal"
                    value={values.faInitAdviceFee}
                    onChange={handleChange("faInitAdviceFee")}
                    disabled={this.props.is_form_submitted}
                  />
                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Decimal" />
                  <p
                    className="instruction instrSpace"
                    elname="hint"
                    id="hint-Decimal"
                  >
                    {" "}
                    % of benefit as per the member agreement
                  </p>
                </div>
                <div className="clearBoth" />
              </li>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={20}
                id="Decimal1-li"
                needdata="true"
                compname="Decimal1"
                linkname="Decimal1"
                isvisible="true"

                unit_position={2}
                decimallength={2}
                decimalformat={1}
                mandatory="true"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>
                    Annual ongoing investment advice fee of principal adviser (% of
                    benefit as per the member agreement)
                  </span>
                  <em className="important">*</em>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <input
                    autoComplete="nofill"
                    type="text"
                    maxLength={50}
                    name="Decimal1"
                    value={values.faOngoingAdviceFee}
                    onChange={handleChange("faOngoingAdviceFee")}
                    disabled={this.props.is_form_submitted}
                  />
                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Decimal1" />
                  <p
                    className="instruction instrSpace"
                    elname="hint"
                    id="hint-Decimal1"
                  >
                    {" "}
                    % of benefit as per the member agreement and this will be
                    converted into a monthly % deducted off the benefit value
                  </p>
                </div>
                <div className="clearBoth" />
              </li>

              {/* </div> : null } */}


              {/* <li
            tabIndex={1}
            id="Section16-li"
            className="section"
            elname="livefield-elem"
            compname="Section16"
            comptype={0}
            page_no={5}
            page_link_name="Page2"
          >
            <h2>Other related financial adviser</h2>
            <p>
              Complete this section if you wish to have more than one financial
              adviser
            </p>
          </li> */}
              <li
                className="zfradio tempFrmWrapper oneColumns"
                elname="livefield-elem"
                comptype={13}
                id="Radio3-li"
                needdata="true"
                compname="Radio3"
                linkname="Radio3"
                isvisible="true"
                mandatory="false"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>Is there other related financial adviser along with principal financial adviser?</span>
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
                        defaultValue="Yes"
                        checked={values.optForOtherFA === "Yes"}
                        onChange={handleOptForOtherFA}
                        disabled={this.props.is_form_submitted}
                      />
                      <label htmlFor="Radio5_1" className="radioChoice">
                        Yes
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
                        defaultValue="No"
                        checked={values.optForOtherFA === "No"}
                        onChange={handleOptForOtherFA}
                        disabled={this.props.is_form_submitted}
                      />
                      <label htmlFor="Radio5_2" className="radioChoice">
                        No
                      </label>{" "}
                    </span>
                    <div className="clearBoth" />
                  </div>
                  <p className="errorMessage" elname="error" id="error-Radio3" />
                </div>
                <div className="clearBoth" />

              </li>
            </div> : null}

          {values.optForOtherFA === "Yes" ? <div style={{ backgroundColor: '#ffebeb' }}>
            <li
              className="tempFrmWrapper name namemedium"
              elname="livefield-elem"
              comptype={7}
              needdata="true"
              id="Name1-li"
              compname="Name1"
              linkname="Name1"
              isvisible="true"
              mandatory="false"
              page_no={5}
              page_link_name="Page2"
            >
              <label className="labelName">
                <span>Name</span>
              </label>
              <div className="tempContDiv twoType">
                <div className="nameWrapper">
                  <span>
                    {" "}
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={255}
                      elname="First"
                      name="Name1"
                      complink="Name1_First"
                      value={values.otherFaFirstName}
                      onChange={handleChange("otherFaFirstName")}
                      mandatory="false"
                      disabled={this.props.is_form_submitted}
                    />
                    <label className="formSubInfoText">First</label>{" "}
                  </span>
                  <span>
                    {" "}
                    <input
                      autoComplete="nofill"
                      type="text"
                      maxLength={255}
                      elname="Last"
                      name="Name1"
                      complink="Name1_Last"
                      value={values.otherFaLastName}
                      onChange={handleChange("otherFaLastName")}
                      mandatory="false"
                      disabled={this.props.is_form_submitted}
                    />
                    <label className="formSubInfoText">Last</label>{" "}
                  </span>
                  <div className="clearBoth" />
                </div>
                <p className="errorMessage" elname="error" id="error-Name1" />
              </div>
              <div className="clearBoth" />
            </li>
            <li
              className="tempFrmWrapper small"
              elname="livefield-elem"
              comptype={3}
              id="Number7-li"
              needdata="true"
              compname="Number7"
              linkname="Number7"
              isvisible="true"
              mandatory="false"
              unit_position={2}

              page_no={5}
              page_link_name="Page2"
            >
              <label className="labelName">
                <span>Liberty 13-digit code</span>
              </label>
              <div elname="tempContDiv" className="tempContDiv">
                <span>
                  <input
                    autoComplete="nofill"
                    type="text"
                    maxLength={18}
                    name="Number7"
                    value={values.otherFaLibertyCode}
                    onChange={handleChange("otherFaLibertyCode")}
                    disabled={this.props.is_form_submitted}
                  />{" "}
                </span>
                <span
                  className="symbol"
                  name="field_unit_after"
                  elname="field_unit_span"
                />
                <p className="errorMessage" elname="error" id="error-Number7" />
              </div>
              <div className="clearBoth" />
            </li>
            <li
              className="tempFrmWrapper small"
              elname="livefield-elem"
              comptype={20}
              id="Decimal5-li"
              needdata="true"
              compname="Decimal5"
              linkname="Decimal5"
              isvisible="true"

              unit_position={2}
              decimallength={2}
              decimalformat={1}
              mandatory="false"
              page_no={5}
              page_link_name="Page2"
            >
              <label className="labelName">
                <span>Initial investment advice fee</span>
              </label>
              <div elname="tempContDiv" className="tempContDiv">
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={50}
                  name="Decimal5"
                  value={values.otherFaInitAdviceFee}
                  onChange={handleChange("otherFaInitAdviceFee")}
                  disabled={this.props.is_form_submitted}
                />
                <span
                  className="symbol"
                  name="field_unit_after"
                  elname="field_unit_span"
                />
                <p className="errorMessage" elname="error" id="error-Decimal5" />
                <p
                  className="instruction instrSpace"
                  elname="hint"
                  id="hint-Decimal5"
                >
                  {" "}
                  % of benefit as per the member agreement
                </p>
              </div>
              <div className="clearBoth" />
            </li>
            <li
              className="tempFrmWrapper small"
              elname="livefield-elem"
              comptype={20}
              id="Decimal6-li"
              needdata="true"
              compname="Decimal6"
              linkname="Decimal6"
              isvisible="true"

              unit_position={2}
              decimallength={2}
              decimalformat={1}
              mandatory="false"
              page_no={5}
              page_link_name="Page2"
            >
              <label className="labelName">
                <span>Annual ongoing investment advice fee</span>
              </label>
              <div elname="tempContDiv" className="tempContDiv">
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={50}
                  name="Decimal6"
                  value={values.otherFaOngoingAdviceFee}
                  onChange={handleChange("otherFaOngoingAdviceFee")}
                  disabled={this.props.is_form_submitted}
                />
                <span
                  className="symbol"
                  name="field_unit_after"
                  elname="field_unit_span"
                />
                <p className="errorMessage" elname="error" id="error-Decimal6" />
                <p
                  className="instruction instrSpace"
                  elname="hint"
                  id="hint-Decimal6"
                >
                  {" "}
                  % of benefit as per the member agreement and this will be
                  converted into a monthly % deducted off the benefit value
                </p>
              </div>
              <div className="clearBoth" />
            </li>


          </div> : null}

          {values.optForFA === "No" ?
            <li style={{ backgroundColor: 'lightyellow' }}
              elname="livefield-elem"
              linkname="TermsConditions"
              comptype={34}
              id="TermsConditions-li"
              needdata="true"
              compname="TermsConditions"
              className="tempFrmWrapper termsWrapper"
              mandatory="true"
              page_no={5}
              page_link_name="Page2"
              tabIndex={1}
            >
              <label className="labelName">
                <span>Acknowledgement for not opting Financial Adviser</span>
                <em className="important">*</em>
              </label>
              <div className="tempContDiv">
                <div className="termsContainer">
                  <div className="termsMsg descFld">
                    I acknowledge that by selecting "Yes" for In Fund Preservation
                    and <span style={{ fontWeight: "bold" }}>by not opting Financial Adviser</span>,
                    I am declaring that I shall be an in-fund Deferred Retiree
                    or Preserver Member of the Fund without a Financial Adviser
                    and without investment advice.
                    <div>
                      <br />
                    </div>
                  </div>
                  <div className="termsAccept">
                    <input
                      elname="statusCB"
                      className="checkBoxType flLeft"
                      name="TermsConditions"
                      type="checkbox"
                      checked={values.declarationByMemNoFA}
                      onChange={handleCheck("declarationByMemNoFA")}
                      disabled={this.props.is_form_submitted}
                    />
                    <label className="descFld">
                      I acknowledge
                      <br />
                    </label>
                  </div>
                </div>
                <p
                  className="errorMessage"
                  elname="error"
                  id="error-TermsConditions"
                >
                  {this.state.errNoFaAck}
                </p>
              </div>
              <div className="clearBoth" />
            </li> :

            <div style={{ backgroundColor: '#d4efff' }}>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={20}
                id="Decimal1-li"
                needdata="true"
                compname="Decimal1"
                linkname="Decimal1"
                isvisible="true"

                unit_position={2}
                decimallength={2}
                decimalformat={1}
                mandatory="true"
                page_no={5}
                page_link_name="Page2"
              >
                <label className="labelName">
                  <span>
                    The sum of all initial advice fees cannot exceed 1.5% (excluding
                    VAT)
                  </span>
                </label>
                <label className="labelName">
                  <span>
                    The sum of all ongoing advice fees cannot exceed 1% p.a.
                    (excluding VAT)
                  </span>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Decimal6">
                    {this.state.errInitAdviceFee}
                  </p>
                  <p className="errorMessage" elname="error" id="error-Decimal6">
                    {this.state.errOngoingAdviceFee}
                  </p>
                </div>
                <div className="clearBoth" />
              </li>
              <li
                elname="livefield-elem"
                linkname="TermsConditions"
                comptype={34}
                id="TermsConditions-li"
                needdata="true"
                compname="TermsConditions"
                className="tempFrmWrapper termsWrapper"
                mandatory="true"
                page_no={5}
                page_link_name="Page2"
                tabIndex={1}
              >
                <label className="labelName">
                  <span>FA declaration</span>
                  <em className="important">*</em>
                </label>
                <div className="tempContDiv">
                  <div className="termsContainer">
                    <div className="termsMsg descFld">
                      I declare that I am registered to market Retail Pension
                      benefits under the Financial Advisory and Intermediary
                      Services Act, No. 37 of 2002 and accept the consequences of
                      the Act.
                      <div>
                        <br />
                      </div>
                    </div>
                    <div className="termsAccept">
                      <input
                        elname="statusCB"
                        className="checkBoxType flLeft"
                        name="TermsConditions"
                        type="checkbox"
                        checked={values.declarationByFA}
                        onChange={handleCheck("declarationByFA")}
                        disabled={this.props.is_form_submitted}
                      />
                      <label className="descFld">
                        I accept the declaration
                        <br />
                      </label>
                    </div>
                  </div>
                  <p
                    className="errorMessage"
                    elname="error"
                    id="error-TermsConditions"
                  >
                    {this.state.errFaDecl}
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
                // allowedtype
                isvisible="true"
                mandatory="false"
                page_no={11}
                page_link_name="Page8"
              >

                { values.preserveFaSignature ? (
                  <label className="labelName">
                  <span>FA Signature</span>
                </label>) : null }
                <div className="tempContDiv">
                  <img style={{ width: "50%" }} src={values.preserveFaSignature}></img>
                </div>
                <div className="clearBoth" />
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
                  <span>FA Signature</span>
                  <em className="important">*</em>

                </label>
                <p>Scribble your signature on touchscreen devices and click Save</p>
                <br></br>
                <div className="tempContDiv">
                  <CanvasDraw
                    canvasWidth="100%"
                    ref={this.signCanvasFa}
                    hideGrid={true}
                    brushRadius={2}
                    canvasHeight={200}
                    style={{ border: "1px solid #ccc" }}
                    onChange={this.signed}
                    disabled={this.props.is_form_submitted}
                  />

                  <button
                    type="button"
                    className="fmSmtButton saveColor saveBtn"
                    style={{ margin: "10px 10px 10px 0" }}
                    onClick={this.createSignImgFa}
                    disabled={this.props.is_form_submitted || !this.state.isSigned}
                  >
                    Sign
                  </button>

                  <button
                    type="button"
                    className="fmSmtButton saveColor saveBtn"
                    onClick={this.clearSignFa}
                  >
                    Clear
                  </button>

                  {/* <div
                className="signContainer"
                elname="signContainer"
                id="signContainer-Signature"
              >
                <canvas
                  id="drawingCanvas-Signature1"
                  tabIndex={-1}
                  width={728}
                />
                <div
                  className="signArea"
                  id="sign-area-Signature"
                  style={{ display: "none" }}
                />
                <a
                  id="clearSign"
                  className="instrSpace"
                  href="javascript:void(0);"
                  onClick="clearSignature('drawingCanvas-Signature1');"
                >
                  Clear
                </a>
              </div> */}
                  <p className="errorMessage" elname="error" id="error-Signature">
                    {this.state.errSignature_fa}
                    <span style={{ color: "green" }}>
                      {this.state.infoSignature_fa}
                    </span>
                  </p>
                </div>
                <div className="clearBoth" />
              </li>

            </div>}
          { this.props.values.optForFA === 'Yes' ? (<li style={{ backgroundColor: '#ececec' }}
            elname="livefield-elem"
            linkname="TermsConditions1"
            comptype={34}
            id="TermsConditions1-li"
            needdata="true"
            compname="TermsConditions1"
            className="tempFrmWrapper termsWrapper"
            mandatory="false"
            page_no={5}
            page_link_name="Page2"
            tabIndex={1}
          >
            <label className="labelName">
              <span>Member's declaration</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="termsContainer">
                <div className="termsMsg descFld">
                  <div>
                    1. I understand that I may at any time instruct Liberty to
                    stop deducting or facilitating the payment of any future
                    ongoing advice fee, or I may at any time instruct Liberty to
                    change the amount of any ongoing fee or pay any future
                    ongoing fee to Liberty or to another financial adviser.{" "}
                    <br />
                  </div>
                  <div>
                    2. I understand that any ongoing advice fees agreed to in
                    this mandate may continue to be paid where the financial
                    adviser moves between distribution channels or authorised
                    financial services providers, provided that the financial
                    adviser or financial services provider is contracted with
                    Liberty and appropriately accredited in terms of prevailing
                    legislation.
                    <br />
                  </div>
                  <div>
                    3. I understand that this mandate will be automatically
                    renewed on an annual basis unless I instruct Liberty to
                    cancel it. <br />
                  </div>
                  <div>
                    4. I understand that these fees will be deducted from the
                    investment value of my policy and will therefore reduce the
                    value of my investment accordingly.
                    <br />
                  </div>
                  <div>
                    5. I understand that my financial adviser may work in a
                    Liberty approved team and any advice fee deducted may be
                    shared with the team.
                    <br />
                  </div>
                  <div>
                    6. I understand that, if the financial adviser is part of a
                    Liberty approved team and the financial adviser is for any
                    reason unable to receive the advisory fee, then the advice
                    fee will become payable to another adviser within the
                    approved team.
                    <br />
                  </div>
                  <div>
                    <br />
                  </div>
                </div>
                <div className="termsAccept">
                  <input
                    elname="statusCB"
                    className="checkBoxType flLeft"
                    name="TermsConditions1"
                    type="checkbox"
                    checked={values.declarationByMember_2}
                    onChange={handleCheck("declarationByMember_2")}
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
                id="error-TermsConditions1"
              >
                {this.state.errMemberDecl}
              </p>
            </div>
            <div className="clearBoth" />
          </li>) : null }



        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={5}
          page_count={11}
          page_link_name="Page2"
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
            <div className="footerPgNum">5/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Preservation);
