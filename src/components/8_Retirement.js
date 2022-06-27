import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import $ from "jquery";

import "react-datepicker/dist/react-datepicker.css";
import {saveDocument} from "../helpers/fetchhelper";
import {RETIREMENT} from "../constants/constants";

export class Retirement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errReasonForRetirement: null,
    };
  }

  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(RETIREMENT, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body, () => {
        callback();
      });
    })
  };

  validateData = (callback) => {
    if (this.props.values.reasonForRetirement) {
      callback();
      this.setState({
        errReasonForRetirement: null,
      });
    } else {
      if (!this.props.values.reasonForRetirement) {
        this.setState({
          errReasonForRetirement: "Please select an option here",
        });
      } else {
        this.setState({ errReasonForRetirement: null });
      }
    }
  }

  saveDocument = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid);
    });
  }

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

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/declaration");
      this.props.clearValidPage(RETIREMENT);
      this.props.handleNav(11);
    })
  };

  render() {
    const {
      values,
      handleChange,
      handleDate,
      handleBenefitForCash,
      handleAnnuityOffering,
      handleOtherAnnuity,
    } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={8}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section4-li"
            className="section"
            elname="livefield-elem"
            compname="Section4"
            comptype={0}
            page_no={8}
            page_link_name="Page5"
          >
            <h2>RETIREMENT</h2>
            <p />
          </li>
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio6-li"
            needdata="true"
            compname="Radio6"
            linkname="Radio6"
            isvisible="true"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>
                The member is to retire in terms of the following provisions of
                the rules: (please select an option as appropriate)
              </span>
              <em class="important">*</em>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio6_1"
                    name="Radio6"
                    elname="Radio6"
                    className="radioBtnType"
                    defaultValue="attain_of_normal_retirement_age"
                    checked={
                      values.reasonForRetirement ===
                      "attain_of_normal_retirement_age"
                    }
                    onChange={handleChange("reasonForRetirement")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio6_1" className="radioChoice">
                    Attain of normal retirement age
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio6_2"
                    name="Radio6"
                    elname="Radio6"
                    className="radioBtnType"
                    defaultValue="early_retirement_with_consent_of_the_employer"
                    checked={
                      values.reasonForRetirement ===
                      "early_retirement_with_consent_of_the_employer"
                    }
                    onChange={handleChange("reasonForRetirement")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio6_2" className="radioChoice">
                    Early retirement with consent of the employer
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio6_3"
                    name="Radio6"
                    elname="Radio6"
                    className="radioBtnType"
                    defaultValue="early_retirement_due_to_ill_health"
                    checked={
                      values.reasonForRetirement ===
                      "early_retirement_due_to_ill_health"
                    }
                    onChange={handleChange("reasonForRetirement")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio6_3" className="radioChoice">
                    Early retirement due to ill health (Medical evidence will be
                    required)
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio6_4"
                    name="Radio6"
                    elname="Radio6"
                    className="radioBtnType"
                    defaultValue="late_retirement"
                    checked={values.reasonForRetirement === "late_retirement"}
                    onChange={handleChange("reasonForRetirement")}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio6_4" className="radioChoice">
                    Late retirement
                  </label>
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio6">
                {this.state.errReasonForRetirement}
              </p>
            </div>
            <div className="clearBoth" />
          </li>
          {/*To exclude Section field in rules we are setting comptype as 0 for Section field. That is Section field will not be included in any condition. */}
          {/* <li
            tabIndex={1}
            id="Section6-li"
            className="section"
            elname="livefield-elem"
            compname="Section6"
            comptype={0}
            page_no={8}
            page_link_name="Page5"
          >
            <h2>Employer Details</h2>
            <p />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine12-li"
            needdata="true"
            compname="SingleLine12"
            linkname="SingleLine12"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Company payee reference number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="off"
                  type="text"
                  maxLength={255}
                  name="SingleLine12"
                  onChange={handleChange("employerRefNo")}
                  value={values.employerRefNo}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine12"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine13-li"
            needdata="true"
            compname="SingleLine13"
            linkname="SingleLine13"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Company payee contact person’s name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="off"
                  type="text"
                  maxLength={255}
                  name="SingleLine13"
                  onChange={handleChange("employerContactName")}
                  value={values.employerContactName}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine13"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine14-li"
            needdata="true"
            compname="SingleLine14"
            linkname="SingleLine14"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Company payee contact person’s phone number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="off"
                  type="text"
                  maxLength={255}
                  name="SingleLine14"
                  onChange={handleChange("employerContactPhone")}
                  value={values.employerContactPhone}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine14"
              />
            </div>
            <div className="clearBoth" />
          </li> */}
          <li
            tabIndex={1}
            id="Section5-li"
            className="section"
            elname="livefield-elem"
            compname="Section5"
            comptype={0}
            page_no={8}
            page_link_name="Page5"
          >
            <h2>Retirement Benefit Commutation</h2>
            <p>
              Under current tax legislation, where members have vested benefits,
              the full vested retirement benefit may be commuted for a lump sum
              payment, subject to income tax. A maximum of one-third of any
              non-vested retirement benefits may be commuted for a lump sum
              payment, subject to income tax, with the balance being used to
              purchase an annuity. If the total retirement benefit is less than
              R247,500, the full amount can be taken as a lump sum payment,
              subject to income tax.
            </p>
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
                Do you wish to be paid a portion of the retirement benefit for
                cash?
              </span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Yes"
                    checked={values.benefitForCash === "Yes"}
                    onChange={handleBenefitForCash}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"
                    checked={values.benefitForCash === "No"}
                    onChange={handleBenefitForCash}
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
          </li>
          <li
            className="slider tempFrmWrapper small"
            tabIndex={1}
            elname="livefield-elem"
            comptype={23}
            id="Slider-li"
            needdata="true"
            compname="Slider"
            linkname="Slider"
            isvisible="true"
            isdisable="false"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
            slidertype={1}
            slidermin={0}
            slidermax={100}
          >
            <label className="labelName">
              <span>If “Yes”, what portion? (Enter percentage)</span>
            </label>
            <div className="tempContDiv" elname="sliderFormatElem" sliderformat>
              <div className="sliderCont">
                <div className="slider-value">
                  {values.benefitForCashPercent}%
                </div>
                0
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min={0}
                  max={100}
                  value={values.benefitForCashPercent}
                  step={1}
                  className="slider-fixed"
                  onChange={handleChange("benefitForCashPercent")}
                  disabled={values.benefitForCash === "Yes" ? this.props.is_form_submitted : true}
                />
                100
              </div>
              <p className="errorMessage" elname="error" id="error-Slider" />
            </div>
            <div className="clearBoth" />
          </li>
          {/*To exclude Section field in rules we are setting comptype as 0 for Section field. That is Section field will not be included in any condition. */}
          <li
            tabIndex={1}
            id="Section7-li"
            className="section"
            elname="livefield-elem"
            compname="Section7"
            comptype={0}
            page_no={8}
            page_link_name="Page5"
          >
            <h2>Pension/Annuity Details</h2>
            <p>
              When selecting full or partial purchase of annuities, you have the
              option of buying one or more of the annuities offered by Liberty .
              Please contact your benefit counsellor on{" "}
              <span style={{ fontWeight: "bold" }}>011 558 2999</span> or email
              &nbsp;
              <a href="mailto:benefitcounselling@liberty.co.za">
                benefitcounselling@liberty.co.za
              </a>
            </p>
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
              <span>Liberty default annuity offering</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio4"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Yes"
                    checked={values.annuityOffering === "Yes"}
                    onChange={handleAnnuityOffering}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio4"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"
                    checked={values.annuityOffering === "No"}
                    onChange={handleAnnuityOffering}
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
          </li>
          <li
            className="slider tempFrmWrapper small"
            tabIndex={1}
            elname="livefield-elem"
            comptype={23}
            id="Slider1-li"
            needdata="true"
            compname="Slider1"
            linkname="  Slider1"
            isvisible="true"
            isdisable="false"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
            slidertype={1}
            slidermin={0}
            slidermax={100}
          >
            <label className="labelName">
              <span>If “Yes”, what portion? (Enter percentage)</span>
            </label>
            <div className="tempContDiv" elname="sliderFormatElem" sliderformat>
              <div className="sliderCont">
                <div className="slider-value">
                  {values.annuityOfferingPercent}%
                </div>
                0
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min={0}
                  max={100}
                  value={values.annuityOfferingPercent}
                  step={1}
                  className="slider-fixed"
                  onChange={handleChange("annuityOfferingPercent")}
                  disabled={values.annuityOffering === "Yes" ? this.props.is_form_submitted : true}

                />
                100
              </div>
              <p className="errorMessage" elname="error" id="error-Slider1" />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine19-li"
            needdata="true"
            compname="SingleLine19"
            linkname="SingleLine19"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Proposal number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine19"
                  value={values.proposalNo}
                  onChange={handleChange("proposalNo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine19"
              />
            </div>
            <div className="clearBoth" />
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
              <span>Other annuity offerings / providers</span>
            </label>
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio5"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Yes"
                    checked={values.otherAnnuity === "Yes"}
                    onChange={handleOtherAnnuity}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>{" "}
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio5"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"
                    checked={values.otherAnnuity === "No"}
                    onChange={handleOtherAnnuity}
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
          </li>
          <li
            className="slider tempFrmWrapper small"
            tabIndex={1}
            elname="livefield-elem"
            comptype={23}
            id="Slider2-li"
            needdata="true"
            compname="Slider2"
            linkname="Slider2"
            isvisible="true"
            isdisable="false"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
            slidertype={1}
            slidermin={0}
            slidermax={100}
          >
            <label className="labelName">
              <span>If “Yes”, what portion? (Enter percentage)</span>
            </label>
            <div className="tempContDiv" elname="sliderFormatElem" sliderformat>
              <div className="sliderCont">
                <div className="slider-value">
                  {values.otherAnnuityPercent}%
                </div>
                0
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min={0}
                  max={100}
                  value={values.otherAnnuityPercent}
                  step={1}
                  className="slider-fixed"
                  onChange={handleChange("otherAnnuityPercent")}
                  disabled={values.otherAnnuity === "Yes" ? this.props.is_form_submitted : true}
                />
                100
              </div>
              <p className="errorMessage" elname="error" id="error-Slider2" />
            </div>
            <div className="clearBoth" />
            <div />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine21-li"
            needdata="true"
            compname="SingleLine21"
            linkname="SingleLine21"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Proposal number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine21"
                  value={values.otherAnnuityProposalNo}
                  onChange={handleChange("otherAnnuityProposalNo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine21"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            tabIndex={1}
            id="Section8-li"
            className="section"
            elname="livefield-elem"
            compname="Section8"
            comptype={0}
            page_no={8}
            page_link_name="Page5"
          >
            <h2>
              For "Other annuity offerings / providers", please complete below
            </h2>
            <p />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine22-li"
            needdata="true"
            compname="SingleLine22"
            linkname="SingleLine22"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Name of the policy</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine22"
                  value={values.otherAnnuityPolicyName}
                  onChange={handleChange("otherAnnuityPolicyName")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine22"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine23-li"
            needdata="true"
            compname="SingleLine23"
            linkname="SingleLine23"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Annuity policy number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine23"
                  value={values.otherAnnuityPolicyNo}
                  onChange={handleChange("otherAnnuityPolicyNo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine23"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine24-li"
            needdata="true"
            compname="SingleLine24"
            linkname="SingleLine24"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Contact name</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine24"
                  value={values.otherAnnuityContactName}
                  onChange={handleChange("otherAnnuityContactName")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine24"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper small"
            elname="livefield-elem"
            comptype={3}
            id="Number5-li"
            needdata="true"
            compname="Number5"
            linkname="Number5"
            isvisible="true"
            mandatory="false"
            unit_position={2}
            field_unit
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Contact number</span>
            </label>
            <div elname="tempContDiv" className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={18}
                  name="Number5"
                  value={values.otherAnnuityContactNo}
                  onChange={handleChange("otherAnnuityContactNo")}
                  disabled={this.props.is_form_submitted}
                />{" "}
              </span>
              <span
                className="symbol"
                name="field_unit_after"
                elname="field_unit_span"
              />
              <p className="errorMessage" elname="error" id="error-Number5" />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper email small"
            elname="livefield-elem"
            comptype={9}
            id="Email3-li"
            needdata="true"
            compname="Email3"
            linkname="Email3"
            isvisible="true"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
            domain_option={0}
            need_reconf="false"
          >
            <label className="labelName">
              <span>Email</span>
            </label>
            <div className="tempContDiv">
              <span elname="livefield-email-elem">
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="Email3"
                  value={values.otherAnnuityEmail}
                  onChange={handleChange("otherAnnuityEmail")}
                  disabled={this.props.is_form_submitted}
                />
                <p className="errorMessage" elname="error" id="error-Email3" />
              </span>
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine25-li"
            needdata="true"
            compname="SingleLine25"
            linkname="SingleLine25"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Insurance company</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine25"
                  value={values.otherAnnuityInsuranceCo}
                  onChange={handleChange("otherAnnuityInsuranceCo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine25"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine26-li"
            needdata="true"
            compname="SingleLine26"
            linkname="SingleLine26"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>FSCA registration number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine26"
                  value={values.otherAnnuityFscaRegNo}
                  onChange={handleChange("otherAnnuityFscaRegNo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine26"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            elname="livefield-elem"
            comptype={1}
            id="SingleLine27-li"
            needdata="true"
            compname="SingleLine27"
            linkname="SingleLine27"
            isvisible="true"
            className="tempFrmWrapper small"
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>FSP number</span>
            </label>
            <div className="tempContDiv">
              <span>
                <input
                  autoComplete="nofill"
                  type="text"
                  maxLength={255}
                  name="SingleLine27"
                  value={values.otherAnnuityFspNo}
                  onChange={handleChange("otherAnnuityFspNo")}
                  disabled={this.props.is_form_submitted}
                />
              </span>
              <p
                className="errorMessage"
                elname="error"
                id="error-SingleLine27"
              />
            </div>
            <div className="clearBoth" />
          </li>
          <li
            className="tempFrmWrapper date"
            style={{ paddingTop: "95px", height: "165px" }}
            tabIndex={1}
            elname="livefield-elem"
            comptype={5}
            id="Date3-li"
            compname="Date3"
            linkname="Date3"
            needdata="true"
            isvisible="true"
            disableddays="{}"
            startoftheweek={0}
            mandatory="false"
            page_no={8}
            page_link_name="Page5"
          >
            <label className="labelName">
              <span>Commencement of policy</span>
            </label>
            <div
              className="tempContDiv"
              datelocale="en-GB"
              elname="dd-M-yy"
              id="Date3dateDiv"
              isdisable="false"
            >
              <span>
                <DatePicker
                  selected={Date.parse(values.otherAnnuityCommencementDate)}
                  onChange={(date) =>
                    handleDate(date, "otherAnnuityCommencementDate")
                  }
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="right"
                  disabled={this.props.is_form_submitted}
                />
                <label className="formSubInfoText">
                  Please select the textbox to select a date. Or please enter
                  date in{" "}
                  <span style={{ fontWeight: "bold" }}>dd/mm/yyyy</span> format
                </label>{" "}
              </span>
              <p className="errorMessage" elname="error" id="error-Date3" />
              <span style={{ display: "none" }}> </span>
            </div>
          </li>
        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={8}
          page_count={11}
          page_link_name="Page5"
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
            <div className="footerPgNum">8/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Retirement);
