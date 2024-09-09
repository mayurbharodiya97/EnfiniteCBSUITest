export const downloadFile = (url: string, fileName: string) => {
  const a = document.createElement("a");
  a.href = String(url);
  a.download = fileName;
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(String(url));
      a.removeEventListener("click", clickHandler);
    }, 150);
  };
  a.target = "_blank";
  a.addEventListener("click", clickHandler, false);
  a.click();
};
