/** @format */

import { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
// import { v1 as uuidv1 } from 'uuid';

/**
 * detech screen size and return is mobile view or not
 *
 */
export const isMobileView = (screenWidth: number): boolean => {
  return screenWidth < 768;
};

export const isLaptopView = (screenWidth: number): boolean => {
  return screenWidth < 1400;
};

export function isIpAddress(ipAddress: any) {
  const ipAddressPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return ipAddressPattern.test(ipAddress);
}

// export const generateId = () => {
//   return uuidv1().replace(/^(.{4})(.{4})-(.{4})-(.{4})/, '$4$3-$1-$2');
// };

export function numberOnly(evt: any) {
  var x = evt.which || evt.keyCode;

  if (x === 13) return; // if enter key stop here;

  if (
    x === 8 ||
    x === 9 ||
    x === 46 ||
    (x >= 96 && x <= 105) ||
    (x >= 48 && x <= 57) ||
    (x >= 37 && x <= 40)
  ) {
  } else {
    evt.preventDefault();
    return false;
  }
}

export function sortAlphabetically(a: any, b: any) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}

export function useDebounce(value: any, delay: any) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

// check for base64
export function isBase64(encodedString: any) {
  if (encodedString) {
    return encodedString.includes('data:image/png;base64'); // return TRUE if its base64 string.
  }
  return false;
}


// check for base64
export function isPdfBase64(encodedString: any) {
  if (encodedString) {
    return encodedString.includes('data:application/pdf;base64'); // return TRUE if its base64 string.
  }
  return false;
}

// pagination
export function getItemsForPage(
  dataset: [],
  currentPage: number,
  itemsPerPage: number
): any[] {
  const totalItems = dataset.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const itemsForPage = dataset.slice(startIndex, endIndex);

  return itemsForPage;
}

export function trimWhiteSpace(e: any) {
  e.target.value = e.target.value.trimStart();
}

//123,456
export function numberWithCommas(x: any) {
  return x.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

// カタカナ→ひらがな
export function katakanaToHiragana(src: any) {
  return src.replace(/[\u30a1-\u30f6]/g, function (match: any) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

//full width to half width
export function fullWidthToHalfWidth(input: any) {
  // Define a map of full-width characters to their half-width counterparts
  const fullWidth =
    '０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ－＿';
  const halfWidth =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

  // Replace full-width characters with their corresponding half-width characters
  const result = input.replace(/[Ａ-Ｚａ-ｚ０-９－＿－]/g, (char: any) =>
    halfWidth.charAt(fullWidth.indexOf(char))
  );

  return result;
}

export function truncateText(text: string, limit: number) {
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
}

export const resizeMainImage = async (
  file: any,
  generateThumb = true,
  maxWidthOrHeight: any,
  thumbOptions?: any
) => {
  const options = {
    maxSizeMB: 10,
    maxWidthOrHeight: maxWidthOrHeight || 1920,
    useWebWorker: false,
    fileType: file.type,
  };

  const _thumbOptions = {
    maxSizeMB: thumbOptions?.maxSizeMB,
    maxWidthOrHeight: thumbOptions?.maxWidthOrHeight || 60,
    useWebWorker: false,
    fileType: file.type,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const blob = await imageCompression(file, options);
      const newFile = new File([blob], file.name, {
        type: blob.type,
      });
      /**
       * use seperate compression option for better performance as converting to
       * base64 takes longer
       */
      const thumbBlob = generateThumb ? await imageCompression(file, _thumbOptions) : null;
      const base64Img = generateThumb && thumbBlob ? await imageCompression.getDataUrlFromFile(thumbBlob) : null;
      resolve({ image: newFile, thumbnail: base64Img, type: blob.type });
    } catch (error) {
      reject(error);
    }
  });
};

export function isImage(file: any) {
  return file instanceof File && file.type.startsWith('image/');
}