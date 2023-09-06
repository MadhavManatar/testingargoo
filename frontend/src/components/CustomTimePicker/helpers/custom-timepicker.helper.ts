/* eslint-disable no-continue */

export const initialNumbersValue = (
  heightValue = 54,
  numbersLength = 24,
  value: number | null = null
) => {
  const initialValue24hourFormat: {
    number: string;
    translatedValue: string;
    selected: boolean;
    hidden?: boolean;
  }[] = [
    {
      number: '00',
      translatedValue: (heightValue * 2).toString(),
      selected: false,
      hidden: true,
    },
  ];

  const initialValue12hourFormat = [
    {
      number: '00',
      translatedValue: heightValue.toString(),
      selected: false,
      hidden: true,
    },
  ];
  const arrayOfSelectedValue =
    numbersLength === 13 ? initialValue12hourFormat : initialValue24hourFormat;
  let count = heightValue;
  for (let j = 0; j < numbersLength; j++) {
    if (
      (numbersLength === 13 && j === 0) ||
      (numbersLength !== 13 && j % 5 !== 0)
    ) {
      continue;
    }
    if (j === value) {
      if (`${j}`.length === 1) {
        arrayOfSelectedValue.push({
          number: `0${j}`,
          translatedValue: `${count}`,
          selected: true,
        });
      } else {
        arrayOfSelectedValue.push({
          number: `${j}`,
          translatedValue: `${count}`,
          selected: true,
        });
      }
      count -= heightValue;
      continue;
    }
    if (`${j}`.length === 1) {
      arrayOfSelectedValue.push({
        number: `0${j}`,
        translatedValue: `${count}`,
        selected: false,
      });
    } else {
      arrayOfSelectedValue.push({
        number: `${j}`,
        translatedValue: `${count}`,
        selected: false,
      });
    }

    count -= heightValue;
  }

  return arrayOfSelectedValue;
};

export const returnSelectedValue = (heightValue = 54, numbersLength = 24) => {
  const arrayOfSelectedValue: {
    number: string;
    translatedValue: string;
    arrayNumber?: number;
    selected?: boolean;
  }[] = [
    {
      number: '00',
      translatedValue: (heightValue * 2).toString(),
      arrayNumber: 0,
    },
  ];
  let count = heightValue;
  for (let j = 0; j < numbersLength; j++) {
    if (numbersLength === 13 && j === 0 || numbersLength !== 13 && j % 5 !== 0) {
      continue;
    }
    if (`${j}`.length === 1) {
      arrayOfSelectedValue.push({
        number: `0${j}`,
        translatedValue: `${count}`,
        selected: false,
      });
    } else {
      arrayOfSelectedValue.push({
        number: `${j}`,
        translatedValue: `${count}`,
        selected: false,
      });
    }

    count -= heightValue;
  }
  return arrayOfSelectedValue;
};
