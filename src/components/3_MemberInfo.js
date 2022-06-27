import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import bankCodes from "../data/bank-codes.json";
import countryCodes from "../data/countries.json";
import $ from "jquery";
import {saveDocument} from "../helpers/fetchhelper";
import { MEMBER_INFO } from "../constants/constants";

export class MemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errName: null,
      errTaxNo: null,
      errPhoneNo: null,
      errAddress: null,
      errBankCode: null,
      errAccNo: null,
      errAccHolder: null,
      // errBranchCode: null,
      errAccType: null,
      errIdType: null,
      errSaid: null
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log(nextProps)
  }

  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(MEMBER_INFO, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body, () => {
        callback();
      });
    })
  };

  banks = bankCodes.map((bank) => {
    return (
      <option key={bank.code} data-key={bank.code} value={bank.name}>
        {bank.name}
      </option>
    );
  });

  countries = countryCodes.map((country) => {
    return (
      <option key={country.code} data-key={country.code} value={country.name}>
        {country.name}
      </option>
    );
  });

  dialCodes = countryCodes.map((dialCode) => {
    return (
      <option key={dialCode.code} data-key={dialCode.code} value={dialCode.dial_code}>
        ({dialCode.dial_code}) {dialCode.name}
      </option>
    );
  });

  ValidateSAID = (id) => {

    var i, c,
    even = '',
    sum = 0,
    check = id.slice(-1);

    if (id.length !== 13 || id.match(/\D/)) {
        return false;
    }
    id = id.substr(0, id.length - 1);
    for (i = 0; c = id.charAt(i); i += 2) {
        sum += +c;
        even += id.charAt(i + 1);
    }
    even = '' + even * 2;
    for (i = 0; c = even.charAt(i); i++) {
        sum += +c;
    }
    sum = 10 - ('' + sum).charAt(1);
    return ('' + sum).slice(-1) == check;

  }

  saveDocument = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid);
    })
  }

  validateData = (callback) => {
// Income tax no. should be exactly 10 digits
    let taxNoValid = /^\d{10}$/.test(this.props.values.incomeTaxNo.trim());

    // Phone number should be atleat 10 digits
    let phoneNoValid = /^\d{10,}$/.test(this.props.values.phone.trim());

    // Account number numeric validation
    let accNoValid = /^\d[0-9]*$/.test(this.props.values.accNo.trim());

    // Check only if SAID is selected
    let checkSAID = true;
    if(this.props.values.idType == "saidNumber")
      checkSAID = this.ValidateSAID(this.props.values.saidNumber.trim());

    // let allValid = false;

    if(this.props.values.claimOption === "In-Fund Preservation" || this.props.values.claimOption === "Transfer") {
      if (
        // this.props.values.namePrefix &&
        this.props.values.firstName &&
        this.props.values.lastName &&
        this.props.values.idType &&
        checkSAID &&
        taxNoValid &&
        phoneNoValid &&
        this.props.values.streetAddress &&
        this.props.values.addressLine2 &&
        this.props.values.city &&
        this.props.values.region &&
        this.props.values.zip
      ) {
        callback();
        this.setState({
          errName: null,
          errTaxNo: null,
          errPhoneNo: null,
          errAddress: null,
          errBankCode: null,
          errAccNo: null,
          errAccHolder: null,
          // errBranchCode: null,
          errAccType: null,
          errIdType: null,
          errSaid: null
        });
      } else {
        if (
          // !this.props.values.namePrefix ||
          !this.props.values.firstName ||
          !this.props.values.lastName
        ) {
          this.setState({
            errName: "Please enter your title, first and last name",
          });
        } else {
          this.setState({ errName: null });
        }

        if (!taxNoValid) {
          this.setState({
            errTaxNo: "Please enter your valid 10 digit tax number",
          });
        } else {
          this.setState({ errTaxNo: null });
        }

        if (!phoneNoValid) {
          this.setState({
            errPhoneNo:
              "Please enter your valid phone number with atleast 10 digits",
          });
        } else {
          this.setState({ errPhoneNo: null });
        }

        if (
          !this.props.values.streetAddress ||
          !this.props.values.addressLine2 ||
          !this.props.values.city ||
          !this.props.values.region ||
          !this.props.values.zip
        ) {
          this.setState({
            errAddress: "Please do not leave any address field blank",
          });
        } else {
          this.setState({ errAddress: null });
        }
        if (!this.props.values.saidNumber || !this.props.values.idType) {
          this.setState({ errIdType: "Please select an ID type and provide a valid ID number" });
        } else {
          this.setState({ errIdType: null });
        }

        if(checkSAID) {
          this.setState({ errSaid: null });
        }
        else {
          this.setState({ errSaid: 'Please enter valid SA ID number' });
        }
      }
    }
    else {
      if (
        // this.props.values.namePrefix &&
        this.props.values.firstName &&
        this.props.values.lastName &&
        this.props.values.idType &&
        checkSAID &&
        taxNoValid &&
        phoneNoValid &&
        this.props.values.streetAddress &&
        this.props.values.addressLine2 &&
        this.props.values.city &&
        this.props.values.region &&
        this.props.values.zip &&
        this.props.values.bankCode &&
        accNoValid &&
        this.props.values.accHolder &&
        // && this.props.values.branchCode
        this.props.values.accType
      ) {
          callback();
        this.setState({
          errName: null,
          errTaxNo: null,
          errPhoneNo: null,
          errAddress: null,
          errBankCode: null,
          errAccNo: null,
          errAccHolder: null,
          // errBranchCode: null,
          errAccType: null,
          errIdType: null,
          errSaid: null
        });
      } else {
        if (
          // !this.props.values.namePrefix ||
          !this.props.values.firstName ||
          !this.props.values.lastName
        ) {
          this.setState({
            errName: "Please enter your title, first and last name",
          });
        } else {
          this.setState({ errName: null });
        }

        if (!taxNoValid) {
          this.setState({
            errTaxNo: "Please enter your valid 10 digit tax number",
          });
        } else {
          this.setState({ errTaxNo: null });
        }

        if (!phoneNoValid) {
          this.setState({
            errPhoneNo:
              "Please enter your valid phone number with atleast 10 digits",
          });
        } else {
          this.setState({ errPhoneNo: null });
        }

        if (
          !this.props.values.streetAddress ||
          !this.props.values.addressLine2 ||
          !this.props.values.city ||
          !this.props.values.region ||
          !this.props.values.zip
        ) {
          this.setState({
            errAddress: "Please do not leave any address field blank",
          });
        } else {
          this.setState({ errAddress: null });
        }



        if (!this.props.values.bankCode) {
          this.setState({ errBankCode: "Please select the bank" });
        } else {
          this.setState({ errBankCode: null });
        }

        if (!accNoValid || !this.props.values.accNo) {
          this.setState({ errAccNo: "Please enter valid account number" });
        } else {
          this.setState({ errAccNo: null });
        }

        if (!this.props.values.accHolder) {
          this.setState({ errAccHolder: "Please enter account holder name" });
        } else {
          this.setState({ errAccHolder: null });
        }

        // if(!this.props.values.branchCode) {
        //     this.setState({ errBranchCode: 'Please enter branch code' });
        // } else { this.setState({ errBranchCode: null }); }

        if (!this.props.values.accType) {
          this.setState({ errAccType: "Please select bank account type" });
        } else {
          this.setState({ errAccType: null });
        }




        if (!this.props.values.saidNumber || !this.props.values.idType) {
          this.setState({ errIdType: "Please select an ID type and provide a valid ID number" });
        } else {
          this.setState({ errIdType: null });
        }

        if(checkSAID) {
          this.setState({ errSaid: null });
        }
        else {
          this.setState({ errSaid: 'Please enter valid SA ID number' });
        }
      }
    }
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/claims");
      this.props.handleNav(4);
        this.props.clearValidPage(MEMBER_INFO);
    })
  };

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.nextPath("/yourOptions");
    this.props.handleNav(2);
  };

  nextPath(path) {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  }

  render() {
    const { values, handleChange, handleBankSelection } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={3}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section15-li"
            className="section"
            elname="livefield-elem"
            compname="Section15"
            comptype={0}
            page_no={3}
            page_link_name="Page1"
          >
            <h2>MEMBER INFORMATION</h2>
            <p />
          </li>
          <li
            className="tempFrmWrapper name namelarge"
            elname="livefield-elem"
            comptype={7}
            needdata="true"
            id="Name-li"
            compname="Name"
            linkname="Name"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Name</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv twoType">
              <div className="nameWrapper salutationWrapper">
                {/* <span className="salutation">
                  <div className="form_sBox">
                    <div className="customArrow" />
                    <select
                      onChange={handleChange("namePrefix")}
                      value={values.namePrefix}
                      autoComplete="off"
                      name="Name"
                      complink="Name_Salutation"
                      id="Name_Salutation"
                      mandatory="false"
                      tabIndex="1"
                    >
                      <option defaultValue value="">
                        -Select-
                      </option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                    </select>
                  </div>
                  <label className="formSubInfoText">Title</label>
                </span> */}
                <span>
                  <input
                    type="text"
                    tabIndex="2"
                    onChange={handleChange("firstName")}
                    value={values.firstName}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">First</label>
                </span>
                <span>
                  <input
                    type="text"
                    tabIndex="3"
                    onChange={handleChange("lastName")}
                    value={values.lastName}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">Last</label>
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Name">
                {this.state.errName}
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
              <span>Membership number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="4"
                  onChange={handleChange("membershipNo")}
                  value={values.membershipNo}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine36"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio2-li"
            needdata="true"
            compname="Radio2"
            linkname="Radio2"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>ID</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio2_1"
                    name="Radio3"
                    elname="Radio2"
                    className="radioBtnType"
                    defaultValue="saidNumber"
                    disabled={this.props.is_form_submitted}
                    checked={values.idType === "saidNumber"}
                    onChange={handleChange("idType")}
                  />
                  <label htmlFor="Radio2_1" className="radioChoice">
                    SA ID number (for South African citizens &amp; residents)
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio2_2"
                    name="Radio3"
                    elname="Radio2"
                    className="radioBtnType"
                    defaultValue="passport"
                    disabled={this.props.is_form_submitted}
                    checked={values.idType === "passport"}
                    onChange={handleChange("idType")}
                  />
                  <label htmlFor="Radio2_2" className="radioChoice">
                    Passport number (for non-South African citizens)
                  </label>{" "}
                </span>
                <span>
                  <input
                    style={{ width: "50%" }}
                    type="text"
                    tabIndex="5"
                    onChange={handleChange("saidNumber")}
                    value={values.saidNumber}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio2">
                <p>{this.state.errIdType}</p>
                <p>{this.state.errSaid}</p>
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          {/* <li elname="livefield-elem" comptype={1} id="SingleLine37-li" needdata="true" compname="SingleLine37" linkname="SingleLine37" isvisible="true" className="tempFrmWrapper small" mandatory="true" page_no={3} page_link_name="Page1">
                        <label className="labelName"><span>SA ID number (for South African citizens)</span>
                            <em className="important">*</em>
                        </label>
                        <div className="tempContDiv">
                            <span><input type="text" tabIndex="5" onChange={handleChange('saID')} value={values.saID} /></span>
                            <p className="errorMessage" elname="error" id="error-SingleLine37" />
                        </div>
                        <div className="clearBoth" />
                    </li>
                    <li elname="livefield-elem" comptype={1} id="SingleLine37-li" needdata="true" compname="SingleLine37" linkname="SingleLine37" isvisible="true" className="tempFrmWrapper small" mandatory="true" page_no={3} page_link_name="Page1">
                        <label className="labelName"><span>Passport number (for non-South African citizens)</span>
                            <em className="important">*</em>
                        </label>
                        <div className="tempContDiv">
                            <span><input type="text" tabIndex="5" onChange={handleChange('passportNo')} value={values.passportNo} /></span>
                            <p className="errorMessage" elname="error" id="error-SingleLine37" />
                        </div>
                        <div className="clearBoth" />
                    </li> */}
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine38-li"
            needdata="true"
            compname="SingleLine38"
            linkname="SingleLine38"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Income tax number</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="6"
                  onChange={handleChange("incomeTaxNo")}
                  value={values.incomeTaxNo}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine38"
              >
                {this.state.errTaxNo}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          {/* <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine39-li"
            needdata="true"
            compname="SingleLine39"
            linkname="SingleLine39"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Annual taxable income (R)</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="7"
                  onChange={handleChange("annualTaxableIncome")}
                  value={values.annualTaxableIncome}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine39"
              />
            </div>
            <div className="clearBoth" />
          </li> */}
          <li
            className="tempFrmWrapper phone small"
            elname="livefield-elem"
            comptype={11}
            id="PhoneNumber-li"
            needdata="true"
            compname="PhoneNumber"
            linkname="PhoneNumber"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
            need_reconf="false"
          >
            <label className="labelName">
              <span>Phone</span>
              <em className="important">*</em>
            </label>
            <div
              className="tempContDiv"
              elname="phoneFormatElem"
              phoneformat="INTERNATIONAL"
            >
              <div className="form_sBox" style={{width: '15%', float: 'left'}}>
                <div className="customArrow" />
                <select
                  onChange={handleChange("dialCode")}
                  value={values.dialCode}
                  tabIndex="15"
                  autoComplete="off"
                  name="Address"
                  complink="Address_Country"
                  id="Address_Country"
                  mandatory="true"
                  disabled={this.props.is_form_submitted}
                >
                  {this.dialCodes}
                </select>
              </div>
              <div elname="phoneFld" name="phone-elements" style={{marginLeft: '10px', float: 'left', width: '50%'}}>
                <input
                  type="text"
                  tabIndex="8"
                  onChange={handleChange("phone")}
                  value={values.phone}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </div><br /> <br />
              <p className="errorMessage" elname="error" id="error-PhoneNumber">
                {this.state.errPhoneNo}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper email small"
            elname="livefield-elem"
            comptype={9}
            id="Email-li"
            needdata="true"
            compname="Email"
            linkname="Email"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
            domain_option={0}
            need_reconf="false"
          >
            <label className="labelName">
              <span>Email</span>
              {/* <em className="important">*</em> */}
            </label>
            <div className="tempContDiv">
              <span elname="livefield-email-elem">
                <input
                  type="text"
                  tabIndex="9"
                  onChange={handleChange("email")}
                  value={values.email}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
                <p className="errorMessage" elname="error" id="error-Email" />
              </span>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper address  addrlarge"
            elname="livefield-elem"
            comptype={8}
            needdata="true"
            id="Address-li"
            compname="Address"
            linkname="Address"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <div className="arrowNav" />
            <label className="labelName">
              <span>Residential Address</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv address">
              <div className="addrCont">
                <span className="addOne">
                  <input
                    type="text"
                    tabIndex="10"
                    onChange={handleChange("streetAddress")}
                    value={values.streetAddress}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">Street Address</label>{" "}
                </span>
                <span className="addOne">
                  <input
                    type="text"
                    tabIndex="11"
                    onChange={handleChange("addressLine2")}
                    value={values.addressLine2}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">Address Line 2/Suburb</label>{" "}
                </span>
                <span className="flLeft addtwo">
                  <input
                    type="text"
                    tabIndex="12"
                    onChange={handleChange("city")}
                    value={values.city}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">City</label>{" "}
                </span>
                <span className="flLeft addtwo">
                  <input
                    type="text"
                    tabIndex="13"
                    onChange={handleChange("region")}
                    value={values.region}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">
                    State/Region/Province
                  </label>{" "}
                </span>
                <span className="flLeft addtwo">
                  <input
                    type="text"
                    tabIndex="14"
                    onChange={handleChange("zip")}
                    value={values.zip}
                    autoComplete='nofill'
                    disabled={this.props.is_form_submitted}
                  />
                  <label className="formSubInfoText">Postal / Zip Code</label>{" "}
                </span>
                <span className="flLeft addtwo">
                  {" "}
                  <div className="form_sBox">
                    <div className="customArrow" />
                    <select
                      onChange={handleChange("country")}
                      value={values.country}
                      tabIndex="15"
                      autoComplete="off"
                      name="Address"
                      complink="Address_Country"
                      id="Address_Country"
                      mandatory="true"
                      disabled={this.props.is_form_submitted}
                    >
                      {this.countries}
                    </select>
                  </div>
                  {/* Display name of 'Country' component of 'Address' field. */}
                  <label className="formSubInfoText formSubInfoAlign">
                    Country
                  </label>{" "}
                </span>
                <div className="clearBoth" />
                <p className="errorMessage" elname="error" id="error-Address">
                  {this.state.errAddress}
                </p>
              </div>
            </div>
            <div className="clearBoth" />
          </li>

          {values.claimOption !== "In-Fund Preservation" && values.claimOption !== "Transfer" ?
          <div>
          <li
            className="tempFrmWrapper dropdown small"
            elname="livefield-elem"
            comptype={12}
            id="Dropdown-li"
            needdata="true"
            compname="Dropdown"
            linkname="Dropdown"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Name of the bank</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="form_sBox">
                <div className="customArrow" />
                <select
                  name="Dropdown"
                  onChange={handleBankSelection('selectedBank', 'bankCode')}
                  value={values.selectedBank}
                  tabIndex="16"
                  disabled={this.props.is_form_submitted}
                >
                  {this.banks}
                </select>
              </div>
              <div
                elname="liveFieldTempChoiceCont"
                style={{ display: "none" }}
              />
              <p className="errorMessage" elname="error" id="error-Dropdown">
                {this.state.errBankCode}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper dropdown small"
            elname="livefield-elem"
            comptype={12}
            id="Dropdown3-li"
            needdata="true"
            compname="Dropdown3"
            linkname="Dropdown3"
            isvisible="true"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Universal code</span>
            </label>
            <div className="tempContDiv">
              {values.bankCode}

              <div
                elname="liveFieldTempChoiceCont"
                style={{ display: "none" }}
              />
              <p className="errorMessage" elname="error" id="error-Dropdown3" />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine-li"
            needdata="true"
            compname="SingleLine"
            linkname="SingleLine"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Account number</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="17"
                  onChange={handleChange("accNo")}
                  value={values.accNo}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p className="errorMessage" elname="error" id="error-Dropdown">
                {this.state.errAccNo}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine1-li"
            needdata="true"
            compname="SingleLine1"
            linkname="SingleLine1"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Account holder</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  type="text"
                  tabIndex="18"
                  onChange={handleChange("accHolder")}
                  value={values.accHolder}
                  autoComplete='nofill'
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p className="errorMessage" elname="error" id="error-Dropdown">
                {this.state.errAccHolder}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          {/* <li className="tempFrmWrapper small" elname="livefield-elem" comptype={3} id="Number-li" needdata="true" compname="Number" linkname="Number" isvisible="true" mandatory="true" unit_position={2} field_unit page_no={3} page_link_name="Page1">
                        <label className="labelName"><span>Branch code</span>
                            <em className="important">*</em>
                        </label>
                        <div elname="tempContDiv" className="tempContDiv">
                            <span><input type="text" tabIndex="19" onChange={handleChange('branchCode')} value={values.branchCode} /> </span>
                            <span className="symbol" name="field_unit_after" elname="field_unit_span" />
                            <p className="errorMessage" elname="error" id="error-Dropdown">
                                { this.state.errBranchCode }
                            </p>
                        </div>
                        <div className="clearBoth" />
                    </li> */}
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio2-li"
            needdata="true"
            compname="Radio2"
            linkname="Radio2"
            isvisible="true"
            mandatory="true"
            page_no={3}
            page_link_name="Page1"
          >
            <label className="labelName">
              <span>Account type</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio2_1"
                    name="Radio2"
                    elname="Radio2"
                    className="radioBtnType"
                    defaultValue="Saving"
                    checked={values.accType === "Saving"}
                    onChange={handleChange("accType")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio2_1" className="radioChoice">
                    Saving
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio2_2"
                    name="Radio2"
                    elname="Radio2"
                    className="radioBtnType"
                    defaultValue="Cheque"
                    disabled={this.props.is_form_submitted}
                    checked={values.accType === "Cheque"}
                    onChange={handleChange("accType")}
                  />
                  <label htmlFor="Radio2_2" className="radioChoice">
                    Cheque
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio2_3"
                    name="Radio2"
                    elname="Radio2"
                    className="radioBtnType"
                    defaultValue="Transmission"
                    disabled={this.props.is_form_submitted}
                    checked={values.accType === "Transmission"}
                    onChange={handleChange("accType")}
                  />
                  <label htmlFor="Radio2_3" className="radioChoice">
                    Transmission
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio2">
                {this.state.errAccType}
              </p>
            </div>
            <div className="clearBoth" />

          </li></div>
          : null }
          <div style={{ border: "1px solid #00164e", padding: "10px" }}>
              Important <br />
              • Payment will not be made into a 3rd party’s account. <br />
              • Liberty will not make payment by cheque. <br />
              • Benefits are payable in South African Rands only and it is the
              member’s responsibility to arrange the transfer of their funds
              outside South Africa.
              <br />
            </div>
        </ul>
        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={3}
          page_count={11}
          page_link_name="Page1"
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
            <div className="footerPgNum">3/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(MemberInfo);
