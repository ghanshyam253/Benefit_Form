import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import bankCodes from "../data/bank-codes.json";
import $ from "jquery";
import {saveDocument} from "../helpers/fetchhelper";
import {TRANSFER} from "../constants/constants";

export class Transfer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errTransferTo: null,
      errTransferPercent: null
    };
  }

  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(TRANSFER, () => {
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

  validateData = (callback) => {
    if(this.props.values.transferTo) {

      var _nextPath = "";
      var _nav = 0;

      switch (this.props.values.claimOption) {
        case "Transfer":
          _nextPath = "/declaration";
          _nav = 11;
          break;

        case "Cash & Transfer":
          _nextPath = "/cash";
          _nav = 7;
          break;
      }
      callback(_nav, _nextPath)
    } else {
      if(!this.props.values.transferTo) {
        this.setState({
          errTransferTo: "Please select an option to proceed"
        });
      } else {
        this.setState({
          errTransferTo: null
        });
      }
    }
  }

  saveDocument = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid)
    })
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData((_nav, _nextPath) => {
      this.props.handleNav(_nav);
      this.props.clearValidPage(TRANSFER);
      this.nextPath(_nextPath);
    })
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

  render() {
    const { values, handleTransferTo, handleChange, handleBankSelection, handleTransferCashPercent } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={6}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section1-li"
            className="section"
            elname="livefield-elem"
            compname="Section1"
            comptype={0}
            page_no={6}
            page_link_name="Page3"
          >
            <h2>TRANSFER TO A RETIREMENT FUND or TO A PRESERVATION FUND</h2>
            <p>
              If a withdrawal is made after 1 March 2021 but prior to
              retirement, a member's share of fund/ fund assets/retirement
              interest may contain both Vested Benefits and Non-Vested Benefits.
              If a part withdrawal is taken from the retirement fund, the
              withdrawal must be applied proportionately to both Vested Benefits
              and Non-Vested Benefits.
            </p>
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio4-li"
            needdata="true"
            compname="Radio4"
            linkname="Radio4"
            isvisible="true"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Would you like to transfer your assest?</span>
              <em className="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio5_1"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    checked={values.transferTo === "provident_preservation_fund"}
                    onChange={handleTransferTo}
                    defaultValue="provident_preservation_fund"
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio4_1" className="radioChoice">
                    Liberty Agile Provident Preservation Fund
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio5_2"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    checked={values.transferTo === "pension_preservation_fund"}
                    onChange={handleTransferTo}
                    defaultValue="pension_preservation_fund"
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio4_2" className="radioChoice">
                    Liberty Agile Pension Preservation Fund
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio5_3"
                    name="Radio5"
                    elname="Radio5"
                    className="radioBtnType"
                    checked={values.transferTo === "other_fund"}
                    onChange={handleTransferTo}
                    defaultValue="other_fund"
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio4_3" className="radioChoice">
                    Any other fund
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio4">
                {this.state.errTransferTo}
              </p>
            </div>
            <div className="clearBoth" />
            <p>You may transfer your money free of tax to the Liberty Agile Preservation Fund or any other registered fund. To know more about Agile Preservation, please click on the following link <a target='_blank' href='https://www.liberty.co.za/save-for-retirement#liberty-pension-and-provident-fund-preservers'>https://www.liberty.co.za/save-for-retirement#liberty-pension-and-provident-fund-preservers</a>.</p>
          </li>
          <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={3}
            id="Number4-li"
            needdata="true"
            compname="Number4"
            linkname="Number4"
            isvisible="true"
            mandatory="false"
            unit_position={2}
            field_unit
            page_no={7}
            page_link_name="Page4"
          >
            <label className="labelName">
              <span>Enter percentage of the amount you would like to withdraw via transfer</span>
            </label>
            <p style={{fontWeight: 'bold'}}>Please note</p>
            <p>If you have selected <span style={{fontWeight: 'bold'}}>Cash & Transfer</span> in <span style={{fontWeight: 'bold'}}>Page 2</span>, percentage via transfer and cash withdrawal should add upto 100%.
            For example, percentage via transfer is set at 30% here, cash withdrawal percentage will be automatically adjusted to 70% on Page 7 and vice-versa.
            This is not applicable if either <span style={{fontWeight: 'bold'}}>Cash</span> or <span style={{fontWeight: 'bold'}}>Transfer</span> option is selected in <span style={{fontWeight: 'bold'}}>Page 2.</span></p>
            <br></br>
            <div elname="tempContDiv" className="tempContDiv">
              {/* <span>
                            <input type="text"
                                name="Number4"
                                value={ values.cashPercent }
                                onChange={handleChange('cashPercent')}
                                disabled={ values.receiveAmtInCash === "Yes" ? false : true } />&nbsp;&nbsp;%
                        </span> */}
              <div className="sliderCont">
                <div className="slider-value">{values.transferPercent}%</div>
                0
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min={0}
                  max={100}
                  value={values.transferPercent}
                  step={1}
                  className="slider-fixed"
                  onChange={handleTransferCashPercent("transferPercent")}
                  disabled={values.claimOption === "Transfer" ? true : this.props.is_form_submitted}
                />
                100
                <span
                  className="symbol"
                  name="field_unit_after"
                  elname="field_unit_span"
                />
                <p className="errorMessage" elname="error" id="error-Number4">
                  {this.state.errTransferPercent}
                </p>
              </div>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine4-li"
            needdata="true"
            compname="SingleLine4"
            linkname="SingleLine4"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Provider name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine4"
                  value={values.providerName}
                  disabled={values.transferTo === "other_fund" ? false : true }
                  onChange={handleChange("providerName")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine4"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine5-li"
            needdata="true"
            compname="SingleLine5"
            linkname="SingleLine5"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Fund name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine5"
                  value={values.fundName}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("fundName")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine5"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine6-li"
            needdata="true"
            compname="SingleLine6"
            linkname="SingleLine6"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Administrator /Insurer name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine6"
                  value={values.adminName}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("adminName")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine6"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine7-li"
            needdata="true"
            compname="SingleLine7"
            linkname="SingleLine7"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>SARS approval number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine7"
                  value={values.sarsApprovalNo}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("sarsApprovalNo")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine7"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine8-li"
            needdata="true"
            compname="SingleLine8"
            linkname="SingleLine8"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>FSCA registration number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine8"
                  value={values.fscaRegnNo}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("fscaRegnNo")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine8"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine9-li"
            needdata="true"
            compname="SingleLine9"
            linkname="SingleLine9"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Contact person’s name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="SingleLine9"
                  value={values.contactPersonName}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("contactPersonName")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine9"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper email small"
            elname="livefield-elem"
            comptype={9}
            id="Email2-li"
            needdata="true"
            compname="Email2"
            linkname="Email2"
            isvisible="true"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
            domain_option={0}
            need_reconf="false"
          >
            <label className="labelName">
              <span>Contact person's email</span>
            </label>
            <div className="tempContDiv">
              <span elname="livefield-email-elem">
                <input
                  autoComplete='nofill'
                  type="text"
                  maxLength={255}
                  name="Email2"
                  value={values.contactPersonEmail}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("contactPersonEmail")}
                />
                <p className="errorMessage" elname="error" id="error-Email2" />
              </span>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper phone small"
            elname="livefield-elem"
            comptype={11}
            id="PhoneNumber2-li"
            needdata="true"
            compname="PhoneNumber2"
            linkname="PhoneNumber2"
            isvisible="true"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
            need_reconf="false"
          >
            <label className="labelName">
              <span>Contact person’s telephone/Cell Phone</span>
            </label>
            <div
              className="tempContDiv"
              elname="phoneFormatElem"
              phoneformat="INTERNATIONAL"
            >
              <div elname="phoneFld" name="phone-elements">
                <input
                  name="PhoneNumber2"
                  autoComplete='nofill'
                  id="PhoneNumber2"
                  type="text"
                  value={values.contactPersonPhone}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("contactPersonPhone")}
                />
              </div>
              <p
                className="errorMessage"
                elname="error"
                id="error-PhoneNumber2"
              />
            </div>
            <div className="clearBoth" />
          </li>
          {/*To exclude Section field in rules we are setting comptype as 0 for Section field. That is Section field will not be included in any condition. */}
          <li
            tabIndex={1}
            id="Section2-li"
            className="section"
            elname="livefield-elem"
            compname="Section2"
            comptype={0}
            page_no={6}
            page_link_name="Page3"
          >
            <h2>Bank account details for receiving fund</h2>
            <p />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine10-li"
            needdata="true"
            compname="SingleLine10"
            linkname="SingleLine10"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
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
                  name="SingleLine10"
                  value={values.accHolder_t}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("accHolder_t")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine10"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper dropdown small"
            elname="livefield-elem"
            comptype={12}
            id="Dropdown1-li"
            needdata="true"
            compname="Dropdown1"
            linkname="Dropdown1"
            isvisible="true"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Name of the bank</span>
            </label>
            <div className="tempContDiv">
              <div className="form_sBox">
                <div className="customArrow" />
                <select
                  name="Dropdown1"
                  onChange={handleBankSelection("selectedBank_t", "bankCode_t")}
                  disabled={values.transferTo === "other_fund" ? false : this.props.is_form_submitted }
                  value={values.selectedBank_t}
                >
                  {this.banks}
                </select>
              </div>
              <div
                elname="liveFieldTempChoiceCont"
                style={{ display: "none" }}
              />
              <p className="errorMessage" elname="error" id="error-Dropdown1" />
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
              {values.bankCode_t}

              <div
                elname="liveFieldTempChoiceCont"
                style={{ display: "none" }}
              />
              <p className="errorMessage" elname="error" id="error-Dropdown3" />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={3}
            id="Number2-li"
            needdata="true"
            compname="Number2"
            linkname="Number2"
            isvisible="true"
            mandatory="false"
            unit_position={2}
            field_unit
            page_no={6}
            page_link_name="Page3"
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
                  name="Number2"
                  value={values.accNo_t}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("accNo_t")}
                />{" "}
              </span>
              <span
                className="symbol"
                name="field_unit_after"
                elname="field_unit_span"
              />
              <p className="errorMessage" elname="error" id="error-Number2" />
            </div>
            <div className="clearBoth" />
          </li>
          {/* <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={3}
            id="Number3-li"
            needdata="true"
            compname="Number3"
            linkname="Number3"
            isvisible="true"
            mandatory="false"
            unit_position={2}
            field_unit
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Branch code</span>
            </label>
            <div elname="tempContDiv" className="tempContDiv">
              <span>
                <input
                  autoComplete="off"
                  type="text"
                  maxLength={18}
                  name="Number3"
                  value={values.branchCode_t}
                  onChange={handleChange("branchCode_t")}
                />{" "}
              </span>
              <span
                className="symbol"
                name="field_unit_after"
                elname="field_unit_span"
              />
              <p className="errorMessage" elname="error" id="error-Number3" />
            </div>
            <div className="clearBoth" />
          </li> */}
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine11-li"
            needdata="true"
            compname="SingleLine11"
            linkname="SingleLine11"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
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
                  name="SingleLine11"
                  value={values.branchName_t}
                  disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                  onChange={handleChange("branchName_t")}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine11"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio4-li"
            needdata="true"
            compname="Radio4"
            linkname="Radio4"
            isvisible="true"
            mandatory="false"
            page_no={6}
            page_link_name="Page3"
          >
            <label className="labelName">
              <span>Account type</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio4_1"
                    name="Radio4"
                    elname="Radio4"
                    className="radioBtnType"
                    checked={values.accType_t === "Saving"}
                    onChange={handleChange("accType_t")}
                    disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                    defaultValue="Saving"

                  />
                  <label htmlFor="Radio4_1" className="radioChoice">
                    Saving
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio4_2"
                    name="Radio4"
                    elname="Radio4"
                    className="radioBtnType"
                    checked={values.accType_t === "Cheque"}
                    onChange={handleChange("accType_t")}
                    disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                    defaultValue="Cheque"

                  />
                  <label htmlFor="Radio4_2" className="radioChoice">
                    Cheque
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    onmousedown="event.preventDefault();"
                    type="radio"
                    id="Radio4_3"
                    name="Radio4"
                    elname="Radio4"
                    className="radioBtnType"
                    checked={values.accType_t === "Transmission"}
                    onChange={handleChange("accType_t")}
                    disabled={values.transferTo === "other_fund" ? this.props.is_form_submitted : true }
                    defaultValue="Transmission"

                  />
                  <label htmlFor="Radio4_3" className="radioChoice">
                    Transmission
                  </label>{" "}
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio4" />
            </div>
            <div className="clearBoth" />
          </li>
        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={6}
          page_count={11}
          page_link_name="Page3"
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
            <div className="footerPgNum">6/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Transfer);
