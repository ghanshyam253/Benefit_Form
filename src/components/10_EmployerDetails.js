import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import bankCodes from "../data/bank-codes.json";
import fundTypes from "../data/fund-types.json";
import $ from "jquery";
import { PulseSpinner } from "react-spinners-kit";
import {fileUpload, saveDocument} from "../helpers/fetchhelper";
import {EMPLOYER_DETAILS} from "../constants/constants";

export class EmployerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      errNoFiles: null,
      fileUploadMessage: null,
      loading: false,
      errFundType: null,
      errFundName: null,
      errEmployerName: null,
      errRefNumber: null,
      errFundNumber: null,
      errDateExit: null,
      errClaimsOption: null,
      errClaimedAmount: null
    }
  }

  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(EMPLOYER_DETAILS, () => {
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


  onChangeHandler = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
  };

  uploadHandler = () => {
    if(this.state.selectedFile === null) {
      alert('Please select a file to upload');
    } else {
    const data = new FormData();
    const uninqueId = this.props.values.uuid;
    data.append("file", this.state.selectedFile, "CLAIMSAGAINSTBENEFIT_" + this.state.selectedFile.name);
    this.setState({
      fileUploadMessage: null,
      loading: true
    })
      fileUpload(uninqueId, data, (res) => {
        if(res.status === 200) {
          this.setState({
            selectedFile: null,
            fileUploadMessage: 'File uploaded successfully',
            loading: false
          });
        } else {
          this.setState({
            selectedFile: null,
            fileUploadMessage: res.data.message,
            loading: false
          });
        }
      })
    }
  };

  saveDocument = (e) => {
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid)
    })
  }

  validateFundNum = (number) => {
    if(!number) {
      this.setState({
        errFundNumber: 'Please provide fund number'
      })
      return false;
    } else if(isNaN(number)) {
      this.setState({
        errFundNumber: 'Please provide valid fund number'
      })
      return false;
    } else {
      this.setState({
        errFundNumber: null
      })
      return true;
    }
  }

  validateClaimAmont = (amount) => {
    const { values: {claims_none_e, claims_hl_e, claims_damages_e, amountClaimed_e}} = this.props;
    if(claims_none_e) {
      this.setState({
        errClaimedAmount: null
      });
      return true;
    } else if(claims_hl_e || claims_damages_e) {
      if(!amountClaimed_e) {
        this.setState({
          errClaimedAmount: 'Please provide amount'
        });

      } else if(isNaN(amountClaimed_e)) {
        this.setState({
          errClaimedAmount: 'Please provide valid amount'
        })
        return false;
      } else {
        this.setState({
          errClaimedAmount: null
        });
        return true;
      }
    }
  }

  validateData = (callback) => {
    const {
      values: { fundType_umbrellaProvident_e,
        fundType_umbrellaPension_e, fundType_standAlone_e,
        fundName_e, employerName_e, employeeRefNo_e, fundNo_e,
        dtWithdrawal_e, claims_none_e, claims_hl_e, claims_damages_e, amountClaimed_e }} = this.props;

    const fund_num = this.validateFundNum(fundNo_e);
    const claim_amount = this.validateClaimAmont(amountClaimed_e);

    if((fundType_umbrellaProvident_e || fundType_umbrellaPension_e || fundType_standAlone_e) &&
        fundName_e && employerName_e && employeeRefNo_e && fund_num && dtWithdrawal_e &&
        (claims_none_e || claims_hl_e || claims_damages_e) && claim_amount){
      callback();
    } else {
      if(!(fundType_umbrellaProvident_e || fundType_umbrellaPension_e || fundType_standAlone_e) ) {
        this.setState({
          errFundType: 'Please select Fund Type'
        });
      } else {
        this.setState({
          errFundType: null
        });
      }

      if(!fundName_e) {
        this.setState({
          errFundName: 'Please provide fund name'
        })
      } else {
        this.setState({
          errFundName: null
        })
      }

      if(!employerName_e) {
        this.setState({
          errEmployerName: 'Please provide employer name'
        })
      } else {
        this.setState({
          errEmployerName: null
        })
      }
      if(!employeeRefNo_e) {
        this.setState({
          errRefNumber: 'Please provide employee /payroll ref Number'
        })
      } else {
        this.setState({
          errRefNumber: null
        })
      }
      if(!dtWithdrawal_e) {
        this.setState({
          errDateExit: 'Please provide date'
        })
      } else {
        this.setState({
          errDateExit: null
        })
      }

      if(!(claims_none_e || claims_hl_e || claims_damages_e)) {
        this.setState({
          errClaimsOption: 'Please select atleast one option'
        })
      } else {
        this.setState({
          errClaimsOption: null
        })
      }

    }
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.props.clearValidPage(EMPLOYER_DETAILS);
      this.props.handleNav(12);
      this.nextPath("/declarationEmp");
    })

  };

  back = (e) => {
    e.preventDefault();
    this.props.handleNav(2);
    this.nextPath("/yourOptions");
  };

  nextPath = (path) => {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  };

  checkDisableStatus = (fund) => {
    const { is_form_submitted,
      values: { fundType_umbrellaProvident_e,
        fundType_umbrellaPension_e, fundType_standAlone_e} } = this.props;
    if(is_form_submitted) {
      return true;
    }
    if(fund === 'provident' && fundType_umbrellaPension_e && fundType_standAlone_e) {
      return true
    } else if(fund === 'pension' && fundType_umbrellaProvident_e && fundType_standAlone_e) {
      return true
    } else if(fund === 'standalone' && fundType_umbrellaPension_e && fundType_umbrellaProvident_e) {
      return true
    }
    return false
  }

  checkClaimOptionDisableStatus(option) {
    const { is_form_submitted, values: {
      claims_none_e, claims_hl_e, claims_damages_e
    }} = this.props;

    if(is_form_submitted) {
      return true;
    }
    if(option === 'none' && (claims_hl_e || claims_damages_e)) {
      return true;
    } else if(option !== 'none' && claims_none_e) {
      return true;
    }
    return false;
  }


  render() {
    const {
      values,
      handleChange,
      handleDate,
      handleBankSelection,
      handleCheck,
    } = this.props;

    // const { showing } = this.state;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={9}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section9-li"
            className="section"
            elname="livefield-elem"
            compname="Section9"
            comptype={0}
            page_no={9}
            page_link_name="Page6"
          >
            <h2>FUND DETAILS</h2>
            <p>Completed by employer</p>
          </li>
          <li
            className="zfcheckbox tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={14}
            needdata="true"
            id="Checkbox1-li"
            compname="Checkbox1"
            linkname="Checkbox1"
            isvisible="true"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Fund type</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                {/* { this.renderFundType } */}
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox1_1"
                    className="checkBoxType"
                    name="Checkbox1"
                    elname="Checkbox1"
                    checked={values.fundType_umbrellaProvident_e}
                    onChange={handleChange("fundType_umbrellaProvident_e")}
                    disabled={this.checkDisableStatus('provident')}
                  />
                  <label htmlFor="Checkbox1_1" className="checkChoice">
                    UMBRELLA PROVIDENT
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox1_2"
                    className="checkBoxType"
                    name="Checkbox1"
                    elname="Checkbox1"
                    checked={values.fundType_umbrellaPension_e}
                    onChange={handleChange("fundType_umbrellaPension_e")}
                    disabled={this.checkDisableStatus('pension')}
                  />
                  <label htmlFor="Checkbox1_2" className="checkChoice">
                    UMBRELLA PENSION
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox1_3"
                    className="checkBoxType"
                    name="Checkbox1"
                    elname="Checkbox1"
                    checked={values.fundType_standAlone_e}
                    onChange={handleChange("fundType_standAlone_e")}
                    disabled={this.checkDisableStatus('standalone')}
                  />
                  <label htmlFor="Checkbox1_3" className="checkChoice">
                    STAND ALONE
                  </label>
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Checkbox1">
                {this.state.errFundType}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine29-li"
            needdata="true"
            compname="SingleLine29"
            linkname="SingleLine29"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Fund name</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine29"
                  value={values.fundName_e}
                  onChange={handleChange("fundName_e")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p className="errorMessage" elname="error" id="error-SingleLine29">
                {this.state.errFundName}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine30-li"
            needdata="true"
            compname="SingleLine30"
            linkname="SingleLine30"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Employer name</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine30"
                  value={values.employerName_e}
                  onChange={handleChange("employerName_e")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine30"
              >
                {this.state.errEmployerName}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine31-li"
            needdata="true"
            compname="SingleLine31"
            linkname="SingleLine31"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Employee /Payroll ref Number</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine31"
                  value={values.employeeRefNo_e}
                  onChange={handleChange("employeeRefNo_e")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine31"
              >
                {this.state.errRefNumber}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine32-li"
            needdata="true"
            compname="SingleLine32"
            linkname="SingleLine32"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Fund number</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine32"
                  value={values.fundNo_e}
                  onChange={handleChange("fundNo_e")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine32"
              >
                {this.state.errFundNumber}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper date"
            style={{ paddingTop: "95px", height: "165px" }}
            tabIndex={1}
            elname="livefield-elem"
            comptype={5}
            id="Date-li"
            compname="Date"
            linkname="Date"
            needdata="true"
            isvisible="true"
            disableddays="{}"
            startoftheweek={0}
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Date of exit</span>
              <em className="important">*</em>
            </label>
            <div
              className="tempContDiv"
              datelocale="en-GB"
              elname="dd/MM/yyyy"
              id="DatedateDiv"
              isdisable="false"
            >
              <span>
                <DatePicker
                  selected={Date.parse(values.dtWithdrawal_e)}
                  onChange={(date) => handleDate(date, "dtWithdrawal_e")}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="right"
                  disabled={this.props.is_form_submitted}
                />
                <label className="formSubInfoText">dd/mm/yyyy</label>{" "}
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-Date"
              >
                {this.state.errDateExit}
              </p>
              <span style={{ display: "none" }}> </span>
            </div>
          </li>
          {/*To exclude Section field in rules we are setting comptype as 0 for Section field. That is Section field will not be included in any condition. */}
          <li
            tabIndex={1}
            id="Section10-li"
            className="section"
            elname="livefield-elem"
            compname="Section10"
            comptype={0}
            page_no={9}
            page_link_name="Page6"
          >
            <h2>CLAIMS AGAINST BENEFIT</h2>
            <p>
              A claim against the member’s benefit is subject to relevant
              legislation and approval by the Fund
            </p>
          </li>
          <li
            className="zfcheckbox tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={14}
            needdata="true"
            id="Checkbox2-li"
            compname="Checkbox2"
            linkname="Checkbox2"
            isvisible="true"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Please tick relevant option</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox2_1"
                    className="checkBoxType"
                    name="Checkbox2"
                    elname="Checkbox2"
                    defaultValue="None"
                    disabled={this.checkClaimOptionDisableStatus('none')}
                    checked={values.claims_none_e}
                    onChange={handleChange("claims_none_e")}
                  />
                  <label htmlFor="Checkbox2_1" className="checkChoice">
                    None
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox2_2"
                    className="checkBoxType"
                    name="Checkbox2"
                    elname="Checkbox2"
                    defaultValue="Housing Loan - Employee has a housing loan from the fund. The fund will confirm and pay the settlement amount"
                    disabled={this.checkClaimOptionDisableStatus()}
                    checked={values.claims_hl_e}
                    onChange={handleChange("claims_hl_e")}
                  />
                  <label htmlFor="Checkbox2_2" className="checkChoice">
                    Housing Loan - Employee has a housing loan from the fund.
                    The fund will confirm and pay the settlement amount
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox2_3"
                    className="checkBoxType"
                    name="Checkbox2"
                    elname="Checkbox2"
                    defaultValue="Damages - Damages caused to the employer as a result of fraud, theft, dishonesty or misconduct."
                    disabled={this.checkClaimOptionDisableStatus()}
                    checked={values.claims_damages_e}
                    onChange={handleChange("claims_damages_e")}
                    // onChange={this.handleClaimsAgainstBenefitOptions}
                  />
                  <label htmlFor="Checkbox2_3" className="checkChoice">
                    Damages - Damages caused to the employer as a result of
                    fraud, theft, dishonesty or misconduct.
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-Checkbox2"
              >
                {this.state.errClaimsOption}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="zfcheckbox tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={14}
            needdata="true"
            id="Checkbox3-li"
            compname="Checkbox3"
            linkname="Checkbox3"
            isvisible="true"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Document(s) included</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox3_1"
                    className="checkBoxType"
                    name="Checkbox3"
                    elname="Checkbox3"
                    defaultValue="Written admission"
                    disabled={this.props.is_form_submitted}
                    checked={values.docs_writtenAdmission_e}
                    onChange={handleChange("docs_writtenAdmission_e")}
                  />
                  <label htmlFor="Checkbox3_1" className="checkChoice">
                    Written admission
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox3_2"
                    className="checkBoxType"
                    name="Checkbox3"
                    elname="Checkbox3"
                    defaultValue="Court order"
                    disabled={this.props.is_form_submitted}
                    checked={values.docs_courtOrder_e}
                    onChange={handleChange("docs_courtOrder_e")}
                  />
                  <label htmlFor="Checkbox3_2" className="checkChoice">
                    Court order
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="checkbox"
                    id="Checkbox3_3"
                    className="checkBoxType"
                    name="Checkbox3"
                    elname="Checkbox3"
                    defaultValue="Case number"
                    disabled={this.props.is_form_submitted}
                    checked={values.docs_caseNo_e}
                    onChange={handleChange("docs_caseNo_e")}
                  />
                  <label htmlFor="Checkbox3_3" className="checkChoice">
                    Case number
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-Checkbox3"
                style={{ display: "none" }}
              />
            </div>
            <div className="clearBoth" />
          </li>

          <li
            className="tempFrmWrapper file_upload"
            uploadlimit={1}
            elname="livefield-elem"
            comptype={19}
            id="FileUpload3-li"
            needdata="true"
            compname="FileUpload3"
            linkname="FileUpload3"

            isvisible="true"
            mandatory="false"
            page_no={4}
            page_link_name="Page9"
          >
            <label className="labelName">
              <span>
                Please provide supporting document
              </span><br/><br/>
              <span>Note: Please upload your files in PDF or JPEG or PNG format</span>
            </label>
            <div className="tempContDiv">
              <input
                type="file"
                name="file"
                disabled={this.props.is_form_submitted}
                onChange={this.onChangeHandler}
              />

              <button
                className="fmSmtButton saveColor saveBtn"
                style={{ marginLeft: "10px" }}
                type="button"
                elname="next"
                onClick={this.uploadHandler}
                disabled={this.props.is_form_submitted}
              >
                <em> Upload </em>
              </button>
            </div>
            <div className="clearBoth" style={{marginTop: '10px'}}>
              <PulseSpinner
                loading={this.state.loading}
                color="#00164e"
              />
              { this.state.fileUploadMessage }
            </div>
          </li>

          <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={20}
            id="Decimal2-li"
            needdata="true"
            compname="Decimal2"
            linkname="Decimal2"
            isvisible="true"
            field_unit
            unit_position={2}
            decimallength={2}
            decimalformat={1}
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Amount being claimed (R)</span>
              {(values.claims_hl_e || values.claims_damages_e ) ? (<em className="important">*</em>) : null }
            </label>
            <div elname="tempContDiv" className="tempContDiv">
              <input
                autoComplete='nofill'
                type="text"
                maxLength={50}
                name="Decimal2"
                value={values.amountClaimed_e}
                onChange={handleChange("amountClaimed_e")}
                disabled={this.props.is_form_submitted}
              />
              <span
                className="symbol"
                name="field_unit_after"
                elname="field_unit_span"
              />
              <p
                className="errorMessage"
                elname="error"
                id="error-Decimal2"
              >
                {this.state.errClaimedAmount}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          {/*To exclude Section field in rules we are setting comptype as 0 for Section field. That is Section field will not be included in any condition. */}
          { values.claims_damages_e ?
          <div>
          <li
            tabIndex={1}
            id="Section11-li"
            className="section"
            elname="livefield-elem"
            compname="Section11"
            comptype={0}
            page_no={9}
            page_link_name="Page6"
          >
            <h2>Employer Bank Details</h2>
            <p>Only applicable if there is a claim against member's benefit</p>
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine33-li"
            needdata="true"
            compname="SingleLine33"
            linkname="SingleLine33"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Account holder</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine33"
                  value={values.accountHolder_e}
                  onChange={handleChange("accountHolder_e")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine33"
                style={{ display: "none" }}
              />
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
              <span>Bank name</span>
            </label>
            <div className="tempContDiv">
              <div className="form_sBox">
                <div className="customArrow" />
                <select
                  name="Dropdown"
                  onChange={handleBankSelection('bankName_e', 'universalCode_e')}
                  value={values.bankName_e}
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
                {/* { this.state.errBankCode } */}
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
              {values.universalCode_e}

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
            id="SingleLine34-li"
            needdata="true"
            compname="SingleLine34"
            linkname="SingleLine34"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Branch name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine34"
                  value={values.branchName_e}
                  onChange={handleChange("branchName_e")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine34"
                style={{ display: "none" }}
              />
            </div>
            <div className="clearBoth" />
          </li>

          <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={3}
            id="Number6-li"
            needdata="true"
            compname="Number6"
            linkname="Number6"
            isvisible="true"
            mandatory="false"
            unit_position={2}
            field_unit
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Account number</span>
            </label>
            <div elname="tempContDiv" className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={18}
                  name="Number6"
                  value={values.accountNo_e}
                  onChange={handleChange("accountNo_e")}
                />{" "}
              </span>
              <span
                className="symbol"
                name="field_unit_after"
                elname="field_unit_span"
              />
              <p
                className="errorMessage"
                elname="error"
                id="error-Number6"
                style={{ display: "none" }}
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio9-li"
            needdata="true"
            compname="Radio9"
            linkname="Radio9"
            isvisible="true"
            mandatory="false"
            page_no={9}
            page_link_name="Page6"
          >
            <label className="labelName">
              <span>Account type</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio9_1"
                    name="Radio9"
                    elname="Radio9"
                    className="radioBtnType"
                    defaultValue="Cheque"
                    checked={values.accountType_e === "Cheque"}
                    onChange={handleChange("accountType_e")}
                  />
                  <label htmlFor="Radio9_1" className="radioChoice">
                    Cheque
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio9_2"
                    name="Radio9"
                    elname="Radio9"
                    className="radioBtnType"
                    defaultValue="Savings"
                    checked={values.accountType_e === "Savings"}
                    onChange={handleChange("accountType_e")}
                  />
                  <label htmlFor="Radio9_2" className="radioChoice">
                    Savings
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio9_3"
                    name="Radio9"
                    elname="Radio9"
                    className="radioBtnType"
                    defaultValue="Transmission"
                    checked={values.accountType_e === "Transmission"}
                    onChange={handleChange("accountType_e")}
                  />
                  <label htmlFor="Radio9_3" className="radioChoice">
                    Transmission
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-Radio9"
                style={{ display: "none" }}
              />
            </div>
            <div className="clearBoth" />
          </li>
          </div> : null }
        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={9}
          page_count={11}
          page_link_name="Page6"
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
                    recordlinkid
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
            <div className="footerPgNum">10/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(EmployerDetails);
