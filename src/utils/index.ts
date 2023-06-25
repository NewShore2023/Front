export const checkITextIsValid = (text: any) => {
  const validTextRegex = /^[A-Za-z\s]+$/;
  const textRegExp = new RegExp(validTextRegex);
  return textRegExp.test(text);
};
export const checkIsValidEqualsOriginAndDestination = (
  origin: any,
  destination: any
) => {
  if (origin === destination) {
    return true;
  } else {
    return false;
  }
};
