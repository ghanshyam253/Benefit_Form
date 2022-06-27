import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import logo from "../images/logo_transparent.png";
import Modal from "react-modal";

import YourOption from "./101_YourOption";
import RequiredDocuments  from "./102_RequiredDocuments";
import MemberDetails from "./103_MemberDetails";
import Withdrawal from "./104_Withdrawal";
import FullTransferOfBenefits from "./105_FullTransferOfBenefits";
import  TransferAndCash  from "./106_TransferAndCash";
import  RetirementNew  from "./107_Retirement";
import  PaymentDetails  from "./108_PaymentDetails";
import  PreviewNew  from "./109_Preview";

import Home from "./1_Home";
import MemberInfo from "./3_MemberInfo";
import Claims from "./4a_Claims";
import Preservation from "./5a_Preservation";
import Transfer from "./6_Transfer";
import Cash from "./7_Cash";
import Retirement from "./8_Retirement";
import Beneficiary from "./9_Beneficiary";
import EmployerDetails from "./10_EmployerDetails";
import Declaration from "./11_Declaration";
import DeclarationEmp from "./12_DeclarationEmp";
import Documents from "./13_Documents";
import Preview from "./14_Preview";
import Save from "./15_Save";
import Submit from './16_Submit';


import { v4 as uuidv4 } from 'uuid';
import { MsalContext } from "@azure/msal-react";
import { loginRequest } from '../authConfig';
import {getPartialForm} from "../helpers/generichelper";

Modal.setAppElement("#root");

class Main extends Component {
  static contextType = MsalContext;
  constructor(props) {
    super(props);
    this.state = {
      missingPageModal: false,
      missingPages: [],
      savedPages: {},
      is_un_submitted_form_exists: false,
      form_id: '',
      form_submitted_modal: false,
      is_form_submitted: false,
      uuid: (new URLSearchParams(window.location.search)).get('uuid') ? (new URLSearchParams(window.location.search)).get('uuid') : uuidv4(),
      // uuid: uuidv4(),
      // Top nav
      currentPage: 1,
      // Page 1
      tncAccepted: false,
      // Page 2
      userRole: "",
      reasonForClaim: "",
      claimOption: "",
      continueCover: "No",
      // Page 3
      // namePrefix: "Mr.",
      firstName: "hello",
      lastName: "hekjju",
      membershipNo: "",
      saidNumber: "2001014800086",
      idType: "saidNumber",
      incomeTaxNo: "2001014800",
      // annualTaxableIncome: "1234567890",
      dialCode: "+27",
      phone: "2001014800",
      email: "",
      streetAddress: "2001014800",
      addressLine2: "2001014800",
      city: "2001014800",
      region: "2001014800",
      zip: "123456",
      country: "South Africa",
      selectedBank: "",
      bankCode: "",
      accNo: "2001014800",
      accHolder: "dssfsfsfs",
      branchCode: "",
      accType: "Saving",
      // Page 4
      claims: "Not applicable",
      amtDivorce: "",
      amtDivorcePercentage: "0",
      maintenanceOrder: false,
      amtMaintenance: "",
      amtMaintenancePercentage: "0",
      // Page 5
      preserveBenefit: "",
      preserveTnC: false,
      preserveMemberSignature: null,
      preserveFaSignature: null,
      portfolio: [],

      declarationByMember_1: false,
      optForFA: "No",
      optForOtherFA: "No",
      faFirstName: "",
      faLastName: "",
      faLibertyCode: "",
      faPhone: "",
      faEmail: "",
      faFspPracticeName: "",
      faFspPracticeNo: "",
      faInitAdviceFee: 0,
      faOngoingAdviceFee: 0,

      otherFaFirstName: "",
      otherFaLastName: "",
      otherFaLibertyCode: "",
      otherFaInitAdviceFee: 0,
      otherFaOngoingAdviceFee: 0,
      declarationByMemNoFA: false,
      declarationByFA: false,
      declarationByMember_2: false,
      // Page 6
      transferTo: "",
      transferPercent: 0,
      providerName: "",
      fundName: "",
      adminName: "",
      sarsApprovalNo: "",
      fscaRegnNo: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      accHolder_t: "",
      selectedBank_t: "",
      bankCode_t: "",
      accNo_t: "",
      branchCode_t: "",
      branchName_t: "",
      accType_t: "",

      // Page 7
      beneficiary: [],

      // Page 8
      receiveAmtInCash: "No",
      cashPercent: 0,
      // continueCover: "No",
      // Page 9
      reasonForRetirement: "",
      // employerRefNo: "",
      // employerContactName: "",
      // employerContactPhone: "",
      benefitForCash: "No",
      benefitForCashPercent: 0,
      annuityOffering: "No",
      annuityOfferingPercent: 0,
      proposalNo: "",
      otherAnnuity: "No",
      otherAnnuityPercent: 0,
      otherAnnuityProposalNo: "",
      otherAnnuityPolicyName: "",
      otherAnnuityPolicyNo: "",
      otherAnnuityContactName: "",
      otherAnnuityContactNo: "",
      otherAnnuityEmail: "",
      otherAnnuityInsuranceCo: "",
      otherAnnuityFscaRegNo: "",
      otherAnnuityFspNo: "",
      otherAnnuityCommencementDate: null,

      // Page 10

      fundType_umbrellaProvident_e: false,
      fundType_umbrellaPension_e: false,
      fundType_standAlone_e: false,

      fundName_e: null,
      employerName_e: null,
      employeeRefNo_e: null,
      fundNo_e: null,
      dtWithdrawal_e: null,
      claims_none_e: false,
      claims_hl_e: false,
      claims_damages_e: false,
      // show_employer_bank_details: false,
      docs_writtenAdmission_e: false,
      docs_courtOrder_e: false,
      docs_caseNo_e: false,
      amountClaimed_e: null,
      accountHolder_e: null,
      bankName_e: null,
      universalCode_e: null,
      branchName_e: null,
      branchCode_e: null,
      accountNo_e: null,
      accountType_e: null,

      // Page 11
      fundAuthAck: false,
      fundAuthName: null,
      dtDeclaration: new Date().toLocaleDateString('en-GB'),
      signature: null,

      // Page 11a
      fundAuthAck_emp: false,
      fundAuthName_emp: null,
      dtDeclaration_emp: new Date().toLocaleDateString('en-GB'),
      signature_emp: null
    };
  }

