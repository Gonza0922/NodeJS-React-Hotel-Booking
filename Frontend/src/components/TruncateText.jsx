function TruncateText({ text, maxLength }) {
  const truncate = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    const firstDotIndex = text.substring(0, maxLength).lastIndexOf(".");
    if (firstDotIndex === -1) {
      return text.substring(0, maxLength).trim() + "...";
    } else {
      return text.substring(0, firstDotIndex + 1).trim();
    }
  };
  const truncatedText = truncate(text, maxLength);
  return <p>{truncatedText}</p>;
}

export default TruncateText;
