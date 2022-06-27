import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import {fileUpload, saveDocument} from "../helpers/fetchhelper";

export class RequiredDocuments extends Component {

  constructor(props) {
    console.log(" RequiredDocuments Component");
    console.log(props);
    super(props);
    this.state = {
      errAmtDivorce: null,
      errAmtMaintenance: null,
      errNoFiles: null,

      selectedFile_id: null,
      fileUploadMessage_id: null,
      loading_id: false,

      selectedFile_tax: null,
      fileUploadMessage_tax: null,
      loading_tax: false,

      // selectedFile_oth: null,
      // fileUploadMessage_oth: null,
      // loading_oth: false
    };
  }

  onChangeHandler_id = (e) => {
    this.setState({
      selectedFile_id: e.target.files[0],
    });
  };

  onChangeHandler_tax = (e) => {
    this.setState({
      selectedFile_tax: e.target.files[0],
    });
  };


  uploadHandler_tax = () => {
    if(this.state.selectedFile_tax === null) {
      alert('Please select a file to upload');
    } else {
    const data = new FormData();
    const uninqueId = this.props.values.uuid;
    data.append("file", this.state.selectedFile_tax, "BANKSTATEMENT_" + this.state.selectedFile_tax.name);
    this.setState({
      fileUploadMessage_tax: null,
      loading_tax: true
    });

    fileUpload(uninqueId, data, (res) => {
      if(res.status === 200) {
        this.setState({
          selectedFile_tax: null,
          fileUploadMessage_tax: 'File uploaded successfully',
          loading_tax: false
        });
      } else {
        this.setState({
          selectedFile_tax: null,
          fileUploadMessage_tax: res.data.message,
          loading_tax: false
        });
      }
    })
    }
  };

  uploadHandler_id = () => {
    if(this.state.selectedFile_id === null) {
      alert('Please select a file to upload');
    } else {
    const data = new FormData();
    const uninqueId = this.props.values.uuid;
    data.append("file", this.state.selectedFile_id, "IDDOC_" + this.state.selectedFile_id.name);
    this.setState({
      fileUploadMessage_id: null,
      loading_id: true
    })
      fileUpload(uninqueId, data, (res) => {
        if(res.status === 200) {
          this.setState({
            selectedFile_id: null,
            fileUploadMessage_id: 'File uploaded successfully',
            loading_id: false
          });
        } else {
          this.setState({
            selectedFile_id: null,
            fileUploadMessage_id: res.data.message,
            loading_id: false
          });
        }
      })
    }
  };


  saveDocument = (e) => {
    e.preventDefault();
    this.nextPath("/save?uuid=" + this.props.values.uuid)
  }

  continue = (e) => {
    e.preventDefault();
    this.props.handleNav(3);
    this.nextPath("/memberDetails");
  };

  back = (e) => {
    e.preventDefault();
    this.props.handleNav(1);
    this.nextPath("./");
  };

  saveDocumentPartially() {
    let body = {
      uuid: this.props.values.uuid,
      info: this.props.values
    };
    saveDocument(body);
  }

  nextPath(path) {
    this.saveDocumentPartially();
    this.props.history.push(path);
  }

  render() {
    return (
      <div>
        <ul
          elname="formBodyULName"
          className="ulNoStyle formFieldWrapper"
          page_no={11}
          needpagedata="true"
          style={{}}
        >
          <li
            tabIndex={1}
            id="Section13-li"
            className="section"
            elname="livefield-elem"
            compname="Section13"
            comptype={0}
            page_no={11}
            page_link_name="Page8"
          >
            <h2>REQUIRED DOCUMENTS FOR WITHDRAWAL OR RETIREMENT</h2>
          </li> 
          <li
            className="zfradio tempFrmWrapper oneColumns"
            elname="livefield-elem"
            comptype={13}
            id="Radio-li"
            needdata="true"
            compname="Radio"
            linkname="Radio"
            isvisible="true"
            mandatory="true"
            page_no={2}
            page_link_name="Page10"
          >
            Please note that if your claim value is less than R5000, we do not require supporting documents (excluding death claims). Please email your ID copy to UnclaimedBenefitQueries@liberty.co.za to obtain your value.


          </li>

          <li
            className="tempFrmWrapper file_upload"
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
            <label className="labelName">
              <span>Copy of ID Or Passport</span>
            </label>
            <div className="tempContDiv">
              <input
                type="file"
                name="file"
                disabled={this.props.is_form_submitted}
                onChange={this.onChangeHandler_id}
              />

              <button
                className="fmSmtButton saveColor saveBtn"
                style={{ marginLeft: "10px" }}
                type="button"
                elname="next"
                onClick={this.uploadHandler_id}
                disabled={this.props.is_form_submitted}
              >
                <em> Upload </em>
              </button>
            </div>
            <p className="italicText">Copy of the member’s ID document /copy or the front and back of the ID smart card. For non-South African members, copy of passport.</p>

            <div className="clearBoth" style={{marginTop: '10px'}}>
              <PulseSpinner
                loading={this.state.loading_id}
                color="#00164e"
              />
              { this.state.fileUploadMessage_id }
            </div>

          </li>
          <li
            className="tempFrmWrapper file_upload"
            uploadlimit={1}
            elname="livefield-elem"
            comptype={19}
            id="FileUpload1-li"
            needdata="true"
            compname="FileUpload1"
            linkname="FileUpload1"
            allowedtype
            isvisible="true"
            mandatory="false"
            page_no={11}
            page_link_name="Page8"
          >
            <label className="labelName">
              <span>Copy of the member’s bank statement</span>
            </label>
            <div className="tempContDiv">
              <input
                type="file"
                name="file"
                disabled={this.props.is_form_submitted}
                onChange={this.onChangeHandler_tax}
              />

              <button
                className="fmSmtButton saveColor saveBtn"
                style={{ marginLeft: "10px" }}
                type="button"
                elname="next"
                onClick={this.uploadHandler_tax}
                disabled={this.props.is_form_submitted}
              >
                <em> Upload </em>
              </button>
            </div>
            <p className="italicText">Copy of the member’s bank statement</p>

            <div className="clearBoth" style={{marginTop: '10px'}}>
              <PulseSpinner
                loading={this.state.loading_tax}
                color="#00164e"
              />
              { this.state.fileUploadMessage_tax }
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
                {/* <div className="formRelative inlineBlock saveBtnCont">
                  <button
                    className="fmSmtButton saveColor saveBtn"
                    elname="save"
                    value="save"
                    onClick={this.saveDocument} title="Generate URL for this page"
                  >
                    <em>Share</em>
                  </button>
                </div> */}


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
            <div className="footerPgNum">2/9</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(RequiredDocuments);