  componentDidMount() {
    this.initialLoad(false);
  }

  setSavedPages = (page, callback) => {
    const pages = { ...this.state.savedPages, [page]: true }
    this.setState({ savedPages: pages }, () => {
        callback();
    } );
  }

  clearValidPage = (page) => {
    const pageExistsIndex = this.state.missingPages.indexOf(page);
    if (pageExistsIndex > -1) {
      const missingPages = this.state.missingPages;
      missingPages.splice(pageExistsIndex, 1);
      this.setState( { missingPages });
    }
  }

  initialLoad(modalLoaded) {
    const instance = this.context.instance;
    const accounts = this.context.accounts;


    instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0]
    }).then((responseToken) => {
      const partialForm = getPartialForm();
      if (partialForm !== null && !modalLoaded) {
        this.setState({
          form_id: partialForm.uuid,
          is_un_submitted_form_exists: true
        })
      }
      localStorage.setItem("id-token", responseToken.idToken);
      const _uuid = (new URLSearchParams(window.location.search)).get('uuid');
      const fetchObj = {
        headers: {
          Authorization: 'Bearer ' + responseToken.idToken
        }
      }

      _uuid
        ? fetch('/api/datasave/info?uuid=' + _uuid, fetchObj)
          .then((response) => response.json())
          .then(data => {
            if (typeof data.data.Item == 'undefined') {
            } else {
              var info = data.data.Item.info;
              if (partialForm !== null && modalLoaded) {
                this.handleNav(info.currentPage);
                this.homePageRef && this.homePageRef.props.history.push(partialForm.location)
              }
              this.setState({
                form_submitted_modal: info.is_form_submitted,
                is_form_submitted: info.is_form_submitted,
                // Page 1
                tncAccepted: info.tncAccepted,
                // Page 2
                userRole: info.userRole,
                reasonForClaim: info.reasonForClaim,
                claimOption: info.claimOption,
                continueCover: info.continueCover,
                // Page 3
                // namePrefix: info.namePrefix,
                firstName: info.firstName,
                lastName: info.lastName,
                membershipNo: info.membershipNo,
                saidNumber: info.saidNumber,
                idType: info.idType,
                incomeTaxNo: info.incomeTaxNo,
                // annualTaxableIncome: info.annualTaxableIncome,
                dialCode: info.dialCode,
                phone: info.phone,
                email: info.email,
                streetAddress: info.streetAddress,
                addressLine2: info.addressLine2,
                city: info.city,
                region: info.region,
                zip: info.zip,
                country: info.country,
                selectedBank: info.selectedBank,
                bankCode: info.bankCode,
                accNo: info.accNo,
                accHolder: info.accHolder,
                branchCode: info.branchCode,
                accType: info.accType,
                // Page 4
                claims: info.claims,
                amtDivorce: info.amtDivorce,
                amtDivorcePercentage: info.amtDivorcePercentage,
                maintenanceOrder: info.maintenanceOrder,
                amtMaintenance: info.amtMaintenance,
                amtMaintenancePercentage: info.amtMaintenancePercentage,
                // Page 5
                preserveBenefit: info.preserveBenefit,
                preserveTnC: info.preserveTnC,
                preserveMemberSignature: info.preserveMemberSignature,
                preserveFaSignature: info.preserveFaSignature,
                portfolio: info.portfolio,

                declarationByMember_1: info.declarationByMember_1,
                optForFA: info.optForFA,
                optForOtherFA: info.optForOtherFA,
                faFirstName: info.faFirstName,
                faLastName: info.faLastName,
                faLibertyCode: info.faLibertyCode,
                faPhone: info.faPhone,
                faEmail: info.faEmail,
                faFspPracticeName: info.faFspPracticeName,
                faFspPracticeNo: info.faFspPracticeNo,
                faInitAdviceFee: info.faInitAdviceFee,
                faOngoingAdviceFee: info.faOngoingAdviceFee,

                otherFaFirstName: info.otherFaFirstName,
                otherFaLastName: info.otherFaLastName,
                otherFaLibertyCode: info.otherFaLibertyCode,
                otherFaInitAdviceFee: info.otherFaInitAdviceFee,
                otherFaOngoingAdviceFee: info.otherFaOngoingAdviceFee,
                declarationByMemNoFA: info.declarationByMemNoFA,
                declarationByFA: info.declarationByFA,
                declarationByMember_2: info.declarationByMember_2,
                // Page 6
                transferTo: info.transferTo,
                transferPercent: info.transferPercent,
                providerName: info.providerName,
                fundName: info.fundName,
                adminName: info.adminName,
                sarsApprovalNo: info.sarsApprovalNo,
                fscaRegnNo: info.fscaRegnNo,
                contactPersonName: info.contactPersonName,
                contactPersonEmail: info.contactPersonEmail,
                contactPersonPhone: info.contactPersonPhone,
                accHolder_t: info.accHolder_t,
                selectedBank_t: info.selectedBank_t,
                bankCode_t: info.bankCode_t,
                accNo_t: info.accNo_t,
                branchCode_t: info.branchCode_t,
                branchName_t: info.branchName_t,
                accType_t: info.accType_t,

                // Page 7
                beneficiary: info.beneficiary,

                // Page 8
                receiveAmtInCash: info.receiveAmtInCash,
                cashPercent: info.cashPercent,
                // continueCover: "No",
                // Page 9
                reasonForRetirement: info.reasonForRetirement,
                // employerRefNo: "",
                // employerContactName: "",
                // employerContactPhone: "",
                benefitForCash: info.benefitForCash,
                benefitForCashPercent: info.benefitForCashPercent,
                annuityOffering: info.annuityOffering,
                annuityOfferingPercent: info.annuityOfferingPercent,
                proposalNo: info.proposalNo,
                otherAnnuity: info.otherAnnuity,
                otherAnnuityPercent: info.otherAnnuityPercent,
                otherAnnuityProposalNo: info.otherAnnuityProposalNo,
                otherAnnuityPolicyName: info.otherAnnuityPolicyName,
                otherAnnuityPolicyNo: info.otherAnnuityPolicyNo,
                otherAnnuityContactName: info.otherAnnuityContactName,
                otherAnnuityContactNo: info.otherAnnuityContactNo,
                otherAnnuityEmail: info.otherAnnuityEmail,
                otherAnnuityInsuranceCo: info.otherAnnuityInsuranceCo,
                otherAnnuityFscaRegNo: info.otherAnnuityFscaRegNo,
                otherAnnuityFspNo: info.otherAnnuityFspNo,
                otherAnnuityCommencementDate: info.otherAnnuityCommencementDate,

                // Page 10

                fundType_umbrellaProvident_e: info.fundType_umbrellaProvident_e,
                fundType_umbrellaPension_e: info.fundType_umbrellaPension_e,
                fundType_standAlone_e: info.fundType_standAlone_e,

                fundName_e: info.fundName_e,
                employerName_e: info.employerName_e,
                employeeRefNo_e: info.employeeRefNo_e,
                fundNo_e: info.fundNo_e,
                dtWithdrawal_e: info.dtWithdrawal_e,
                claims_none_e: info.claims_none_e,
                claims_hl_e: info.claims_hl_e,
                claims_damages_e: info.claims_damages_e,
                // show_employer_bank_details: false,
                docs_writtenAdmission_e: info.docs_writtenAdmission_e,
                docs_courtOrder_e: info.docs_courtOrder_e,
                docs_caseNo_e: info.docs_caseNo_e,
                amountClaimed_e: info.amountClaimed_e,
                accountHolder_e: info.accountHolder_e,
                bankName_e: info.bankName_e,
                universalCode_e: info.universalCode_e,
                branchName_e: info.branchName_e,
                branchCode_e: info.branchCode_e,
                accountNo_e: info.accountNo_e,
                accountType_e: info.accountType_e,

                // Page 11
                fundAuthAck: info.fundAuthAck,
                fundAuthName: info.fundAuthName,
                dtDeclaration: info.dtDeclaration,
                signature: info.signature,

                // Page 11a
                fundAuthAck_emp: info.fundAuthAck_emp,
                fundAuthName_emp: info.fundAuthName_emp,
                dtDeclaration_emp: info.dtDeclaration_emp,
                signature_emp: info.signature_emp,
                savedPages: info.savedPages
              })
            }
          })
        : console.log('componentDidMount', 'new_submission');

      const routes = ['', 'requiredDocuments', 'memberDetails','withdrawal', 'claims', 'preservation', 'transfer', 'beneficiary', 'cash', 'retirement', 'employerDetails', 'declaration', 'declarationEmp', 'documents', 'preview', 'save', 'submit']
      const hash = window.location.hash.split('/')[1];
      for (let i in routes) {
        if (hash === routes[i]) {
          this.handleNav(parseInt(i) + 1);
        }
      }
    }).catch(err => {
//      console.log(err);
    });
  }

  handleRouteChange() {
    this.initialLoad(true)
  }

  resetPreservationPage() {

    this.setState({
      preserveBenefit: "",
      preserveTnC: false,
      preserveMemberSignature: null,
      preserveFaSignature: null,
      portfolio: [],

      declarationByMember_1: false,
      optForFA: "No",
      optForOtherFA: "No",
      faFirstName: "",
      faLastName: "",
      faLibertyCode: "",
      faPhone: "",
      faEmail: "",
      faFspPracticeName: "",
      faFspPracticeNo: "",
      faInitAdviceFee: 0,
      faOngoingAdviceFee: 0,

      otherFaFirstName: "",
      otherFaLastName: "",
      otherFaLibertyCode: "",
      otherFaInitAdviceFee: 0,
      otherFaOngoingAdviceFee: 0,
      declarationByMemNoFA: false,
      declarationByFA: false,
      declarationByMember_2: false,
    });
  }

  resetTransferPage() {

    this.setState({
      transferTo: "",
      transferPercent: 0,
      providerName: "",
      fundName: "",
      adminName: "",
      sarsApprovalNo: "",
      fscaRegnNo: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      accHolder_t: "",
      selectedBank_t: "",
      bankCode_t: "",
      accNo_t: "",
      branchCode_t: "",
      branchName_t: "",
      accType_t: "",
    });
  }

  resetCashPage() {

    this.setState({
      receiveAmtInCash: "No",
      cashPercent: 0,
    });
  }

  resetRetirementPage() {

    this.setState({
      reasonForRetirement: "",
      // employerRefNo: "",
      // employerContactName: "",
      // employerContactPhone: "",
      benefitForCash: "No",
      benefitForCashPercent: 0,
      annuityOffering: "No",
      annuityOfferingPercent: 0,
      proposalNo: "",
      otherAnnuity: "No",
      otherAnnuityPercent: 0,
      otherAnnuityProposalNo: "",
      otherAnnuityPolicyName: "",
      otherAnnuityPolicyNo: "",
      otherAnnuityContactName: "",
      otherAnnuityContactNo: "",
      otherAnnuityEmail: "",
      otherAnnuityInsuranceCo: "",
      otherAnnuityFscaRegNo: "",
      otherAnnuityFspNo: "",
      otherAnnuityCommencementDate: null,
    });
  }

  // Only bank detail section
  resetMemberInfo() {

    this.setState({
      selectedBank: "",
      bankCode: "",
      accNo: "",
      accHolder: "",
      branchCode: "",
      accType: ""
    });

  }

  handleYourOptions = (input) => (e) => {
    const selectedValue = e.target.value;

    switch (selectedValue) {
      case 'In-Fund Preservation':
        this.resetTransferPage();
        this.resetCashPage();
        this.resetRetirementPage();
        this.resetMemberInfo();
        break;
      case 'Transfer':
        this.resetPreservationPage();
        this.resetCashPage();
        this.resetRetirementPage();
        this.resetMemberInfo();
        this.setState({
          transferPercent: 100
        });
        break;
      case 'Cash':
        this.resetPreservationPage();
        this.resetTransferPage();
        this.resetRetirementPage();
        this.setState({
          cashPercent: 100
        });
        break;
      case 'Cash & Transfer':
        this.resetPreservationPage();
        this.resetRetirementPage();
        break;
      case 'Retirement':
        this.resetPreservationPage();
        this.resetCashPage();
        this.resetTransferPage();
        break;
    }

    this.setState({
      [input]: e.target.value
    });
  }

  handleDate = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  handleCheck = (input) => (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({ [input]: value });
  };

  handleMaintenance = () => {
    var _amtMaintenance =
      this.state.maintenanceOrder === true ? "" : this.state.amtMaintenance;

    this.setState({
      maintenanceOrder: !this.state.maintenanceOrder,
      amtMaintenance: _amtMaintenance,
    });
  };

  handleClaimOption = (e) => {

    let _amtDivorce = "";
    let _amtMaintenance = "";
    let _amtDivorcePercentage = "0";
    let _amtMaintenancePercentage = "0";

    switch (e.target.value) {
      case "Not applicable":
        _amtDivorce = "";
        _amtMaintenance = "";
        _amtDivorcePercentage = "0";
        _amtMaintenancePercentage = "0";
        break;
      case "Divorce order":
        _amtMaintenance = "";
        _amtMaintenancePercentage = "0";
        break;
      case "Maintenance order":
        _amtDivorce = "";
        _amtDivorcePercentage = "0";
        break;
    }
    // var _amtDivorce =
    //   e.target.value === "Not applicable" ? "" : this.state.amtDivorce;
    // var _maintenanceOrder =
    //   e.target.value === "Not applicable" ? false : this.state.maintenanceOrder;
    // var _amtMaintenance =
    //   e.target.value === "Not applicable" ? "" : this.state.amtMaintenance;

    this.setState({
      claims: e.target.value,
      amtDivorce: _amtDivorce,
      amtDivorcePercentage: _amtDivorcePercentage,
      // maintenanceOrder: _maintenanceOrder,
      amtMaintenance: _amtMaintenance,
      amtMaintenancePercentage: _amtMaintenancePercentage
    });
  };

  handleOptForOtherFA = (e) => {

    var _otherFaFirstName = e.target.value === "No" ? "" : this.state.otherFaFirstName;
    var _otherFaLastName = e.target.value === "No" ? "" : this.state.otherFaLastName;
    var _otherFaLibertyCode = e.target.value === "No" ? "" : this.state.otherFaLibertyCode;
    var _otherFaInitAdviceFee = e.target.value === "No" ? "" : this.state.otherFaInitAdviceFee;
    var _otherFaOngoingAdviceFee = e.target.value === "No" ? "" : this.state.otherFaOngoingAdviceFee;

    this.setState({
      otherFaFirstName: _otherFaFirstName,
      otherFaLastName: _otherFaLastName,
      otherFaLibertyCode: _otherFaLibertyCode,
      otherFaInitAdviceFee: _otherFaInitAdviceFee,
      otherFaOngoingAdviceFee: _otherFaOngoingAdviceFee,
      optForOtherFA: e.target.value
    });

  };

  handleOptForFA = (e) => {

    var _faFirstName = e.target.value === "No" ? "" : this.state.faFirstName;
    var _faLastName = e.target.value === "No" ? "" : this.state.faLastName;
    var _faLibertyCode = e.target.value === "No" ? "" : this.state.faLibertyCode;
    var _faPhone = e.target.value === "No" ? "" : this.state.faPhone;
    var _faEmail = e.target.value === "No" ? "" : this.state.faEmail;
    var _faFspPracticeName = e.target.value === "No" ? "" : this.state.faFspPracticeName;
    var _faFspPracticeNo = e.target.value === "No" ? "" : this.state.faFspPracticeNo;
    var _faInitAdviceFee = e.target.value === "No" ? "" : this.state.faInitAdviceFee;
    var _faOngoingAdviceFee = e.target.value === "No" ? "" : this.state.faOngoingAdviceFee;

    var _otherFaFirstName = e.target.value === "No" ? "" : this.state.otherFaFirstName;
    var _otherFaLastName = e.target.value === "No" ? "" : this.state.otherFaLastName;
    var _otherFaLibertyCode = e.target.value === "No" ? "" : this.state.otherFaLibertyCode;
    var _otherFaInitAdviceFee = e.target.value === "No" ? "" : this.state.otherFaInitAdviceFee;
    var _otherFaOngoingAdviceFee = e.target.value === "No" ? "" : this.state.otherFaOngoingAdviceFee;

    this.setState({
      faFirstName: _faFirstName,
      faLastName: _faLastName,
      faLibertyCode: _faLibertyCode,
      faPhone: _faPhone,
      faEmail: _faEmail,
      faFspPracticeName: _faFspPracticeName,
      faFspPracticeNo: _faFspPracticeNo,
      faInitAdviceFee: _faInitAdviceFee,
      faOngoingAdviceFee: _faOngoingAdviceFee,
      optForFA: e.target.value,

      otherFaFirstName: _otherFaFirstName,
      otherFaLastName: _otherFaLastName,
      otherFaLibertyCode: _otherFaLibertyCode,
      otherFaInitAdviceFee: _otherFaInitAdviceFee,
      otherFaOngoingAdviceFee: _otherFaOngoingAdviceFee,
      optForOtherFA: "No"
    });
  }

  handleReceiveCash = (e) => {
    var _cashPercent = e.target.value === "No" ? 0 : this.state.cashPercent;

    this.setState({
      receiveAmtInCash: e.target.value,
      cashPercent: _cashPercent,
    });
  };

  handleBenefitForCash = (e) => {
    var _benefitForCashPercent =
      e.target.value === "No" ? 0 : this.state.benefitForCashPercent;

    this.setState({
      benefitForCash: e.target.value,
      benefitForCashPercent: _benefitForCashPercent,
    });
  };

  handleAnnuityOffering = (e) => {
    var _annuityOfferingPercent =
      e.target.value === "No" ? 0 : this.state.annuityOfferingPercent;

    this.setState({
      annuityOffering: e.target.value,
      annuityOfferingPercent: _annuityOfferingPercent,
    });
  };

  handleOtherAnnuity = (e) => {
    var _otherAnnuityPercent =
      e.target.value === "No" ? 0 : this.state.otherAnnuityPercent;

    this.setState({
      otherAnnuity: e.target.value,
      otherAnnuityPercent: _otherAnnuityPercent,
    });
  };

  handleBeneficiary = (b) => {
    this.setState({
      beneficiary: b,
    });
  };

  handlePortfolio = (p) => {
    this.setState({
      portfolio: p,
    });
  };

  handleTransferCashPercent = (input) => (e) => {
    if (this.state.claimOption == 'Cash & Transfer') {
      if (input === 'transferPercent') {
        this.setState({
          transferPercent: e.target.value,
          cashPercent: 100 - e.target.value
        });
      } else {
        this.setState({
          cashPercent: e.target.value,
          transferPercent: 100 - e.target.value
        });
      }
    } else {
      this.setState({
        [input]: e.target.value
      });
    }
  }

  handleReasonForClaim = (e) => {
    const value = e.target.value;
    const _claimOption = value === "Retirement" ? "Retirement" : ""
    this.setState({
      reasonForClaim: value,
      claimOption: _claimOption
    });
  }

  setMissingPages = (pages) => {
    this.setState({ missingPages: pages, missingPageModal: true } );
  }

  handleChange = (input) => (e) => {
    const target = e.target; // console.log(input);
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [input]: value
    }, () => {
    });
  };

  handleTransferTo = (e) => {
    var _transferTo = e.target.value;
    switch (_transferTo) {
      case "provident_preservation_fund":
        this.setState({
          transferTo: _transferTo,
          providerName: "Liberty",
          fundName: "Liberty Agile Provident Preservation Fund",
          adminName: "Liberty",
          sarsApprovalNo: "18/20/4/31391",
          fscaRegnNo: "12/8/0027975/00000",
          contactPersonName: "New Business",
          contactPersonEmail: "newbusiness@liberty.co.za",
          contactPersonPhone: "0115584825",
          accHolder_t: "Liberty",
          selectedBank_t: "Standard Bank",
          bankCode_t: "051001",
          accNo_t: "200358286",
          branchName_t: "Braamfontein",
          accType_t: "Cheque"
        });
        break;
      case "pension_preservation_fund":
        this.setState({
          transferTo: _transferTo,
          providerName: "Liberty",
          fundName: "Liberty Agile Pension Preservation Fund",
          adminName: "Liberty",
          sarsApprovalNo: "18/20/4/34015",
          fscaRegnNo: "12/8/0027975/00000",
          contactPersonName: "New Business",
          contactPersonEmail: "newbusiness@liberty.co.za",
          contactPersonPhone: "0115584825",
          accHolder_t: "Liberty",
          selectedBank_t: "Standard Bank",
          bankCode_t: "051001",
          accNo_t: "200358286",
          branchName_t: "Braamfontein",
          accType_t: "Cheque"
        });
        break;
      case "other_fund":
        this.setState({
          transferTo: _transferTo,
          providerName: "",
          fundName: "",
          adminName: "",
          sarsApprovalNo: "",
          fscaRegnNo: "",
          contactPersonName: "",
          contactPersonEmail: "",
          contactPersonPhone: "",
          accHolder_t: "",
          selectedBank_t: "",
          bankCode_t: "",
          accNo_t: "",
          branchName_t: "",
          accType_t: ""
        });
        break;
    }
    // if(_transferTo === "provident_preservation_fund") {

    // }
    // else {
    //   this.setState({
    //     transferTo: _transferTo,
    //     providerName: ""
    //   });
    // }
  }

  handleBankSelection = (_bankName, _bankCode) => (e) => {
    const selectedIndex = e.target.options.selectedIndex;
    // this.setState({
    //   selectedBank: e.target.value,
    //   bankCode: e.target.options[selectedIndex].getAttribute("data-key"),
    // });
    this.setState({
      [_bankName]: e.target.value,
      [_bankCode]: e.target.options[selectedIndex].getAttribute("data-key"),
    });
  };

  // handleBankSelection_e = (e) => {
  //   const selectedIndex = e.target.options.selectedIndex;
  //   this.setState({
  //     bankName_e: e.target.value,
  //     universalCode_e: e.target.options[selectedIndex].getAttribute("data-key"),
  //   });
  // };

  // goTo = i => (event) => {
  //     event.preventDefault();
  // }

  handleNav = (pageNo) => {
    this.setState({
      currentPage: Number(pageNo)
    });
    setTimeout(() => {
      let positionToMove = document.querySelector(".selected.currentPTab").offsetLeft;
      document.querySelector('.pBarWrapper').scroll({
        left: positionToMove,
        top: 0,
        behavior: 'smooth'
      });
    })
  };

  handleSignature = (input, signImage) => {
    this.setState({
      [input]: signImage,
    });
  };

  closeModal = () => {
    this.setState({ form_submitted_modal: false })
  }
  closeUnSubmittedModal = () => {
    this.setState({ is_un_submitted_form_exists: false })
  }
  closeMissingPagesModal = () => {
    this.setState({ missingPageModal: false });
  }
  shareDocument = () => {
    this.closeMissingPagesModal();
    this.previewPageRef && this.previewPageRef.props.history.push("/save?uuid=" + this.state.uuid);
  }

  render() {
    const {
      uuid,
      is_form_submitted,
      currentPage,
      tncAccepted,
      userRole,
      reasonForClaim,
      claimOption,
      // namePrefix,
      firstName,
      lastName,
      membershipNo,
      saidNumber,
      idType,
      incomeTaxNo,
      // annualTaxableIncome,
      dialCode,
      phone,
      email,
      streetAddress,
      addressLine2,
      city,
      region,
      zip,
      country,
      selectedBank,
      bankCode,
      accNo,
      accHolder,
      branchCode,
      accType,
      claims,
      amtDivorce,
      amtDivorcePercentage,
      maintenanceOrder,
      amtMaintenance,
      amtMaintenancePercentage,
      receiveAmtInCash,
      cashPercent,
      continueCover,
      transferTo,
      transferPercent,
      providerName,
      fundName,
      adminName,
      sarsApprovalNo,
      fscaRegnNo,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      accHolder_t,
      selectedBank_t,
      bankCode_t,
      accNo_t,
      branchCode_t,
      branchName_t,
      accType_t,
      beneficiary,
      reasonForRetirement,
      // employerRefNo,
      // employerContactName,
      // employerContactPhone,
      benefitForCash,
      benefitForCashPercent,
      annuityOffering,
      annuityOfferingPercent,
      proposalNo,
      otherAnnuity,
      otherAnnuityPercent,
      otherAnnuityProposalNo,
      otherAnnuityPolicyName,
      otherAnnuityPolicyNo,
      otherAnnuityContactName,
      otherAnnuityContactNo,
      otherAnnuityEmail,
      otherAnnuityInsuranceCo,
      otherAnnuityFscaRegNo,
      otherAnnuityFspNo,
      otherAnnuityCommencementDate,
      preserveBenefit,
      preserveTnC,
      declarationByMemNoFA,
      preserveMemberSignature,
      preserveFaSignature,
      portfolio,
      declarationByMember_1,
      optForFA,
      optForOtherFA,
      faFirstName,
      faLastName,
      faLibertyCode,
      faPhone,
      faEmail,
      faFspPracticeName,
      faFspPracticeNo,
      faInitAdviceFee,
      faOngoingAdviceFee,
      otherFaFirstName,
      otherFaLastName,
      otherFaLibertyCode,
      otherFaInitAdviceFee,
      otherFaOngoingAdviceFee,
      declarationByFA,
      declarationByMember_2,
      fundType_umbrellaProvident_e,
      fundType_umbrellaPension_e,
      fundType_standAlone_e,
      fundName_e,
      employerName_e,
      employeeRefNo_e,
      fundNo_e,
      dtWithdrawal_e,
      claims_none_e,
      claims_hl_e,
      claims_damages_e,
      // show_employer_bank_details,
      docs_writtenAdmission_e,
      docs_courtOrder_e,
      docs_caseNo_e,
      amountClaimed_e,
      accountHolder_e,
      bankName_e,
      universalCode_e,
      branchName_e,
      branchCode_e,
      accountNo_e,
      accountType_e,
      fundAuthAck,
      fundAuthName,
      dtDeclaration,
      signature,
      fundAuthAck_emp,
      fundAuthName_emp,
      dtDeclaration_emp,
      signature_emp,
      savedPages
    } = this.state;

    const values = {
      is_form_submitted,
      uuid,
      currentPage,
      tncAccepted,
      userRole,
      reasonForClaim,
      claimOption,
      // namePrefix,
      firstName,
      lastName,
      membershipNo,
      saidNumber,
      idType,
      incomeTaxNo,
      // annualTaxableIncome,
      dialCode,
      phone,
      email,
      streetAddress,
      addressLine2,
      city,
      region,
      zip,
      country,
      selectedBank,
      bankCode,
      accNo,
      accHolder,
      branchCode,
      accType,
      claims,
      amtDivorce,
      amtDivorcePercentage,
      maintenanceOrder,
      amtMaintenance,
      amtMaintenancePercentage,
      receiveAmtInCash,
      cashPercent,
      continueCover,
      transferTo,
      transferPercent,
      providerName,
      fundName,
      adminName,
      sarsApprovalNo,
      fscaRegnNo,
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      accHolder_t,
      selectedBank_t,
      bankCode_t,
      accNo_t,
      branchCode_t,
      branchName_t,
      accType_t,
      beneficiary,
      reasonForRetirement,
      // employerRefNo,
      // employerContactName,
      // employerContactPhone,
      benefitForCash,
      benefitForCashPercent,
      annuityOffering,
      annuityOfferingPercent,
      proposalNo,
      otherAnnuity,
      otherAnnuityPercent,
      otherAnnuityProposalNo,
      otherAnnuityPolicyName,
      otherAnnuityPolicyNo,
      otherAnnuityContactName,
      otherAnnuityContactNo,
      otherAnnuityEmail,
      otherAnnuityInsuranceCo,
      otherAnnuityFscaRegNo,
      otherAnnuityFspNo,
      otherAnnuityCommencementDate,
      preserveBenefit,
      preserveTnC,
      declarationByMemNoFA,
      preserveMemberSignature,
      preserveFaSignature,
      portfolio,
      declarationByMember_1,
      optForFA,
      optForOtherFA,
      faFirstName,
      faLastName,
      faLibertyCode,
      faPhone,
      faEmail,
      faFspPracticeName,
      faFspPracticeNo,
      faInitAdviceFee,
      faOngoingAdviceFee,
      otherFaFirstName,
      otherFaLastName,
      otherFaLibertyCode,
      otherFaInitAdviceFee,
      otherFaOngoingAdviceFee,
      declarationByFA,
      declarationByMember_2,
      fundType_umbrellaProvident_e,
      fundType_umbrellaPension_e,
      fundType_standAlone_e,
      fundName_e,
      employerName_e,
      employeeRefNo_e,
      fundNo_e,
      dtWithdrawal_e,
      claims_none_e,
      claims_hl_e,
      claims_damages_e,
      // show_employer_bank_details,
      docs_writtenAdmission_e,
      docs_courtOrder_e,
      docs_caseNo_e,
      amountClaimed_e,
      accountHolder_e,
      bankName_e,
      universalCode_e,
      branchName_e,
      branchCode_e,
      accountNo_e,
      accountType_e,
      fundAuthAck,
      fundAuthName,
      dtDeclaration,
      signature,
      fundAuthAck_emp,
      fundAuthName_emp,
      dtDeclaration_emp,
      signature_emp,
      savedPages
    };

    return (
      <div>
        <div className="backgroundBg"></div>
        <div className="backgroundSecBg">
          <div elname="frmTemplate" className="templateWidth">
            <div className="topContainer"></div>

            <div className="centerContainer ">
              <div id="formDiv">
                <form name="test" id="test">
                  <div className="templateWrapper" id="formRedirectURL">
                    <ul className="tempHeadBdr formRelative">
                      <li className="tempHeadContBdr">
                        <table style={{ width: '100%' }}>
                          <tbody>
                            <tr>
                              <td>
                                <img src={logo} style={{ width: '100px' }} align="absbottom" alt="logo" />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '20px' }}>Unclaimed Benefit Form</div>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button style={{visibility: "hidden"}}
                                  className="fmSmtButton saveColor saveBtn"
                                  elname="save"
                                  type="button"
                                  onClick={this.props.logOut} title="Logout"
                                >
                                  {/* <em>Logout</em> */}
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>


                      </li>
                    </ul>
                    <Router>
                      <div
                        id="formBodyDiv"
                        className="formRelative subContWrap topAlign"
                      >
                        <div className="pBarWrapper ">
                          <table
                            id="navigBar"
                            width="100%"
                            border="0"
                            cellSpacing="0"
                            cellPadding="0"
                            pagecount="11"
                            navigtype="1"
                          // currentPage="1"
                          ><tbody>
                              <tr className="pBarHeader">


                                <td className={`selected ${this.state.currentPage === 1 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>1</b>
                                  </em>
                                </td>
                                <td className="selected">
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 2 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>2</b>
                                  </em>
                                </td>
                                <td className="selected">
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 3 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>3</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 3 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 4 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>4</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 4 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 5 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>5</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 5 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 6 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>6</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 6 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 7 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>7</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 7 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 8 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>8</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 8 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>


                                <td className={`selected ${this.state.currentPage === 9 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                  <em className="pNumber">
                                    <b>9</b>
                                  </em>
                                </td>
                                <td className={`selected ${this.state.currentPage === 9 ? 'currentPTab' : ''}`}>
                                  <div className="pBar"></div>
                                </td>
                              </tr>
                              <tr className="pTitle">
                                <td colSpan="2">Your option</td>
                                <td colSpan="2">Required documents</td>
                                <td colSpan="2">Member details</td>
                                <td colSpan="2">Withdrawal</td>

                                <td colSpan="2">Full Transfer of benefits</td>
                                <td colSpan="2">Transfer and Cash</td>
                                <td colSpan="2">Retirement</td>
                                <td colSpan="2">Payment details</td>

                                <td colSpan="2">Preview</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <Modal
                            isOpen={this.state.missingPageModal}
                            contentLabel="Print"
                            className="myModal"
                            id={'un-submitted-modal'}
                            overlayClassName="myOverlay"
                        >
                          <div className='un-submitted-modal'>
                            <p><span style={{ fontWeight: 'bold' }}>Note: </span>
                              {
                                this.state.userRole === 'Member' ? (<span>Please Share the page with your  <span style={{ fontWeight: 'bold' }}>employer</span> by clicking Share button. Your <span style={{ fontWeight: 'bold' }}>employer</span> will complete the remaining relevant section.</span>) : null
                              }
                              {
                                this.state.userRole === 'Employer' ? (<span>Please Share the page with your  <span style={{ fontWeight: 'bold' }}>member</span> by clicking Share button. Your <span style={{ fontWeight: 'bold' }}>member</span> will complete the remaining relevant section.</span>) : null
                              }
                              {
                                this.state.userRole === 'FA' ? 'Please revisit all the pages to enter missing information' : null
                              }

                            </p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px'}}>
                            <button className="fmSmtButton saveColor saveBtn" onClick={() => this.shareDocument()}>Share</button>
                            <button className="fmSmtButton" style={{ background: '#494949', border: '1px solid #494949', color: '#fff' }} onClick={() => this.closeMissingPagesModal()}>Close</button>
                          </div>
                        </Modal>
                        <Modal
                          isOpen={this.state.is_un_submitted_form_exists}
                          onRequestClose={() => this.closeUnSubmittedModal()}
                          contentLabel="Print"
                          className="myModal"
                          overlayClassName="myOverlay"
                        >
                          <div className='un-submitted-modal'>
                            <div className='text'>We have saved your form and you can continue your submission process by clicking this link</div>
                            <div onClick={() => this.closeUnSubmittedModal()}><Link to={`/?uuid=${this.state.form_id}`}> {`${window.location.origin}/?uuid=${this.state.form_id}`}</Link></div>
                            <button className="fmSmtButton saveColor saveBtn" style={{ marginTop: '20px' }} onClick={() => this.closeUnSubmittedModal()}>Close</button>
                          </div>
                        </Modal>
                        <Modal
                          isOpen={this.state.is_form_submitted && this.state.form_submitted_modal}
                          onRequestClose={() => this.closeModal()}
                          contentLabel="Print"
                          className="myModal"
                          overlayClassName="myOverlay"
                        >
                          <div style={{ textAlign: 'center' }}>
                            <div>This Form is already submitted, Hence you will have only read Access.</div>
                            <button className="fmSmtButton saveColor saveBtn" style={{ marginTop: '20px' }} onClick={() => this.closeModal()}>Ok</button>
                          </div>
                        </Modal>
                        <div className="formFieldWrapper">
                          <Switch>
                            {/* <Route
                              exact
                              path="/"
                              render={() => (
                                <Home
                                  homePage={ref => {
                                    this.homePageRef = ref;
                                  }}
                                  handleCheck={this.handleCheck}
                                  handleNav={this.handleNav}
                                  values={values}
                                  routeChanged={this.handleRouteChange.bind(this)}
                                />
                              )}
                            /> */}

                            <Route
                              exact
                              path="/"
                              render={() => (
                                <YourOption
                                  handleChange={this.handleChange}
                                  handleYourOptions={this.handleYourOptions}
                                  handleReasonForClaim={this.handleReasonForClaim}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/requiredDocuments"
                              render={() => (
                                <RequiredDocuments
                                  handleChange={this.handleChange}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                              />
                              )}
                            />

                            <Route
                              path="/memberDetails"
                              render={() => (
                                <MemberDetails
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/withdrawal"
                              render={() => (
                                <Withdrawal
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/fullTransferOfBenefits"
                              render={() => (
                                <FullTransferOfBenefits
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/transferAndCash"
                              render={() => (
                                <TransferAndCash
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/retirementNew"
                              render={() => (
                                <RetirementNew
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/paymentDetails"
                              render={() => (
                                <PaymentDetails
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />

                            <Route
                              path="/previewNew"
                              render={() => (
                                <PreviewNew
                                  handleChange={this.handleChange}
                                  handleMaintenance={this.handleMaintenance}
                                  handleClaimOption={this.handleClaimOption}
                                  handleNav={this.handleNav}
                                  values={values}
                                  is_form_submitted={this.state.is_form_submitted}
                                />
                              )}
                            />



                            <Route
                              path="/save"
                              render={() => (
                                <Save
                                  handleNav={this.handleNav}
                                  values={values}
                                />
                              )}
                            />

                            <Route
                              path="/submit"
                              render={() => (
                                <Submit
                                  handleNav={this.handleNav}
                                  values={values}
                                />
                              )}
                            />
                          </Switch>
                        </div>

                        <div className="brandingWrapper">
                          <div className="brandingTextCont">
                            <p>
                            <span>Do not submit confidential information such as credit card details, Mobile and ATM PINs, account passwords, etc.<a href="https://www.zoho.com/report-abuse/" target="_blank">Report Abuse</a></span>
                            </p>
                            {/* <a href="https://www.google.com" target="_blank">Report Abuse</a> */}
                          </div>
                          <div className="brandingLogoCont">
                            <img src={logo} align="absbottom" alt="logo" />
                          </div>
                        </div>
                      </div>
                    </Router>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
