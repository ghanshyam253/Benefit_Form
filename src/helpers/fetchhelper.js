import axios from "axios";
import {storePartialForm, removeSubmittedForm} from "./generichelper";


export const saveDocument = (body, callback) => {
  // if(body.info.is_form_submitted) {
  //   removeSubmittedForm();
  // } else {
  //   storePartialForm(body.uuid);
  // }

  // const token = localStorage.getItem("id-token");
  // const optionHeaderObj = {
  //   headers: {
  //     Authorization: 'Bearer ' + token
  //   }
  // };

  // axios.post('/api/datasave/store', body, optionHeaderObj)
  //   .then(res => {
  //     callback && callback()
  //   })
  //   .catch(error => {
  //     alert(error);
  //   });
}

export const fileUpload = (uniqueId, form, callback) => {
  const token = localStorage.getItem("id-token");
  axios({
    method: "post",
    url: "/api/file/fileupload/" + uniqueId,
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + token
    },
  }).then( res => {
    callback && callback(res);
  }).catch(error => {
    callback && callback(error.response);
  });
};

export const sendMail = (uniqueId, mailApiBody, callback) => {
  const token = localStorage.getItem("id-token");
  axios.post("/api/mail/sendmail/" + uniqueId, mailApiBody, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => {
    callback && callback(res);
  })
}

export const getImageUrl = (uniqueId, name, callback) => {
  const token = localStorage.getItem("id-token");
  axios.post("/api/mail/getURL/" + uniqueId + "/" + name, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => {
    callback && callback(res);
  })
}