let windowObjRef: Window | null = null;
let previousUrl: string = '';

export const openSignInWindow = (url: string) => {
  const name = 'Wait...';
  const strWindowFeatures =
    'toolbar=no, menubar=no, location=no, status=no, scrollbar=no\
         width=600, height=700, top=100, left=100';

  if (windowObjRef === null || windowObjRef.closed) {
    windowObjRef = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    windowObjRef = window.open(url, name, strWindowFeatures);
    windowObjRef!.focus();
  } else windowObjRef.focus();
  previousUrl = url;
};
