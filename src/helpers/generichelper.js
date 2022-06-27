const UN_SUBMITTED_FORM = 'un-submitted-form';

export const storePartialForm = (uuid) => {
  const obj = {
    uuid,
    location: window.location.pathname
  }
  localStorage.setItem(UN_SUBMITTED_FORM, JSON.stringify(obj));
}

export const removeSubmittedForm = () => {
  localStorage.removeItem(UN_SUBMITTED_FORM);
}

export const getPartialForm = () => {
  return JSON.parse(localStorage.getItem(UN_SUBMITTED_FORM))
};