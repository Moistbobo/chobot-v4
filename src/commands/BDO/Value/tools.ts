const formatNumber = (num: number): String => parseFloat(num.toFixed(0)).toLocaleString('en-US');

const toHumanReadable = (num: number): String => {
  const numString = num.toString();
  let returnString = '';

  if (num >= 1000000000) {
    returnString = `${(parseFloat(numString) / 1000000000)}bil`;
  } else if (num >= 1000000) {
    returnString = `${(parseFloat(numString) / 1000000)}mil`;
  }

  return returnString;
};

const wrapInputWithFormatting = (str: String): String => ` \`(${str})\` `;

const toMachineReadable = (num: String): number => {
  const numLower = num.toLowerCase();
  if (numLower.split('b').length > 1) {
    return parseFloat(numLower.split('b')[0]) * 1000000000;
  } if (numLower.split('m').length > 1) {
    return parseFloat(numLower.split('m')[0]) * 1000000;
  } if (numLower.split('k').length > 1) {
    return parseFloat(numLower.split('k')[0]) * 1000;
  }
  return -1;
};

const startsWithNumber = (content: string): boolean => {
  const regex = /^[0-9]/;
  return regex.test(content);
};

const formattedPrice = (value: number, needHumanReadable: boolean) => {
  const humanReadable = needHumanReadable
    ? wrapInputWithFormatting(toHumanReadable(value))
    : '';
  return `\`${value}\`${humanReadable}`;
};

export default {
  formatNumber,
  toHumanReadable,
  wrapInputWithFormatting,
  toMachineReadable,
  startsWithNumber,
  formattedPrice,
};
