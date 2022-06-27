import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import $ from "jquery";
import { PulseSpinner } from "react-spinners-kit";
import {fileUpload, saveDocument} from "../helpers/fetchhelper";

export class Claims extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errAmtDivorce: null,
      errAmtMaintenance: null,
      selectedFile: null,
      errNoFiles: null,
      fileUploadMessage: null,
      loading: false
    };
  }


  saveDocumentPartially = (callback) => {
    let body = {
      uuid: this.props.values.uuid,
      info: { ...this.props.values }
    };
    saveDocument(body, () => {
      callback();
    });
  };

  saveDocument = (e) => {
    e.preventDefault();
    this.nextPath("/save?uuid=" + this.props.values.uuid);
  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();

    var _nextPath = "";
    var _nav = 0;

    switch (this.props.values.claimOption) {
      case "In-Fund Preservation":
        _nextPath = "/preservation";
        _nav = 5;
        break;
      case "Transfer":
        _nextPath = "/transfer";
        _nav = 6;
        break;
      case "Cash":
        _nextPath = "/cash";
        _nav = 7;
        break;
      case "Cash & Transfer":
        _nextPath = "/transfer";
        _nav = 6;
        break;
      case "Retirement":
        _nextPath = "/retirement";
        _nav = 8;
        break;
    }

    if (this.props.values.claims === "Not applicable") {
      this.nextPath(_nextPath);
      this.props.handleNav(_nav);
      this.setState({
        errAmtDivorce: null,
        errAmtMaintenance: null,
      });
    }
    // Divorce order
    if (this.props.values.claims === "Divorce order") {
      if (!this.props.values.amtDivorce && this.props.values.amtDivorcePercentage === "0") {
        this.setState({
          errAmtDivorce: "Please enter amount of the divorce order",
        });
      } else {
        if (this.props.values.amtDivorce && this.props.values.amtDivorcePercentage !== "0") {
          this.setState({
            errAmtDivorce: "Either enter the amount of the divorce order in Rand OR enter the percentage",
          });
        } else {
          this.nextPath(_nextPath);
          this.props.handleNav(_nav);
          this.setState({
            errAmtDivorce: null,
          });
        }
      }
    }
    // Maintenance order
    if (this.props.values.claims === "Maintenance order") {
      if (!this.props.values.amtMaintenance && this.props.values.amtMaintenancePercentage === "0") {
        this.setState({
          errAmtMaintenance: "Please enter amount of the maintenance order",
        });
      } else {
        if (this.props.values.amtMaintenance && this.props.values.amtMaintenancePercentage !== "0") {
          this.setState({
            errAmtMaintenance: "Either enter the amount of the maintenance order in Rand OR enter the percentage",
          });
        } else {
          this.nextPath(_nextPath);
          this.props.handleNav(_nav);
          this.setState({
            errAmtMaintenance: null,
          });
        }
      }
    }

  }

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.nextPath("/memberInfo");
    this.props.handleNav(3);
  };

  nextPath(path) {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  }

  // ========= FILE UPLOAD SECTION NEEDS UPDATE =========

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
    data.append("file", this.state.selectedFile, "DIVORCEDOC_" + this.state.selectedFile.name);
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
    });
    }
  };

  // ========= FILE UPLOAD SECTION NEEDS UPDATE =========

  render() {
    const {
      values,
      handleChange,
      handleMaintenance,
      handleClaimOption,
    } = this.props;

    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={4}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section14-li"
            className="section"
            elname="livefield-elem"
            compname="Section14"
            comptype={0}
            page_no={4}
            page_link_name="Page9"
          >
            <h2>CLAIMS AGAINST THE MEMBER'S BENEFIT</h2>
            <p>
              Please select the appropriate option from below if there is a
              claim against your benefit
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
            <div className="tempContDiv">
              <div className="overflow">
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="huey"
                    name="Radio3"
                    defaultValue="Not applicable"
                    checked={values.claims === "Not applicable"}
                    onChange={handleClaimOption}
                    disabled={this.props.is_form_submitted}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Not applicable
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Divorce order"
                    disabled={this.props.is_form_submitted}
                    checked={values.claims === "Divorce order"}
                    onChange={handleClaimOption}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Divorce order
                  </label>
                </span>
                <span className="multiAttType">
                  <input
                    type="radio"
                    id="Radio3_1"
                    name="Radio3"
                    elname="Radio3"
                    className="radioBtnType"
                    defaultValue="Maintenance order"
                    disabled={this.props.is_form_submitted}
                    checked={values.claims === "Maintenance order"}
                    onChange={handleClaimOption}
                  />
                  <label htmlFor="Radio3_1" className="radioChoice">
                    Maintenance order
                  </label>
                </span>
                <div className="clearBoth" />
              </div>
              <p className="errorMessage" elname="error" id="error-Radio3" />
            </div>
            <div className="clearBoth" />
          </li>

          {values.claims === "Divorce order" ?
            <div>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={20}
                id="Decimal3-li"
                needdata="true"
                compname="Decimal3"
                linkname="Decimal3"
                isvisible="true"

                unit_position={2}
                decimallength={2}
                decimalformat={1}
                mandatory="false"
                page_no={4}
                page_link_name="Page9"
              >
                <label className="labelName">
                  <span>Amount of the divorce order (R)</span>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <input
                    type="text"
                    value={values.amtDivorce}
                    // disabled={values.claims === "Divorce order" ? false : true}
                    onChange={handleChange("amtDivorce")}
                    disabled={this.props.is_form_submitted}
                  />

                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Decimal3">
                    {this.state.errAmtDivorce}
                  </p>
                </div>
                <div className="clearBoth" />
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

                page_no={7}
                page_link_name="Page4"
              >
                <label className="labelName">
                  <span>OR</span>
                </label>
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

                page_no={7}
                page_link_name="Page4"
              >
                <label className="labelName">
                  <span>Enter the percentage</span>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  {/* <span>
                            <input type="text"
                                name="Number4"
                                value={ values.cashPercent }
                                onChange={handleChange('cashPercent')}
                                disabled={ values.receiveAmtInCash === "Yes" ? false : true } />&nbsp;&nbsp;%
                        </span> */}
                  <div className="sliderCont">
                    <div className="slider-value">{values.amtDivorcePercentage}%</div>
                    0
                    <input
                      type="range"
                      id="cowbell"
                      name="cowbell"
                      min={0}
                      max={100}
                      value={values.amtDivorcePercentage}
                      step={1}
                      className="slider-fixed"
                      onChange={handleChange("amtDivorcePercentage")}
                      disabled={this.props.is_form_submitted}
                      // disabled={values.receiveAmtInCash === "Yes" ? false : true}
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
            </div>

            : null}
          {values.claims === "Maintenance order" ?
            <div>
              <li
                className="tempFrmWrapper small"
                elname="livefield-elem"
                comptype={20}
                id="Decimal4-li"
                needdata="true"
                compname="Decimal4"
                linkname="Decimal4"
                isvisible="true"

                unit_position={2}
                decimallength={2}
                decimalformat={1}
                mandatory="false"
                page_no={4}
                page_link_name="Page9"
              >
                <label className="labelName">
                  <span>Amount of the maintenance order (R)</span>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  <input
                    type="text"
                    value={values.amtMaintenance}
                    // disabled={!values.maintenanceOrder}
                    onChange={handleChange("amtMaintenance")}
                    disabled={this.props.is_form_submitted}
                  />

                  <span
                    className="symbol"
                    name="field_unit_after"
                    elname="field_unit_span"
                  />
                  <p className="errorMessage" elname="error" id="error-Decimal4">
                    {this.state.errAmtMaintenance}
                  </p>
                </div>
                <div className="clearBoth" />
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

                page_no={7}
                page_link_name="Page4"
              >
                <label className="labelName">
                  <span>OR</span>
                </label>
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

                page_no={7}
                page_link_name="Page4"
              >
                <label className="labelName">
                  <span>Enter the percentage</span>
                </label>
                <div elname="tempContDiv" className="tempContDiv">
                  {/* <span>
                            <input type="text"
                                name="Number4"
                                value={ values.cashPercent }
                                onChange={handleChange('cashPercent')}
                                disabled={ values.receiveAmtInCash === "Yes" ? false : true } />&nbsp;&nbsp;%
                        </span> */}
                  <div className="sliderCont">
                    <div className="slider-value">{values.amtMaintenancePercentage}%</div>
                    0
                    <input
                      type="range"
                      id="cowbell"
                      name="cowbell"
                      min={0}
                      max={100}
                      value={values.amtMaintenancePercentage}
                      step={1}
                      className="slider-fixed"
                      onChange={handleChange("amtMaintenancePercentage")}
                      disabled={this.props.is_form_submitted}
                      // disabled={values.receiveAmtInCash === "Yes" ? false : true}
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
              </li></div> : null}
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
                Please provide supporting documents: Final Divorce Decree and
                Settlement Agreement, Court Order
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
        </ul>
        <ul
          elname="footer"
          className="footerWrapper formRelative"
          page_no={4}
          page_count={11}
          page_link_name="Page9"
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
            <div className="footerPgNum">4/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Claims);
