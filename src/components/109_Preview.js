import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import {fileUpload, saveDocument} from "../helpers/fetchhelper";

export class PreviewNew extends Component {

  constructor(props) {
    console.log(" Member Details Component");
    super(props);
    console.log(props);

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

  saveDocument = (e) => {
    e.preventDefault();
    this.nextPath("/save?uuid=" + this.props.values.uuid)
  }

  continue = (e) => {
    e.preventDefault();
    this.props.handleNav(4);
    this.nextPath("/withdrawal");
  };

  back = (e) => {
    e.preventDefault();
    this.props.handleNav(8);
    this.nextPath("./paymentDetails");
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
            <div class="h2">Welcome to Preview page</div>
            <p />
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
            <div className="footerPgNum">9/9</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(PreviewNew);
