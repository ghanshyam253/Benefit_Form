import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import relationships from '../data/relationships.json';
import $ from "jquery";
import {saveDocument} from "../helpers/fetchhelper";
import {BENEFICIARY} from "../constants/constants";

export class Beneficiary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      id: "",
      relation: "",
      percentage: "",
      list: [],
      errTotal: "",
    };
  }



  saveDocumentPartially = (callback) => {
    this.props.handleSavedPages(BENEFICIARY, () => {
      let body = {
        uuid: this.props.values.uuid,
        info: { ...this.props.values }
      };
      saveDocument(body, () => {
        callback();
      });
    })
  };

  getRelationships = relationships.map((relation) => {
    return (
      <option key={relation.code} data-key={relation.code} value={relation.name}>
        {relation.name}
      </option>
    );
  });

  componentDidMount() {
    this.setState({
      list: this.props.values.beneficiary,
    });
  }

  ValidateSAID = (id) => {

    var i, c,
    even = '',
    sum = 0,
    check = id.slice(-1);

    if (id.length != 13 || id.match(/\D/)) {
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

  addItem = (e) => {
    e.preventDefault();
    if (
      this.state.name &&
      this.ValidateSAID(this.state.id.trim()) &&
      this.state.relation &&
      this.state.percentage
    ) {
      this.setState({
        list: this.state.list.concat({
          name: this.state.name,
          id: this.state.id,
          relation: this.state.relation,
          percentage: this.state.percentage,
        }),
        name: "",
        id: "",
        relation: "",
        percentage: "",
        errTotal: ""
      }, () => {
        this.props.handleBeneficiary(this.state.list);
      });
    } else {
      this.setState({
        errTotal: "Please provide a valid SA ID"
      })
    }
  };

  delItem = (i) => {
    this.setState((state) => {
      const list = state.list.filter((item, j) => i !== j);
      return {
        list,
      };
    }, () => {
      this.props.handleBeneficiary(this.state.list);
    });
  };

  handleChange = (input) => (e) => {
    var data = this.state.list;
    this.setState({
      [input]: e.target.value,
    });
  };

  _total = () => {
    var a = 0;
    var data = this.state.list;
    data.forEach((i) => {
      a += Number(i.percentage);
    });

    return a;
  };

  validateData = (callback) => {
    var total = Number(this._total());
    // if (total !== 100 && this.state.list.length > 0) {
    if (total !== 100) {
      this.setState({
        errTotal: "Total of split percentage has to be 100%",
      });
    } else {
      this.setState({
        errTotal: "",
      });
      this.props.handleBeneficiary(this.state.list);
      setTimeout(() => {
        this.saveDocumentPartially();
      });
      callback();
    }
  }

  saveDocument = (e) => {
    e.preventDefault();
    this.validateData(() => {
      this.nextPath("/save?uuid=" + this.props.values.uuid)
    })

  }

  continue = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();
    this.validateData(() => {
      this.props.handleNav(11);
      this.props.clearValidPage(BENEFICIARY);
      this.nextPath('/declaration');
    })

  };

  back = (e) => {
    $("html,body").scrollTop(0);
    e.preventDefault();

    this.props.handleNav(5);
    this.nextPath('/preservation');
  };

  nextPath(path) {
    this.saveDocumentPartially(() => {
      this.props.history.push(path);
    });
  }

  render() {
    // const { values, handleChange } = this.props;

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
            <h2>BENEFICIARY DETAILS</h2>
            <p />
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
              <span>Provide your beneficiary details (if any)</span>
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
                  button to add your beneficiary.
                </div>
                <table id="dynamicTable">
                  <tbody>
                  <tr>
                    <th>Name and surname </th>
                    <th>SA ID number</th>
                    <th>Relationship to deceased member</th>
                    <th>Split %</th>
                    <th></th>
                  </tr>
                  {this.state.list.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.id}</td>
                      <td>{item.relation}</td>
                      <td>{item.percentage}</td>
                      <td>
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
                    <td>
                      <input
                        type="text"
                        value={this.state.name}
                        onChange={this.handleChange("name")}
                        disabled={this.props.is_form_submitted}
                        autoComplete='nofill'
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={this.state.id}
                        onChange={this.handleChange("id")}
                        disabled={this.props.is_form_submitted}
                        autoComplete='nofill'
                      />
                    </td>
                    <td>
                      {/* <input
                        type="text"
                        value={this.state.relation}
                        onChange={this.handleChange("relation")}
                      ></input> */}
                      <div className="form_sBox" style={{width: '100%'}}>
                        <div className="customArrow" />
                        <select
                          onChange={this.handleChange("relation")}
                          value={this.state.relation}
                          disabled={this.props.is_form_submitted}
                        >
                          {this.getRelationships}
                        </select>
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={this.state.percentage}
                        onChange={this.handleChange("percentage")}
                        disabled={this.props.is_form_submitted}
                        autoComplete='nofill'
                      />
                    </td>
                    <td>
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
            <div className="footerPgNum">9/14</div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Beneficiary);
