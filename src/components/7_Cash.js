import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import $ from "jquery";
import {saveDocument} from "../helpers/fetchhelper";
import {CASH} from "../constants/constants";

export class Cash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errCashPercent: null,
    };
  }


  saveDocumentPartially = () => {
    this.props.handleSavedPages(CASH, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body);
    })
  };

  saveDocument = (e) => {
    e.preventDefault();
    this.nextPath("/save?uuid=" + this.props.values.uuid)
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.props.handleNav(11);
    this.nextPath("/declaration");
  };

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    var _nextPath = "";
    var _nav = 0;

    switch (this.props.values.claimOption) {
      case "Cash":
        _nextPath = "/claims";
        _nav = 4;
        break;

      case "Cash & Transfer":
        _nextPath = "/transfer";
        _nav = 6;
        break;
    }
    this.props.handleNav(_nav);
    this.nextPath(_nextPath);
  };

  nextPath(path) {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
    this.props.clearValidPage(CASH);
  }

  render() {
    const { values, handleChange, handleReceiveCash, handleTransferCashPercent } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={7}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section3-li"
            className="section"
            elname="livefield-elem"
            compname="Section3"
            comptype={0}
            page_no={7}
            page_link_name="Page4"
          >
            <h2>TAKE A CASH LUMP SUM</h2>
            <p>
              If a withdrawal is made after 1 March 2021 but prior to
              retirement, a member's share of fund/ fund assets/retirement
              interest may contain both Vested Benefits and Non-Vested Benefits.
              If a part withdrawal is taken from the retirement fund, the
              withdrawal must be applied proportionately to both Vested Benefits
              and Non-Vested Benefits.
            </p>
          </li>
          {/* <li
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
              <span>Would like to receive the amount in cash ?</span>
              <em className="important">*</em>
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
                    checked={values.receiveAmtInCash == "Yes"}

                    onChange={handleReceiveCash}
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
                    checked={values.receiveAmtInCash == "No"}

                    onChange={handleReceiveCash}
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
          </li> */}
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
              <span>Enter percentage of the amount you would like to withdraw in cash</span>
            </label>
            <p style={{fontWeight: 'bold'}}>Please note</p>
            <p>If you have selected <span style={{fontWeight: 'bold'}}>Cash & Transfer</span> in <span style={{fontWeight: 'bold'}}>Page 2</span>, percentage via transfer and cash withdrawal should add upto 100%.
            For example, percentage via cash withdrawal is set at 30% here, transfer percentage will be automatically adjusted to 70% on Page 6 and vice-versa.
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
                <div className="slider-value">{values.cashPercent}%</div>
                0
                <input
                  type="range"
                  id="cowbell"
                  name="cowbell"
                  min={0}
                  max={100}
                  value={values.cashPercent}
                  step={1}
                  className="slider-fixed"
                  onChange={handleTransferCashPercent("cashPercent")}
                  disabled={values.claimOption === "Cash" ? true : this.props.is_form_submitted}
                />
                100
                <span
                  className="symbol"
                  name="field_unit_after"
                  elname="field_unit_span"
                />
                <p className="errorMessage" elname="error" id="error-Number4">
                  {this.state.errCashPercent}
                </p>
              </div>
            </div>
            <div className="clearBoth" />
          </li>
          {/* <li
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
                If you have been a member of the fund for more than 12 months,
                you may be able to continue your life and/or disability cover
                under an individual policy. Please select appropriate option,
                kindly have a discussion with your Financial Adviser.
              </span>
              <em className="important">*</em>
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

                    checked={values.continueCover == "Yes"}
                    onChange={handleChange("continueCover")}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Yes
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_2"
                    name="Radio4"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="No"

                    checked={values.continueCover == "No"}
                    onChange={handleChange("continueCover")}
                  />
                  <label htmlFor="Radio3_2" className="radioChoice">
                    No
                  </label>
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio3" />
            </div>
            <div className="clearBoth" />
          </li> */}
        </ul>

        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={7}
          page_count={11}
          page_link_name="Page4"
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
            <div className="footerPgNum">7/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Cash);
